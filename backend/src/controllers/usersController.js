// import {sql} from "../config/db.js";

// export async function getUsersByUserId(req,res){

//         try {
//             const {user_id}=req.params;
//             const users = await sql `
//             SELECT * FROM users WHERE user_id=${user_id} ORDER BY name DESC
//             `;
//             res.status(200).json(users);
//         } catch (error) {
//             console.log("Error getting the users ",error );
//             res.status(500).json({message: "Internal server error"});
//         }
//     }


// export async function createUsers(req, res){
    
//         try {
//             const {name,email,password,role,profile_photo} = req.body
//             if(!name || !email || !password || !role || !profile_photo ){
//                 return res.status(400).json({message: "All fields are required"});
//             }
//            const users = await sql `
//             INSERT INTO users(name,email,password,role,profile_photo)
//             VALUES (${name},${email},${password},${role},${profile_photo})
//             RETURNING *
//             `;
//             console.log(users);
//             res.status(201).json(users[0]);
//         } catch (error) {
//             console.log("Error creating the user ",error );
//             res.status(500).json({message: "Internal server error"});
//         }
//     }


// export async function deleteUsers (req,res){
// try {
//     const {user_id} = req.params;

//     if(isNaN(parseInt(user_id))){
//         return res.status(400).json({message:"Invalid user ID "});
//     }

//     const result = await  sql`
//     DELETE FROM users WHERE user_id = ${user_id} RETURNING *
//     `;

//     if(result.length === 0){
//         return res.status(404).json({message:"User not found "});
//     }
//     res.status(200).json({message: "user deleted successfuly"});
// } catch (error) {
//     console.log("Error deleting the user ",error );
//     res.status(500).json({message: "Internal server error"});
// }
// }




import { sql } from "../config/db.js";
import bcrypt from 'bcryptjs'; // Importi bcrypt bach t'hashé l password

/**
 * @desc    Jib kol l'users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        // De préférence, manjibosh l password m3ana f la réponse
        const users = await sql`
            SELECT user_id, name, email, role, profile_photo FROM users ORDER BY user_id ASC
        `;
        res.status(200).json(users);
    } catch (error) {
        console.log("Error getting users: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @desc    Jib user wehd b ID dyalo
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await sql`
            SELECT user_id, name, email, role, profile_photo FROM users WHERE user_id = ${id}
        `;

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(users[0]); // Nsifto ghir object, machi array
    } catch (error) {
        console.log("Error getting the user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @desc    Zid user jdid (Admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 * @note    Hadi katshbeh l 'registerUser'. L'fahm hssen tkhdem b registerUser f authController
 */
export async function createUser(req, res) {
    try {
        const { name, email, password, role, profile_photo } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Name, email, password, o role daroriyin" });
        }

        // ---- NASSIHA MOHIMMA BZAF ----
        // Matkheznch l password hakak direct! Khass ythashà 9bel.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const users = await sql`
            INSERT INTO users(name, email, password, role, profile_photo)
            VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${profile_photo || null})
            RETURNING user_id, name, email, role, profile_photo;
        `;
        
        res.status(201).json(users[0]);
    } catch (error) {
        // Ila kan l'email déja kayn
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(400).json({ message: 'Had l email déja makhdom bih.' });
        }
        console.log("Error creating the user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Bdel ma3loumat d user
 * @route   PUT /api/users/:id
 * @access  Private
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;

    // L'autorisation katb9a hiya hiya (daroria l'l'aman)
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Ma 3ndeksh l7e9 tbedel had l'profile." });
    }

    try {
        // 1. KANJIBO L'USER L'9DIM BACH N3ERFO L'MA3LOMAT L'9DIMA
        const userResult = await sql`
            SELECT name, profile_photo FROM users WHERE user_id = ${id}
        `;
        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingUser = userResult[0];

        // 2. KANAKHDO GHER "NAME". ILA MA JACH, KANKHLLI L'9DIM
        const name = req.body.name || existingUser.name;

        // 3. KAN'CHOUFO WACH JATNA TSWEIRA JDIDA (NAFS L'KHADMA)
        let profilePhotoPath = existingUser.profile_photo;
        if (req.file) {
            profilePhotoPath = `uploads/${req.file.filename}`;
        }

        // 4. KANDIRO L'UPDATE B'DATA L'JDIDA (Ghir name o profile_photo)
        const updatedUser = await sql`
            UPDATE users
            SET 
                name = ${name}, 
                profile_photo = ${profilePhotoPath}
            WHERE user_id = ${id}
            RETURNING user_id, name, email, role, profile_photo; 
        `;
        // Mola7ada: F RETURNING, kanrj3o kolchi bach l'frontend y'update l'state kaml

        // 5. KAN'SAYBO L'URL L'KAMEL DYAL L'IMAGE (NAFS L'KHADMA)
        const responseUser = { ...updatedUser[0] }; 
        if (responseUser.profile_photo && !responseUser.profile_photo.startsWith('http')) {
            responseUser.profile_photo = `${req.protocol}://${req.get('host')}/${responseUser.profile_photo}`;
        }

        res.status(200).json(responseUser);

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


/**
 * @desc    Msseh user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const result = await sql`
            DELETE FROM users WHERE user_id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error deleting the user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Bdel l'password dyal l'user li m'connecté
 * @route   POST /api/users/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    // 1. Kanjib l'ID dyal l'user men l'token (hadchi kayji men l'middleware dyal l'authentification)
    // IMPORTANT: Khass ykoun 3endek middleware li kay7et req.user fih l'id o role...
    const userId = req.user.id; 

    // 2. Kanjib l'information men l'body dyal l'request
    const { currentPassword, newPassword } = req.body;

    // 3. Kan'vérifiw wach kolchi wassel
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new passwords.' });
    }

    try {
        // 4. Kanjib l'user men la base de données bach nakhdo l'password l'hashed dyalo
        const userResult = await sql`SELECT user_id, password FROM users WHERE user_id = ${userId}`;
        
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        const user = userResult[0];

        // 5. Kan9arno l'password li seft l'user m3a dakchi li f la base de données
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            // Ila l'password l'9dim ghalet, kan sifto erreur
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // 6. Ila kolchi mezyan, kan'hashiw l'password jdid
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 7. Kan'mettiw à jour la base de données b l'password l'jdid
        await sql`UPDATE users SET password = ${hashedNewPassword} WHERE user_id = ${userId}`;

        // 8. Kan sifto réponse dyal naja7
        res.status(200).json({ message: 'Password changed successfully!' });

    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
