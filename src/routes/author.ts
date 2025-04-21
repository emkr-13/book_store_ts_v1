import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createAuthor,
  deleteAuthor,
  listAuthor,
  getAuthorById,
  updateAuthor,
} from "../controllers/authorController";
const router = Router();
// Route to get all authors
router.get("/all", authenticate, listAuthor);
// Route to get author by ID
router.get("/detail", authenticate, getAuthorById);
// Route to create a new author
router.post("/create", authenticate, createAuthor);
// Route to update an author
router.put("/update", authenticate, updateAuthor);
// Route to delete an author
router.delete("/delete", authenticate, deleteAuthor);
export default router;
