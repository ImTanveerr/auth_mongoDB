import { Router } from "express";
import { ParcelControllers } from "./parcel.controllers";


const router = Router();
router.get("/get-parcel/:id", ParcelControllers.getParcelById);
router.get("/get", ParcelControllers.getMyParcels);


export const ParcelRoutes = router;