// import express from "express";
// import {sql} from "../config/db.js";


// const router = express.Router();

// router.get("/:category_id", async(req,res) => {
//     try {
//         const {category_id}=req.params;
//         const categories = await sql `
//         SELECT * FROM categories WHERE category_id=${category_id} ORDER BY name DESC
//         `;
//         res.status(200).json(categories);
//     } catch (error) {
//           console.log("Error getting the categories ",error );
//         res.status(500).json({message: "Internal server error"});
//     }
// });

// router.post("/", async (req,res) => {
//     try {
//         const {category_name,image} = req.body
//         if(!category_name || !image  ){
//             return res.status(400).json({message: "All fields are required"});
//         }
//     const categories = await sql `
//         INSERT INTO categories(category_name,image)
//         VALUES (${category_name},${image})
//         RETURNING *
//         `;
//         console.log(categories);
//         res.status(201).json(categories[0]);
//     } catch (error) {
//         console.log("Error creating the category ",error );
//         res.status(500).json({message: "Internal server error"});
//     }
// });

// router.delete("/:category_id", async (req,res) => {
// try {
//     const {category_id} = req.params;

//     if(isNaN(parseInt(category_id))){
//         return res.status(400).json({message:"Invalid category ID "});
//     }

//     const result = await  sql`
//     DELETE FROM categories WHERE category_id = ${category_id} RETURNING *
//     `;

//     if(result.length === 0){
//         return res.status(404).json({message:"category not found "});
//     }
//     res.status(200).json({message: "category deleted successfuly"});
// } catch (error) {
//     console.log("Error deleting the category ",error );
//     res.status(500).json({message: "Internal server error"});
// }
// });


// export default router; 

import { Router } from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/categoriesController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Ghadi nhtajo l'middleware dyal upload

const router = Router();

router.route('/')
    .get(getAllCategories) // Ay wehd y9der ychof
    // upload.single('image') kat3ni ghadi nst9blo fichier wehd mn input smito 'image'
    .post(protect, admin, upload.single('image'), createCategory); // Ghi l'admin li yzid

router.route('/:id')
    .get(getCategoryById)
    .put(protect, admin, upload.single('image'), updateCategory) // Ghi l'admin li ybedel
    .delete(protect, admin, deleteCategory); // Ghi l'admin li ymsseh

export default router;