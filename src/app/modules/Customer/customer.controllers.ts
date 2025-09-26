
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { ReceiverServices } from "./customer.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ========== Get the incoming parcels=========

const IncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Only receivers are allowed to view incoming parcels.",
    });
    return;
  }

  const parcels = await ReceiverServices.IncomingParcels(verifiedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Incoming parcels fetched successfully",
    data: parcels,
  });
});



// ============= Confirm the Delivery ============

const ReceiveParcel= catchAsync(async (req: Request, res: Response) => {
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
    const updatedParcel = await ReceiverServices.ReceiveParcel(parcelId, verifiedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delivery confirmed successfully",
      data: updatedParcel,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
});


// ============= Confirm the Delivery ============

const ReturnParcel= catchAsync(async (req: Request, res: Response) => {
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
    const updatedParcel = await ReceiverServices.ReturnParcel(parcelId, verifiedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delivery confirmed successfully",
      data: updatedParcel,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
});


// ========== Get the Delivered parcels=========
const DeliveredParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string; role: string };

  if (!verifiedToken?.userId ) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Only receivers are allowed to view delivered parcels.",
    });
    return;
  }

  const parcels = await ReceiverServices.DeliveredParcels(verifiedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Delivered parcels fetched successfully",
    data: parcels,
  });
});

export const ReceiverControllers = {
   
    IncomingParcels,
    ReceiveParcel,
    DeliveredParcels,
    ReturnParcel
}

