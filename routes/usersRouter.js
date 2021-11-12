import { Router } from "express";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} from "../controllers/usersController.js";
import { verifyToken } from "../express/middleware/auth.js";

const router = Router();

//need login
router.get("/", getAllUsers);

// READ
router.post("/", verifyToken, getAllUsers);

// CREATE
router.post("/create", createUser);

// UPDATE
router.post("/edit", editUser);

// DELETE
router.post("/delete/:id", deleteUser);

export default router;
