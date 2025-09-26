import { Query } from "mongoose";
/* eslint-disable @typescript-eslint/no-explicit-any */

const EXCLUDE_FIELDS = ["sort", "page", "limit", "fields", "searchTerm"];

export class QueryBuilder<T> {
  private modelQuery: Query<T[], T>;
  private filters: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, filters: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.filters = { ...filters };
  }

  // Apply search on multiple fields using regex
  search(searchableFields: string[]): this {
    const searchTerm = this.filters.searchTerm;

    console.log("Search term:", searchTerm);
    if (searchTerm && searchableFields.length > 0) {
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery);
    }
    return this;
  }

  // Apply filters (excluding meta fields), with safe type coercion
  filter(): this {
    const queryObj: Record<string, any> = {};

    for (const key in this.filters) {
      if (!EXCLUDE_FIELDS.includes(key)) {
        const value = this.filters[key];
        // Try to convert numeric strings to numbers
        const parsed = Number(value);
        queryObj[key] = !isNaN(parsed) && value.trim() !== "" ? parsed : value;
      }
    }

    this.modelQuery = this.modelQuery.find(queryObj);
    return this;
  }

  // Sort the results
  sort(): this {
    const sortBy = this.filters.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  // Select specific fields
  fields(): this {
    if (this.filters.fields) {
      const fieldList = this.filters.fields.split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fieldList);
    }
    return this;
  }

  // Apply pagination
  paginate(): this {
    const page = Math.max(Number(this.filters.page) || 1, 1);
    const limit = Math.max(Number(this.filters.limit) || 10, 1);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Build and return the query
  build() {
    return this.modelQuery;
  }

  // Generate meta data like total documents, current page, and total pages
  async getMeta() {
    const page = Math.max(Number(this.filters.page) || 1, 1);
    const limit = Math.max(Number(this.filters.limit) || 10, 1);

    // Note: use unpaginated query for count
    const total = await this.modelQuery.model.countDocuments(this.modelQuery.getQuery());

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
}