
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { ParcelServices } from "./parcel.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

// =============== Get Parcel by ID ===============

const getParcelById = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parcelId = req.params.id;

  try {
    const parcel = await ParcelServices.getParcelById(parcelId, verifiedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel fetched successfully",
      data: parcel,
    });
  } catch (error: any) {
    res.status(httpStatus.NOT_FOUND).json({ success: false, message: error.message });
  }
});
    
// =============== Get All Parcels for Sender & RECEIVER===============
const getMyParcels = catchAsync(async  (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;
  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const parcels = await ParcelServices.getMyParcels(verifiedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Fetched parcels successfully",
    data: parcels,
  });
});


export const ParcelControllers = {
   
    getMyParcels,
    getParcelById
}

