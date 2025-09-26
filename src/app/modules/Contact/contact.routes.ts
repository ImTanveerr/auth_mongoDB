import { Router } from "express";
import { ContactControllers } from "./contact.controller";

const router = Router();

router.post("/", ContactControllers.createContact);
router.get("/", ContactControllers.getAllContacts);

export const ContactRoutes = router;
