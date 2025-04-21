import { db } from "../config/db";
import { eq, sql, ilike, and, isNull } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";

import { pagination } from "../utils/helper";
import { publishers } from "../models/publisher";

export const listPublisher = async (
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
      .from(publishers)
      .where(
        search
          ? and(
              isNull(publishers.deletedAt),
              ilike(publishers.name, `%${search}%`)
            )
          : isNull(publishers.deletedAt)
      );

    // Count the total number of records in the database
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(publishers)
      .where(
        search
          ? and(
              isNull(publishers.deletedAt),
              ilike(publishers.name, `%${search}%`)
            )
          : isNull(publishers.deletedAt)
      );

    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);

    // Fetch the data for the current page
    const data = await query.limit(limit).offset((page - 1) * limit);

    sendResponse(res, 200, "Publishers retrieved successfully", {
      data,
      pagination: paginationResult,
    });
  } catch (error) {
    console.error("Error retrieving publishers:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const getPublisherById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisherId = req.body;
    if (!publisherId) {
      sendResponse(res, 400, "Publisher ID is required");
      return;
    }

    const publisher = await db
      .select()
      .from(publishers)
      .where(eq(publishers.id, publisherId));

    if (!publisher) {
      sendResponse(res, 404, "Publisher not found");
      return;
    }

    sendResponse(res, 200, "Publisher retrieved successfully", publisher);
  } catch (error) {
    console.error("Error retrieving publisher:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const createPublisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, address, phone, description } = req.body;

    if (!name || !address || !phone) {
      sendResponse(res, 400, "All fields are required");
      return;
    }

    const newPublisher = await db
      .insert(publishers)
      .values({ name, address, phone, description })
      .returning();

    sendResponse(res, 201, "Publisher created successfully", newPublisher);
  } catch (error) {
    console.error("Error creating publisher:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const updatePublisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { publisherId, name, address, phone, description } = req.body;

    if (!publisherId) {
      sendResponse(res, 400, "Publisher ID is required");
      return;
    }

    const updatedPublisher = await db
      .update(publishers)
      .set({ name, address, phone, description })
      .where(eq(publishers.id, publisherId))
      .returning();

    if (!updatedPublisher) {
      sendResponse(res, 404, "Publisher not found");
      return;
    }

    sendResponse(res, 200, "Publisher updated successfully", updatedPublisher);
  } catch (error) {
    console.error("Error updating publisher:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const deletePublisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisherId = req.body;

    if (!publisherId) {
      sendResponse(res, 400, "Publisher ID is required");
      return;
    }

    const deletedPublisher = await db
      .update(publishers)
      .set({ deletedAt: new Date() })
      .where(eq(publishers.id, publisherId))
      .returning();

    if (!deletedPublisher) {
      sendResponse(res, 404, "Publisher not found");
      return;
    }

    sendResponse(res, 200, "Publisher deleted successfully", deletedPublisher);
  } catch (error) {
    console.error("Error deleting publisher:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
