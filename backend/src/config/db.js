import { neon } from "@neondatabase/serverless";
import "dotenv/config";

//Create a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);


export async function initDB() {
    try {
            await sql`CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50),
    profile_photo TEXT
)`,
            await sql`CREATE TABLE IF NOT EXISTS properties (
    property_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    typeaddress TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    price DECIMAL(12,2),
    status VARCHAR(50),
    purpose VARCHAR(50),
    area_meters INTEGER,
    number_of_rooms INTEGER,
    bathrooms INTEGER,
    construction_year INTEGER,
    owner_id INT REFERENCES users(user_id)
)`,
            await sql`CREATE TABLE IF NOT EXISTS categories (
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) UNIQUE NOT NULL,
                image_path TEXT
)`,
            await sql`CREATE TABLE IF NOT EXISTS features (
    features_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    icon_url TEXT NOT NULL
)`,
            await sql`CREATE TABLE IF NOT EXISTS property_features (
    property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
    features_id INT REFERENCES features(features_id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, features_id)
)`,
            await sql`CREATE TABLE IF NOT EXISTS property_media (
    media_id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,         
    media_type VARCHAR(50) DEFAULT 'image',  
    is_primary BOOLEAN DEFAULT FALSE, 
    uploaded_at TIMESTAMP DEFAULT NOW()
);
`,
            await sql`CREATE TABLE IF NOT EXISTS activities (
                        activity_id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        type VARCHAR(50) NOT NULL,
                        content_key VARCHAR(100) NOT NULL,
                        content_params JSONB,
                        related_entity_type VARCHAR(50),
                        related_entity_id INTEGER,
                        is_read BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)`,
            await sql`CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT false,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users (user_id) ON DELETE CASCADE
)`,
            await sql`CREATE TABLE IF NOT EXISTS recovery_codes (
    code_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
)`,
console.log("Database initialized seccessfuly")
    } catch (error) {
        console.log("Error initializing DB ", error)
        process.exit(1)
    }
}




























