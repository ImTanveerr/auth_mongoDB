import { Router } from "express";
import { SenderControllers } from "./vendor.controllers";

const router = Router();

router.post("/create",  SenderControllers.createParcel);
router.post("/Cancel/:id", SenderControllers.CancelParcel);
router.post("/Accept/:id", SenderControllers.AcceptReturnParcel);

export const SenderRoutes = router;