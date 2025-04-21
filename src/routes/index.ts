import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import authorRoutes from "./author";
import publisherRoutes from "./publisher"; // Uncomment if you have a publisher route

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/author", authorRoutes);
router.use("/publisher", publisherRoutes); // Uncomment if you have a publisher route
;

export default router;
