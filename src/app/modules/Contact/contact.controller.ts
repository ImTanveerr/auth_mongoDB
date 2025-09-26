import { Request, Response } from "express";
import { ContactMessage } from "./contact.model";

export const ContactControllers = {
  createContact: async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;

      const newMessage = await ContactMessage.create({
        name,
        email,
        subject,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Message submitted successfully",
        data: newMessage,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllContacts: async (_req: Request, res: Response) => {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.json({ success: true, data: messages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  resolveContact: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await ContactMessage.findByIdAndUpdate(
        id,
        { status: "resolved" },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }

      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
