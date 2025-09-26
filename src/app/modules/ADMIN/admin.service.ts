import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { UserStatus } from "../user/user.model";
import { User } from "../user/user.model";
import { Parcel, ParcelStatus } from "../parcel/parcel.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { parcelSearchableFields } from "../parcel/parcel.constant";
import { IUser } from "../user/user.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */

const updateUser = async (userId: string, payload: Partial<IUser>) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }


    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}



const BlockUser = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked.");
    }




    user.Status = UserStatus.BLOCKED;
    const updatedUser = await user.save();
    return updatedUser;
};

//unblock user function- unblock mean he is active again
const UnBlockUser = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status !== UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not blocked.");
    }


    user.Status = UserStatus.ACTIVE;
    const updatedUser = await user.save();
    return updatedUser;
};


const getAllUsers = async (filters: Record<string, any>) => {
  // Assuming you have a QueryBuilder similar to parcels
  const builder = new QueryBuilder(User.find({ role: { $ne: "SUPER_ADMIN" } }), filters);

  const resultQuery = builder
    .paginate(); // only pagination for now

  const [data, meta] = await Promise.all([resultQuery.build(), builder.getMeta()]);

  return { data, meta };
};




const getAllParcels = async (filters: Record<string, any>) => {



    const builder = new QueryBuilder(Parcel.find(), filters);

    const resultQuery = builder
        .search(parcelSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        resultQuery.build(),
        builder.getMeta(),
    ]);

    return { data, meta };
};


function generateTrackingId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit
    return `TRK-${datePart}-${randomPart}`;
}

const updateParcel = async (
    parcelId: string, payload: Partial<{ status: ParcelStatus; note?: string; location?: string; }>) => {
    // Find parcel by ID
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    const updateFields: any = { ...payload };

    //  Assign tracking ID and first tracking event if status is APPROVED and no tracking ID yet
    if (payload.status === ParcelStatus.APPROVED && !parcel.trackingId) {
        updateFields.trackingId = generateTrackingId();
        updateFields.trackingEvents = [
            ...(parcel.trackingEvents || []),
            {
                location: payload.location || parcel.pickupAddress,
                status: ParcelStatus.APPROVED,
                timestamp: new Date(),
                note: payload.note || "Parcel approved",
            },
        ];
    }

    // ✅ Add tracking log for any other status update (if tracking already exists)
    if (payload.status && parcel.trackingId) {
        await Parcel.findByIdAndUpdate(parcelId, {
            $push: {
                trackingEvents: {
                    location: payload.location || "Unknown",
                    status: payload.status,
                    timestamp: new Date(),
                    note: payload.note || "",
                },
            },
        });
    }

    // ✅ Update main parcel fields
    const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, updateFields, {
        new: true,
        runValidators: true,
    });

    return updatedParcel;
};


const DeliverParcel = async (parcelId: string) => {


    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (
        parcel.status === ParcelStatus.DELIVERED ||
        parcel.status === ParcelStatus.RECEIVED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Parcel is already ${parcel.status}`
        );
    }

    const trackingId = parcel.trackingId || generateTrackingId();

    const trackingEvent = {
        location: parcel.pickupAddress || "Unknown",
        status: ParcelStatus.DELIVERED,
        timestamp: new Date(),
        note: "Parcel delivered by admin",
    };

    parcel.status = ParcelStatus.DELIVERED;
    parcel.trackingId = trackingId;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];

    const updatedParcel = await parcel.save();
    return updatedParcel;
};




const ApproveParcel = async (parcelId: string) => {


    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (
        parcel.status === ParcelStatus.APPROVED ||
        parcel.status === ParcelStatus.IN_TRANSIT ||
        parcel.status === ParcelStatus.DELIVERED ||
        parcel.status === ParcelStatus.RECEIVED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Parcel is already ${parcel.status}`
        );
    }

    const trackingId = parcel.trackingId || generateTrackingId();

    const trackingEvent = {
        location: parcel.pickupAddress || "Unknown",
        status: ParcelStatus.APPROVED,
        timestamp: new Date(),
        note: "Parcel approved by admin",
    };

    parcel.status = ParcelStatus.APPROVED;
    parcel.trackingId = trackingId;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];

    const updatedParcel = await parcel.save();
    return updatedParcel;
};





const CancelParcel = async (parcelId: string) => {

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (
        parcel.status === ParcelStatus.CANCELLED ||
        parcel.status === ParcelStatus.DELIVERED ||
        parcel.status === ParcelStatus.RECEIVED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Parcel is already ${parcel.status} and cannot be cancelled`
        );
    }


    const trackingEvent = {
        location: parcel.pickupAddress || "Unknown",
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        note: "Parcel cancelled by admin",
    };

    // Update parcel status and trackingEvents
    parcel.status = ParcelStatus.CANCELLED;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];

    const updatedParcel = await parcel.save();
    return updatedParcel;
};




const DeleteParcel = async (parcelId: string) => {

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    // Actually delete the document
    await Parcel.findByIdAndDelete(parcelId);

    return null; // or return a confirmation message/object
};


const DeleteUser = async (userId: string) => {

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }


    await User.findByIdAndDelete(userId);

    return null;
};


export const AdminServices = {
    getAllUsers,
    updateUser,
    getAllParcels,
    updateParcel,
    BlockUser,
    UnBlockUser,
    ApproveParcel,
    DeliverParcel,
    CancelParcel,
    DeleteParcel,
    DeleteUser
}
