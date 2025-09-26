
import { IParcel, Parcel, ParcelStatus, ParcelType } from "../parcel/parcel.model";
import { Types } from "mongoose";
import { Role } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";


const createParcel = async (
  parcelData: Omit<IParcel, "cost">,
  userRole: Role
) => {
  // Only Sender can access this
  if (userRole !== Role.VENDOR) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized. Only senders can create parcels.");
  }

  const { weight, parcelType } = parcelData;

  let cost = 0;

  switch (parcelType) {
    case ParcelType.DOCUMENT:
      cost = 50 + weight * 5;
      break;
    case ParcelType.BOX:
      cost = 100 + weight * 10;
      break;
    case ParcelType.FRAGILE:
      cost = 150 + weight * 15;
      break;
    case ParcelType.OTHER:
    default:
      cost = 150 + weight * 20;
      break;
  }

  const newParcel = await Parcel.create({
    ...parcelData,
    cost,
  });

  return newParcel;
};




const cancelParcel = async (
  parcelId: string,
  senderId: string | Types.ObjectId,
  userRole: Role
) => {
  // Only sender can access this
  if (userRole !== Role.VENDOR) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized. Only sender can cancel this parcel.");
  }

  // Find parcel by ID and senderId (not receiverId!)
  const parcel = await Parcel.findOne({ _id: parcelId, senderId });

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found or you are not authorized to cancel this parcel.");
  }

  if (parcel.status === ParcelStatus.RECEIVED || parcel.status === ParcelStatus.CANCELLED) {
    throw new AppError(httpStatus.BAD_REQUEST, `This parcel is already ${parcel.status}.`);
  }

  parcel.status = ParcelStatus.CANCELLED;
  await parcel.save();

  return parcel;
};




const AcceptReturnParcel = async (
  parcelId: string,
  senderId: string | Types.ObjectId,
  userRole: Role
) => {
  // Only sender can access this
  if (userRole !== Role.VENDOR) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized. Only sender can accept return for this parcel."
    );
  }

  // Find parcel by ID and senderId
  const parcel = await Parcel.findOne({ _id: parcelId, senderId });

  if (!parcel) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Parcel not found or you are not authorized to accept return for this parcel."
    );
  }

  // Ensure parcel is eligible for return acceptance
  if (parcel.status === ParcelStatus.CANCELLED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This parcel is already cancelled."
    );
  }

  if (parcel.status === ParcelStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This parcel is already pending."
    );
  }

  // Update status to PENDING
  parcel.status = ParcelStatus.PENDING;
  await parcel.save();

  return parcel;
};





export const SenderServices = {
  createParcel,
  cancelParcel,
  AcceptReturnParcel
};