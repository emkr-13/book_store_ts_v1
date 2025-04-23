import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";

import {
  createPublisher,
  deletePublisher,
  listPublisher,
  getPublisherById,
  updatePublisher,
} from "../controllers/publisherController";
const router = Router();
// Route to get all publishers
router.get("/all", authenticate, listPublisher);
// Route to get publisher by ID
router.get("/detail", authenticate, getPublisherById);
// Route to create a new publisher
router.post("/create", authenticate, createPublisher);
// Route to update a publisher
router.put("/update", authenticate, updatePublisher);
// Route to delete a publisher
router.delete("/delete", authenticate, deletePublisher);
export default router;