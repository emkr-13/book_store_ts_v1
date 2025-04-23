import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { authors } from "./author";
import { publishers } from "./publisher";

// Removed incompatible MySQL-specific import
export const genrebookEnum = pgEnum("genre_book", [
  "fiction",
  "non-fiction",
  "mystery",
  "fantasy",
  "science fiction",
  "biography",
  "history",
  "romance",
  "thriller",
  "self-help",
  "children",
  "young adult",
  "horror",
  "poetry",
  "cookbook",
  "graphic novel",
  "travel",
  "health",
  "business",
  "religion",
  "philosophy",
  "art",
  "music",
  "sports",
  "technology",
  "education",
  "parenting",
  "home and garden",
  "crafts and hobbies",
  "computers",
  "internet",
  "science",
  "mathematics",
  "engineering",
  "law",
  "politics",
  "social sciences",

]);

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  authorId: integer("author_id")
    .references(() => authors.id)
    .notNull(),
  publisherId: integer("publisher_id")
    .references(() => publishers.id)
    .notNull(),
  isbn: varchar("isbn", { length: 20 }).notNull(),
  price: varchar("price", { length: 20 }).notNull(),
  stock: varchar("stock", { length: 10 }).notNull(),
  description: text("description"),
  year: integer("year").notNull(),
  genre: genrebookEnum("genre").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
});
