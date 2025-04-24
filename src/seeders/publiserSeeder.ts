import { db } from "../config/db";
import { publishers } from "../models/publisher";


async function seed() {
    // Array data yang akan di-insert secara bulk
    const publisherss = [
        {
        name: "Publisher A",
        address: "Address A",
        description: "Description A",
        phone: "1234567890",
        email: "publishera@mail.com",
 
        },
        {
        name: "Publisher B",
        address: "Address B",
        description: "Description B",
        phone: "0987654321",
        email: "publisherb@mail.com",
    
        }]

    // Insert data ke dalam tabel publishers
    await db.insert(publishers).values(publisherss);
    console.log("Publishers seeded successfully");

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

