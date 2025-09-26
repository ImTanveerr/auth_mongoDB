import { Schema, model, Types } from 'mongoose';
export enum ParcelStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",

  CANCELLED = "CANCELLED",
  RECEIVED = "RECEIVED",
  RETURNED = "RETURNED"
}

export enum ParcelType {
  DOCUMENT = "DOCUMENT",
  BOX = "BOX",
  FRAGILE = "FRAGILE",
  OTHER = "OTHER",
}

export interface ITrackingEvent {
  location: string;
  status: ParcelStatus;
  timestamp: Date;
  note?: string;
}

export interface IParcel {
  _id?: Types.ObjectId;

  senderId: Types.ObjectId;

  receiverId: Types.ObjectId;


  pickupAddress: string;
  deliveryAddress: string;
  contactNumber: string;

  weight: number;
  cost: number;
  parcelType: ParcelType;
  description?: string;

  status?: ParcelStatus;

  trackingId?: string;
  trackingEvents?: ITrackingEvent[];

  createdAt?: Date;
  updatedAt?: Date;
}

const trackingEventSchema = new Schema(
  {
    location: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false } // avoid creating _id for subdocuments
);

const parcelSchema = new Schema<IParcel>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    receiverId: {
       type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.PENDING,
    },
    trackingId: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined values to not violate uniqueness
    },
    trackingEvents: {
      type: [trackingEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Parcel = model<IParcel>('Parcel', parcelSchema);
