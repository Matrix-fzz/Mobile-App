// import express from "express";
// import {getUsersByUserId, createUsers, deleteUsers} from "../controllers/usersController.js";

// const router = express.Router();

// router.get("/:user_id",getUsersByUserId);

// router.post("/", createUsers);

// router.delete("/:user_id", deleteUsers);


// export default router; 

// import { Router } from 'express';
// import { getAllUsers, getUserById, updateUser, deleteUsers } from '../controllers/usersController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';// Admin middleware ila bghiti ghir admin li ydir hadshi

// const router = Router();

// // Ghaliban, had routes khass ykoun 3ndhom access ghir l admin
// router.route('/').get(protect, admin, getAllUsers);
// router.route('/:id')
//     .get(protect, getUserById)
//     .put(protect, updateUser) // L'user y9der ybedel ghir l'compte dyalo
//     .delete(protect, admin, deleteUsers);

// export default router;
import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword 
} from '../controllers/usersController.js';
import { protect , admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
const router = Router();

// L'admin y9der ydir kolshi: ychof kolshi o yzid user
router.route('/')
    .get(protect, admin, getAllUsers)
    .post(protect, admin, createUser);

// Bach tjib, tbedel, wla tmsseh user b ID
router.route('/:id')
    .get(protect, getUserById) // Ay user mconnecté y9der ychof profile akhor
    .put(protect, upload.single('profile_photo'), updateUser) // L'user y9der ybedel ghir profile dyalo (wla l admin)
    .delete(protect, admin, deleteUser); // Ghi l'admin li ymsseh
    
// Had la route spéciale bach l'user ybeddel l'password dyalo    
router.post('/change-password', protect, changePassword);
export default router;