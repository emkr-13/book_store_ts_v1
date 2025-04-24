import { authors } from "../models/author";
import { db } from "../config/db";

async function seed() {
  // Array data yang akan di-insert secara bulk
  const authorss = [
    {
      name: "John",
      bio: "Author bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Jane",
      bio: "Author bio",
    },
    {
      name: "Doe",
      bio: "Author bio",
  
    },
    {
      name: "Smith",
      bio: "Author bio",
     
    },
    {
      name: "Emily",
      bio: "Author bio",

    },
    {
      name: "Michael",
      bio: "Author bio",
   
    },
    {
      name: "Sarah",
      bio: "Author bio",
    
    },
    {
      name: "David",
      bio: "Author bio",
 
    },
    {
      name: "Laura",
      bio: "Author bio",
 
    },
    {
      name: "Chris",
      bio: "Author bio",

    },
    {
      name: "Jessica",
      bio: "Author bio",
 
    },
  ];

  // Lakukan bulk insert
  await db.insert(authors).values(authorss);

  console.log("Bulk insert authors completed");
}

seed()
  .then(() => {
    console.log("Seeder completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
