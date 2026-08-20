import { sql } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/emailService.js'; 

// Inscription d user jdid
export const registerUser = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Tzad kolchi a khay.' });
    }

    try {
        // Nshekiw wach l email déja kayn
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Had l email déja makhdom bih.' });
        }

        // Hashiw l password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Nzidoh f la base de données
        const newUserResult = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${role})
            RETURNING user_id, name, email, role;
        `;

        const newUser = newUserResult[0];

        // ==> 1. NSAYBO LIH TOKEN 7TA HOWA, KIMA F LOGIN <==
        // Ghadi nsta3mlo l'ID li ja men la base de données (newUser.user_id)
        const token = jwt.sign(
            { id: newUser.user_id, role: newUser.role },
            process.env.JWT_SECRET, // T2kked anaho 3ndk had l variable f .env
            { expiresIn: '1d' }
        );

        // ==> 2. NSIFTO NAFS L FORMAT DYAL LOGIN <==
        // Bdl ma nsifto ghir l'user, nsifto token o l'user
        res.status(201).json({
            token,
            user: {
                id: newUser.user_id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Shi moshkil f serveur', error: error.message });
    }
};

// Connexion d user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (userResult.length === 0) {
            return res.status(401).json({ message: 'Email wla password ghalet.' });
        }

        const user = userResult[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email wla password ghalet.' });
        }

        // Nssaybo JWT Token
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        if (user.profile_photo && !user.profile_photo.startsWith('http')) {
            user.profile_photo = `${req.protocol}://${req.get('host')}/${user.profile_photo}`;
        }
        res.json({
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo,
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Shi moshkil f serveur', error: error.message });
    }
};

// Njibo l profile dyal l user li mconnecté
export const getUserProfile = async (req, res) => {
    // req.user ghadi yji mn l middleware 'protect'
    const userResult = await sql`SELECT user_id, name, email, role, profile_photo,two_factor_enabled FROM users WHERE user_id = ${req.user.id}`;
    
    if (userResult.length > 0) {
        const user = userResult[0]; // Kanjbdo l'objet user

        // ==> T2EKKED MEN HAD L'BLOC B'DEBT <==
        // Kan9ado l'URL dyal tswirto 9bel ma nṣifṭoh
        if (user.profile_photo && !user.profile_photo.startsWith('http')) {
            user.profile_photo = `${req.protocol}://${req.get('host')}/${user.profile_photo}`;
        }
        
        res.json(user); // Daba kanṣifṭo l'user m9ad
    } else {
        res.status(404).json({ message: "Ma l9inash l'user" });
    }
};

// HADI JDIDA: Bach tṣifet l'code l l'email dyal l'user
export const sendVerificationCode = async (req, res) => {
    const userId = req.user.id; // Kanjiboh men l'middleware "protect"

    try {
        // ========== KHATWA 1: KAN'JBDO L'MA3LOUMAT DYAL L'USER AWELAN ==========
        // Kanjibo l'user kaml bach n'choufo l'statut "is_verified" dyalo o l'email
        const userResult = await sql`
            SELECT is_verified, email 
            FROM users 
            WHERE user_id = ${userId}
        `;

        // N't2ekdo l9ina l'user
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = userResult[0];

        // ========== KHATWA 2: L'CHECK L'MOHIM DYAL L'VERIFICATION ==========
        // N'shekiw wach l'user déja m'vérifié
        if (user.is_verified) {
            // Ila kan déja m'vérifié, n'rj3o message o n7ebso l'opération
            return res.status(400).json({ message: 'This account is already verified.' });
        }

        // ========== KHATWA 3: N'KEMLO L'KHADMA ILA KAN KOLCHI MZYAN ==========
        // N'generiw code 3achwa2i fih 6 arqam
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // N'7ddo weqtach ghadi ytsala (mor 10 d9ayeq)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Nkhzno l'code f la base de données l nafs l'user
        await sql`
            UPDATE users 
            SET verification_code = ${code}, verification_code_expires_at = ${expiresAt}
            WHERE user_id = ${userId}
        `;

        // ========== KHATWA 4: N'SIFTO L'EMAIL L'7A9I9I ==========
        const subject = 'Your Verification Code';
        const text = `Your verification code is: ${code}`;
        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>Email Verification</h2>
                <p>Please use the following code to verify your email address:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                    ${code}
                </p>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `;

        // Kansta3mlo l'email li jbednah f l'Khatwa 1
        await sendEmail(user.email, subject, text, html);
        
        res.status(200).json({ message: 'Verification code sent successfully.' });

    } catch (error) {
        console.error('Error sending verification code:', error); // Mezyan n'choufo l'erreur f l'console
        res.status(500).json({ message: 'Server error while sending code.', error: error.message });
    }
};
// HADI JDIDA: Bach t'vérifier l'code li dkhel l'user
export const verifyCode = async (req, res) => {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) return res.status(400).json({ message: 'Code is required.' });

    try {
        const result = await sql`
            SELECT verification_code, verification_code_expires_at FROM users
            WHERE user_id = ${userId}
        `;
        const user = result[0];

        if (!user || user.verification_code !== code) {
            return res.status(400).json({ message: 'Invalid code.' });
        }
        if (new Date() > new Date(user.verification_code_expires_at)) {
            return res.status(400).json({ message: 'Code has expired.' });
        }

        await sql`
            UPDATE users
            SET is_verified = TRUE, verification_code = NULL, verification_code_expires_at = NULL
            WHERE user_id = ${userId}
        `;
        
        res.status(200).json({ message: 'Email verified successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

