import jwt from 'jsonwebtoken';
import { sql } from '../config/db.js';

const protect = async (req, res, next) => {
    let token;

    // N9lbo 3la token f l'headers dyal l'request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Nheyedo 'Bearer' mn l'header bach yb9a ghir token
            token = req.headers.authorization.split(' ')[1];

            // N'verifiw token wach saheh o ma expiredsh
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Njibo l'ma3loumat dyal l'user mn la base de données (bla password)
            // o n7etoha f 'req.user' bach nstakhdmoha f controllers
            const userResult = await sql`
                SELECT user_id, name, email, role FROM users WHERE user_id = ${decoded.id}
            `;

            if (userResult.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = {
                id: userResult[0].user_id, 
                ...userResult[0]
            };

            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    // Kankhedmo b 'req.user' li saybnah f l'middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // Ila kan admin, douz
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' }); // 403 kat3ni Forbidden (Mamno3 3lik)
    }
};

export { protect, admin };