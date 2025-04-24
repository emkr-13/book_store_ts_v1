import { db } from "../config/db";
import { eq, sql, ilike, and, isNull } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { pagination } from "../utils/helper";
import { books } from "../models/book";
import { authors } from "../models/author";
import { publishers } from "../models/publisher";

export const listBooks = async (req: Request, res: Response): Promise<void> => {
  try {

    const { page = "1", limit = "10", genre, search } = req.query;

    // Validate pagination parameters
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      sendResponse(res, 400, "Invalid pagination parameters");
      return;
    }
    const conditions = [];
    if (genre) {
      if (typeof genre === "string") {
        conditions.push(
          eq(
            books.genre,
            genre as
              | "fiction"
              | "non-fiction"
              | "mystery"
              | "fantasy"
              | "science fiction"
              | "biography"
              | "history"
              | "romance"
              | "thriller"
              | "self-help"
              | "children"
              | "social sciences"
          )
        );
      }
    }
    if (search) {
      conditions.push(ilike(books.genre, `%${search}%`));
    }


    // Count the total number of records in the database
    // Fetch total records for pagination
    const [totalRecordsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalRecords = totalRecordsResult?.count || 0;

    // Calculate pagination details
    const paginationDetails = await pagination(
      totalRecords,
      pageNumber,
      limitNumber
    );
    let book = db
      .select({
        id: books.id,
        title: books.title,
        authorId: books.authorId,
        publisherId: books.publisherId,
        isbn: books.isbn,
        price: books.price,
        stock: books.stock,
        year: books.year,
        genre: books.genre,
        description: books.description,
        createdAt: books.createdAt,
        updatedAt: books.updatedAt,
        deletedAt: books.deletedAt,
        authorName: authors.name,
        publisherName: publishers.name,
      })
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(publishers, eq(books.publisherId, publishers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(paginationDetails.total_display)
      .offset((pageNumber - 1) * limitNumber);


    sendResponse(res, 200, "Books retrieved successfully", {
      data: book,
      pagination: paginationDetails,
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

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
};
export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, authorId, publisherId, isbn, price, stock, year, genre } =
      req.body;

    if (
      !title ||
      !authorId ||
      !publisherId ||
      !isbn ||
      !price ||
      !stock ||
      !year ||
      !genre
    ) {
      sendResponse(
        res,
        400,
        "Title, Author ID, Publisher ID, ISBN, Price, Stock, Year, and Genre are required"
      );
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
};
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      bookId,
      title,
      authorId,
      publisherId,
      isbn,
      price,
      stock,
      year,
      genre,
    } = req.body;

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

    sendResponse(res, 200, "Book updated successfully");
  } catch (error) {
    console.error("Error updating book:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
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

    sendResponse(res, 200, "Book deleted successfully");
  } catch (error) {
    console.error("Error deleting book:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
