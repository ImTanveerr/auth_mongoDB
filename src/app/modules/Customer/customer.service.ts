import { Parcel, ParcelStatus } from "../parcel/parcel.model";
import { Types } from "mongoose";


const ReceiveParcel = async (parcelId: string, receiverId: string | Types.ObjectId) => {
  // Find parcel by ID and receiverId
  const parcel = await Parcel.findOne({ _id: parcelId, receiverId });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to confirm this delivery.");
  }

  if (parcel.status === ParcelStatus.RECEIVED || parcel.status === ParcelStatus.CANCELLED ) {

    throw new Error(`This parcel is already ${parcel.status}.`);
  }


  if (parcel.status !== ParcelStatus.DELIVERED ) {
    throw new Error("This parcel is not DELIVERED yet");
  }

  const trackingEvent = {
        location: parcel.deliveryAddress || "Unknown",
        status: ParcelStatus.RECEIVED,
        timestamp: new Date(),
        note: "Parcel Received by receiver",
    };

    // Update parcel status and trackingEvents
    parcel.status = ParcelStatus.RECEIVED;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];
  await parcel.save();

  return parcel;
};



const ReturnParcel = async (parcelId: string, receiverId: string | Types.ObjectId) => {
  // Find parcel by ID and receiverId
  const parcel = await Parcel.findOne({ _id: parcelId, receiverId });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to confirm this delivery.");
  }


  if (parcel.status === ParcelStatus.RETURNED || parcel.status === ParcelStatus.CANCELLED) {
    throw new Error(`This parcel is already ${parcel.status}.`);
  }

  if (parcel.status !== ParcelStatus.DELIVERED && parcel.status !== ParcelStatus.RECEIVED) {
    throw new Error(`parcel is not in a state to be returned. Current status: ${parcel.status}`);
  }

  
  

const trackingEvent = {
        location: parcel.deliveryAddress || "Unknown",
        status: ParcelStatus.RETURNED,
        timestamp: new Date(),
        note: "Parcel Returned by receiver",
    };

    // Update parcel status and trackingEvents
    parcel.status = ParcelStatus.RETURNED;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];



  await parcel.save();

  return parcel;
};



const IncomingParcels = async (receiverId: string | Types.ObjectId) => {
   const excludedStatuses = [
    ParcelStatus.DELIVERED,
    ParcelStatus.CANCELLED,
    ParcelStatus.RECEIVED,
  ];

  const parcels = await Parcel.find({
    receiverId,
    status: { $nin: excludedStatuses }, 
  }).sort({ createdAt: -1 });

  return parcels;
};


const DeliveredParcels = async (receiverId: string | Types.ObjectId) => {
  const parcels = await Parcel.find({
    receiverId,
    status: "DELIVERED",
  }).sort({ createdAt: -1 });

  return parcels;
};
export const ReceiverServices = {
  ReceiveParcel, 
  IncomingParcels, 
  DeliveredParcels, 
  ReturnParcel
};