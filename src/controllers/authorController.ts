import { db } from "../config/db";
import { eq, sql, ilike, and, isNull } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { authors } from "../models/author";
import { pagination } from "../utils/helper";

export const listAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided
    const search = req.query.search as string | undefined; // Search parameter (optional)

    // Build the base query with soft delete filter
    let query = db
      .select()
      .from(authors)
      .where(
        search
          ? and(isNull(authors.deletedAt), ilike(authors.name, `%${search}%`))
          : isNull(authors.deletedAt)
      );

    // Count the total number of records in the database
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(authors)
      .where(
        search
          ? and(isNull(authors.deletedAt), ilike(authors.name, `%${search}%`))
          : isNull(authors.deletedAt)
      );

    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);

    // Fetch the data for the current page
    const data = await query.limit(limit).offset((page - 1) * limit);

    sendResponse(res, 200, "Authors retrieved successfully", {
      data,
      pagination: paginationResult,
    });
  } catch (error) {
    console.error("Error retrieving authors:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const getAuthorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authorId = req.body;
    if (!authorId) {
      sendResponse(res, 400, "Author ID is required");
      return;
    }

    // Fetch the author by ID
    const author = await db
      .select()
      .from(authors)
      .where(and(eq(authors.id, authorId), isNull(authors.deletedAt)));

    if (!author) {
      sendResponse(res, 404, "Author not found");
      return;
    }

    sendResponse(res, 200, "Author retrieved successfully", { data: author });
  } catch (error) {
    console.error("Error retrieving author:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const createAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, bio } = req.body;

    // Validate input
    if (!name || !bio) {
      sendResponse(res, 400, "Name and email are required");
      return;
    }

    // Insert the new author into the database
    const [newAuthor] = await db
      .insert(authors)
      .values({ name, bio })
      .returning();

    sendResponse(res, 201, "Author created successfully", { data: newAuthor });
  } catch (error) {
    console.error("Error creating author:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { authorId, name, bio } = req.body;

    // Validate input
    if (!authorId || !name || !bio) {
      sendResponse(res, 400, "Author ID, name, and bio are required");
      return;
    }

    // Update the author in the database
    const [updatedAuthor] = await db
      .update(authors)
      .set({ name, bio })
      .where(eq(authors.id, authorId))
      .returning();

    if (!updatedAuthor) {
      sendResponse(res, 404, "Author not found");
      return;
    }

    sendResponse(res, 200, "Author updated successfully", {
      data: updatedAuthor,
    });
  } catch (error) {
    console.error("Error updating author:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const deleteAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authorId = req.body;

    // Validate input
    if (!authorId) {
      sendResponse(res, 400, "Author ID is required");
      return;
    }

    // Soft delete the author by setting deletedAt timestamp
    const [deletedAuthor] = await db
      .update(authors)
      .set({ deletedAt: new Date() })
      .where(eq(authors.id, authorId))
      .returning();

    if (!deletedAuthor) {
      sendResponse(res, 404, "Author not found");
      return;
    }

    sendResponse(res, 200, "Author deleted successfully", {
      data: deletedAuthor,
    });
  } catch (error) {
    console.error("Error deleting author:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
