
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { SenderServices } from "./vendor.services";
import AppError from "../../errorHelpers/AppError";
import { Role, User, UserStatus } from "../user/user.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

// =============== Create Parcel ===============

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Access token not found in cookies.",
    });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as {
    userId: string;
    role: Role;
  };

  if (!verifiedToken?.userId || !verifiedToken?.role) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Invalid token payload.",
    });
    return;
  }

  const user = await User.findById(verifiedToken.userId);
  if (!user) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. User not found.",
    });
    return;
  }

  if (user.Status === UserStatus.BANNED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been banned. Please contact support."
    );
  }

  // Ensure only senders can create parcels
  if (verifiedToken.role !== Role.VENDOR) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Only senders can create parcels.");
  }

  const parcelData = {
    ...req.body,
    senderId: verifiedToken.userId,
  };

  const newParcel = await SenderServices.createParcel(parcelData, verifiedToken.role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: newParcel,
  });
});


// =============== Cancel Parcel ===============
const CancelParcel = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as {
    userId: string;
    role: Role;
  };

  if (!verifiedToken?.userId || !verifiedToken?.role) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parcelId = req.params.id;

  try {
    const updatedParcel = await SenderServices.cancelParcel(
      parcelId,
      verifiedToken.userId,
      verifiedToken.role
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel cancelled successfully",
      data: updatedParcel,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

const AcceptReturnParcel = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as {
    userId: string;
    role: Role;
  };

  if (!verifiedToken?.userId || !verifiedToken?.role) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parcelId = req.params.id;

  try {
    const updatedParcel = await SenderServices.AcceptReturnParcel(
      parcelId,
      verifiedToken.userId,
      verifiedToken.role
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Return Parcel Accepted successfully",
      data: updatedParcel,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
});



export const SenderControllers = {
  createParcel,
  CancelParcel,
  AcceptReturnParcel

}

