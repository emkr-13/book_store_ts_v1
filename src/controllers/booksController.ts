import { db } from "../config/db";
import { eq, sql, ilike, and, isNull } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { pagination } from "../utils/helper";
import { books } from "../models/book";
import { authors } from "../models/author";
import { publishers } from "../models/publisher";


export const listBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided
    const search = req.query.search as string | undefined; // Search parameter (optional)

    // Build the base query with soft delete filter
    let query = db
      .select({
        id: books.id,
        title: books.title,
        authorId: books.authorId,
        publisherId: books.publisherId,
 
        createdAt: books.createdAt,
        updatedAt: books.updatedAt,
        deletedAt: books.deletedAt,
        authorName: authors.name,
        publisherName: publishers.name,
      })
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(publishers, eq(books.publisherId, publishers.id))
      .where(
        search
          ? and(
              isNull(books.deletedAt),
              ilike(books.title, `%${search}%`)
            )
          : isNull(books.deletedAt)
      );

    // Count the total number of records in the database
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(
        search
          ? and(
              isNull(books.deletedAt),
              ilike(books.title, `%${search}%`)
            )
          : isNull(books.deletedAt)
      );

    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);

    // Fetch the data for the current page
    const data = await query.limit(limit).offset((page - 1) * limit);

    sendResponse(res, 200, "Books retrieved successfully", {
      data,
      pagination: paginationResult,
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    sendResponse(res, 500, "Internal server error");
  }
}

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      sendResponse(res, 400, "Book ID is required");
      return;
    }

    const book = await db
      .select({
        id: books.id,
        title: books.title,
        authorId: books.authorId,
        publisherId: books.publisherId,
        createdAt: books.createdAt,
        updatedAt: books.updatedAt,
        deletedAt: books.deletedAt,
        authorName: authors.name,
        publisherName: publishers.name,
      })
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(publishers, eq(books.publisherId, publishers.id))
      .where(eq(books.id, parseInt(bookId, 10)));

    if (!book) {
      sendResponse(res, 404, "Book not found");
      return;
    }

    sendResponse(res, 200, "Book retrieved successfully", book);
  } catch (error) {
    console.error("Error retrieving book:", error);
    sendResponse(res, 500, "Internal server error");
  }
}
export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, authorId, publisherId, isbn, price, stock, year, genre } = req.body;

    if (!title || !authorId || !publisherId || !isbn || !price || !stock || !year || !genre) {
      sendResponse(res, 400, "Title, Author ID, Publisher ID, ISBN, Price, Stock, Year, and Genre are required");
      return;
    }

    const newBook = await db
      .insert(books)
      .values({
        title,
        authorId,
        publisherId,
        isbn,
        price,
        stock,
        year,
        genre,
      })
      .returning();

    sendResponse(res, 201, "Book created successfully");
  } catch (error) {
    console.error("Error creating book:", error);
    sendResponse(res, 500, "Internal server error");
  }
}
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookId, title, authorId, publisherId, isbn, price, stock, year, genre } = req.body;

    if (!bookId) {
      sendResponse(res, 400, "Book ID is required");
      return;
    }

    const updatedBook = await db
      .update(books)
      .set({
        title,
        authorId,
        publisherId,
        isbn,
        price,
        stock,
        year,
        genre,
      })
      .where(eq(books.id, bookId))
      .returning();

    sendResponse(res, 200, "Book updated successfully", updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    sendResponse(res, 500, "Internal server error");
  }
}
export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {   
  try {
    const bookId = req.body;

    if (!bookId) {
      sendResponse(res, 400, "Book ID is required");
      return;
    }

    const deletedBook = await db
      .update(books)
      .set({ deletedAt: new Date() })
      .where(eq(books.id, bookId))
      .returning();

    sendResponse(res, 200, "Book deleted successfully", deletedBook);
  } catch (error) {
    console.error("Error deleting book:", error);
    sendResponse(res, 500, "Internal server error");
  }
}