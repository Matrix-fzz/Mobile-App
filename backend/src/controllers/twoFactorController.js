import { sql } from '../config/db.js';
import speakeasy from 'speakeasy';
import bcrypt from 'bcryptjs'; 

export const generateTwoFactorSecret = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `NESTIFY (${req.user.email})`,
        });

        await sql`UPDATE users SET two_factor_secret = ${secret.base32} WHERE user_id = ${req.user.id}`;
        
        // ==> HNA L POINT L MOHIM <==
        // Kan sifto l'URL l'asli direct, bla mansta3mlo "qrcode"
        res.json({
            secret: secret.base32,
            qrCodeUrl: secret.otpauth_url, // Kansta3mlo l'URL li ja men speakeasy
        });

    } catch (error) {
        // Zedt had l console.log bach y3awna f l debug f l mosta9bal
        console.error("Error in generateTwoFactorSecret:", error); 
        res.status(500).json({ message: error.message });
    }
};


export const verifyAndEnableTwoFactor = async (req, res) => {
    const {  } = req.body;
    try {
        const user = (await sql`SELECT * FROM users WHERE user_id = ${req.user.id}`)[0];
        
        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (verified) {
            await sql`UPDATE users SET two_factor_enabled = TRUE WHERE user_id = ${req.user.id}`;
            
            await sql`DELETE FROM recovery_codes WHERE user_id = ${req.user.id}`;

            const recoveryCodes = [];
            for (let i = 0; i < 10; i++) {
                const code = speakeasy.generateSecret({ length: 8 }).base32.replace(/=/g, '').slice(0, 8);
                const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}`;
                recoveryCodes.push(formattedCode);
            }

            for (const code of recoveryCodes) {
                await sql`INSERT INTO recovery_codes (user_id, code) VALUES (${req.user.id}, ${code})`;
            }
            
            res.json({ 
                message: '2FA enabled successfully', 
                recoveryCodes: recoveryCodes 
            });

        } else {
            res.status(400).json({ message: 'Invalid token, verification failed' });
        }
    } catch (error) {
        console.error("Error in verifyAndEnableTwoFactor:", error);
        res.status(500).json({ message: 'Error while verifying 2FA token' });
    }
};
/**
 * @desc    Disable Two-Factor Authentication
 * @route   POST /api/auth/2fa/disable
 * @access  Private
 */
export const disableTwoFactor = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
        return res.status(400).json({ message: 'Password is required to disable 2FA' });
    }

    try {
        
        const userResult = await sql`SELECT * FROM users WHERE user_id = ${userId}`;
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = userResult[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password, cannot disable 2FA' });
        }

        await sql`
            UPDATE users 
            SET 
                two_factor_enabled = FALSE, 
                two_factor_secret = NULL 
            WHERE user_id = ${userId};
        `;
        

        res.json({ message: '2FA has been disabled successfully.' });

    } catch (error) {
        console.error("Error disabling 2FA:", error);
        res.status(500).json({ message: 'Server error while disabling 2FA' });
    }
};

/**
 * @desc    Get the user's current recovery codes
 * @route   GET /api/auth/2fa/recovery-codes
 * @access  Private
 */
export const getRecoveryCodes = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await sql`
            SELECT code 
            FROM recovery_codes 
            WHERE user_id = ${userId} AND is_used = FALSE;
        `;

        const recoveryCodes = result.map(row => row.code);

        res.json({ recoveryCodes: recoveryCodes });

    } catch (error) {
        console.error("Error fetching recovery codes:", error);
        res.status(500).json({ message: "Server error" });
    }
};