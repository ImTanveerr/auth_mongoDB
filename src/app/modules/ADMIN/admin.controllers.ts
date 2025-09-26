
import {  Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

// Update user function
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
   
    const payload = req.body;
    const user = await AdminServices.updateUser(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})



// Block user function
const BlockUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = await AdminServices.BlockUser(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User blocked successfully.",
        data: user,
    });
});
// UnBlock user function
const UnBlockUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await AdminServices.UnBlockUser(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User is active again.",
        data: user,
    });
});

// Get all users function
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getAllUsers(req.query);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
       meta: result.meta,
      
    })
})


const getAllParcels = catchAsync(async (req: Request, res: Response) => {


  const result = await AdminServices.getAllParcels(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updateParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  
    const payload = req.body;

  const parcel = await AdminServices.updateParcel(parcelId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel updated successfully",
    data: parcel,
  });
});


const ApproveParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;



  const parcel = await AdminServices.ApproveParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel approved successfully",
    data: parcel,
  });
});
const DeliverParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;



  const parcel = await AdminServices.DeliverParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel Deliver successfully",
    data: parcel,
  });
});


const CancelParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;


  const parcel = await AdminServices.CancelParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel cancelled successfully",
    data: parcel,
  });
});

const DeleteParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;

 

  await AdminServices.DeleteParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel deleted successfully",
    data: null,
  });
});

const DeleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;



  await AdminServices.DeleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null
  });
});


export const AdminControllers = {
    getAllParcels,
    updateParcel,
    getAllUsers,
    updateUser,
    BlockUser,
    UnBlockUser,
    ApproveParcel,
    CancelParcel,
    DeliverParcel,
    DeleteParcel,
    DeleteUser
}

