import { Router } from "express";
import { ReceiverControllers } from "./customer.controllers";

const router = Router();

router.get("/incoming-parcel", ReceiverControllers.IncomingParcels);  // receiver get the pending parcel
router.get("/delivered-parcel", ReceiverControllers.DeliveredParcels);  // receiver get the Delivered parcel
router.post("/return/:id", ReceiverControllers.ReturnParcel);  // receiver return the parcel
router.post("/accept/:id",ReceiverControllers.ReceiveParcel);  // receiver accept the parcel
//router.post("/accept-parcel/:id", checkAuth(Role.RECEIVER),ReceiverControllers.ReceiveParcel);  // receiver accept the parcel



export const ReceiverRoutes = router;