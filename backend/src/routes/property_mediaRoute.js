import express from "express";
import {sql} from "../config/db.js";


const router = express.Router();

router.get("/:media_id", async(req,res) => {
    try {
        const {user_id}=req.params;
        const users = await sql `
        SELECT * FROM users WHERE user_id=${user_id} ORDER BY name DESC
        `;
        res.status(200).json(users);
    } catch (error) {
          console.log("Error getting the users ",error );
        res.status(500).json({message: "Internal server error"});
    }
});

router.post("/", async (req,res) => {
    try {
        const {name,email,password,role,profile_photo} = req.body
        if(!name || !email || !password || !role || !profile_photo ){
            return res.status(400).json({message: "All fields are required"});
        }
       const users = await sql `
        INSERT INTO users(name,email,password,role,profile_photo)
        VALUES (${name},${email},${password},${role},${profile_photo})
        RETURNING *
        `;
        console.log(users);
        res.status(201).json(users[0]);
    } catch (error) {
        console.log("Error creating the user ",error );
        res.status(500).json({message: "Internal server error"});
    }
});

router.delete("/:media_id", async (req,res) => {
try {
    const {user_id} = req.params;

    if(isNaN(parseInt(user_id))){
        return res.status(400).json({message:"Invalid user ID "});
    }

    const result = await  sql`
    DELETE FROM users WHERE user_id = ${user_id} RETURNING *
    `;

    if(result.length === 0){
        return res.status(404).json({message:"User not found "});
    }
    res.status(200).json({message: "user deleted successfuly"});
} catch (error) {
    console.log("Error deleting the user ",error );
    res.status(500).json({message: "Internal server error"});
}
});


export default router; 