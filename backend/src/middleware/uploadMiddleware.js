import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. KANBNIW PATH ABSOLU L "src/uploads"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// __dirname daba howa: ".../backend/src/middleware"
// Khassna nrj3o b'khatwa l'lor l "src", o men temma ndkhlo l "uploads"
const uploadDir = path.join(__dirname, '../uploads');

// 2. KAN'T2EKDO L'DOSSIER KAYN
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Multer Configuration (katb9a nafs l'khadma)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Hna kansta3mlo l'path l's7i7 li bniyna l'fou9
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilter
});

export default upload;