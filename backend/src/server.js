import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
// import rateLimiter from "./middleware/rateLimiter.js";
import { fileURLToPath } from 'url';
import path from 'path';

import authRoutes from './routes/authRoute.js';
import usersRoute from "./routes/usersRoute.js";
import propertiesRoute from "./routes/propertiesRoute.js";

import featuresRoute from "./routes/featuresRoute.js";
import property_featuresRoute from "./routes/property_featuresRoute.js";
import property_mediaRoute from "./routes/property_mediaRoute.js";
import categoriesRoutes from './routes/categoriesRoute.js';
import messagesRoutes from './routes/messagesRoute.js';
import activitiesRoutes from './routes/activitiesRoute.js';


dotenv.config();

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes of tables 
app.use('/api/auth', authRoutes);
app.use("/api/users", usersRoute);
app.use("/api/properties", propertiesRoute);

app.use("/api/features", featuresRoute);
app.use("/api/property_features", property_featuresRoute);
app.use("/api/property_media", property_mediaRoute);

app.use('/api/messages', messagesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/activities', activitiesRoutes);


initDB().then(() => {
    setInterval(async () => {
        try {
            await sql`SELECT 1;`; // Requête khfifa bzaf, ghir bach n'golo l DB "rana hna"
            console.log("Keep-alive ping to Neon DB successful.");
        } catch (error) {
            console.error("Keep-alive ping failed:", error);
        }
    }, 4 * 60 * 1000); // 4 * 60 * 1000 = 4 minutes
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT: ", PORT);
    });

})


