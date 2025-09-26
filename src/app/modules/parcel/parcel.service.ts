
import { Parcel } from "../parcel/parcel.model";

import { Types } from "mongoose";


const getMyParcels = async (userId: string | Types.ObjectId) => {
  const parcels = await Parcel.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name')
    .populate('receiverId', 'name');
  return parcels;
  
};



const getParcelById = async (parcelId: string, userId: string | Types.ObjectId) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to access this parcel.");
  }

  return parcel;
};



export const ParcelServices = {
  getMyParcels,
  getParcelById
 
};