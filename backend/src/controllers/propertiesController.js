import { sql } from '../config/db.js';

// Zid property jdida
export const createProperty = async (req, res) => {
    try {
        const { title, description, typeaddress, city, region, country, latitude, longitude, price, status, purpose, area_meters, number_of_rooms, bathrooms, construction_year } = req.body;
        const owner_id = req.user.id; // Mn l'middleware

        const newProperty = await sql`
            INSERT INTO properties (title, description, typeaddress, city, region, country, latitude, longitude, price, status, purpose, area_meters, number_of_rooms, bathrooms, construction_year, owner_id)
            VALUES (${title}, ${description}, ${typeaddress}, ${city}, ${region}, ${country}, ${latitude}, ${longitude}, ${price}, ${status}, ${purpose}, ${area_meters}, ${number_of_rooms}, ${bathrooms}, ${construction_year}, ${owner_id})
            RETURNING *;
        `;
        res.status(201).json(newProperty[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
};

// Jib kolshi
export const getAllProperties = async (req, res) => {
    try {
        // L code dyalk kayb9a kima howa, kanjbdo kolchi l w7dhom
        const properties = await sql`SELECT * FROM properties ORDER BY property_id DESC;`;

        if (properties.length === 0) {
            return res.status(200).json([]);
        }

        // L code dyalk dyal images kayb9a kima howa
        const propertiesWithImages = await Promise.all(
            properties.map(async (property) => {
                const mediaResult = await sql`
                    SELECT file_url 
                    FROM property_media 
                    WHERE property_id = ${property.property_id} AND is_primary = TRUE 
                    LIMIT 1;
                `;
                const imagePath = mediaResult.length > 0 ? mediaResult[0].file_url : null;
                let finalImageUrl = null;
                if (imagePath) {
                    if (imagePath.startsWith('http')) {
                        finalImageUrl = imagePath;
                    } else {
                        finalImageUrl = `${process.env.BASE_URL}${imagePath}`;
                    }
                }
                return {
                    ...property,
                    primary_image_url: finalImageUrl,
                };
            })
        );
        
        // L code dyalk dyal tertib kayb9a kima howa
        propertiesWithImages.sort((a, b) => {
            if (a.primary_image_url && !b.primary_image_url) return -1;
            if (!a.primary_image_url && b.primary_image_url) return 1;
            return 0;
        });
        
        // ==> HNA L CHANGEMENT L WA7ID <==
        // Kanakhdo "category_id" men l'URL
        const { purpose, city, limit, category_id } = req.query; 
        let filteredProperties = propertiesWithImages;

        // L filtre dyal "purpose" kayb9a
        if (purpose) {
            filteredProperties = filteredProperties.filter(p => p.purpose === purpose);
        }

        // L filtre dyal "city" kayb9a
        if (city) {
            filteredProperties = filteredProperties.filter(p => p.city.toLowerCase() === city.toLowerCase());
        }

        // ==> KAN ZIDO L FILTRE JDID HNA <==
        if (category_id) {
            // Kan filtréw b "category_id". Kandiro "==" hit momkin yji string men l'URL
            filteredProperties = filteredProperties.filter(p => p.category_id == category_id);
        }

        // L filtre dyal "limit" kayb9a
        if (limit && !isNaN(parseInt(limit))) {
            filteredProperties = filteredProperties.slice(0, parseInt(limit));
        }

        res.status(200).json(filteredProperties);

    } catch (error) {
        console.error('Error fetching properties with images:', error.message);
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
};
// Jib wehda b ID
export const getPropertyById = async (req, res) => {
    const { id } = req.params;
    try {
        // ==> 1. KANJIBO L'INFORMATION L'ASLIYA DYAL L PROPERTY <==
        const propertyResult = await sql`SELECT * FROM properties WHERE property_id = ${id}`;
        
        // Ila mal9inahch, n'sifto erreur 404
        if (propertyResult.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        const property = propertyResult[0];

        // ==> 2. KANJIBO LES MEDIA (IMAGES, VIDEOS, ETC.) DYALO <==
        const mediaResult = await sql`SELECT * FROM property_media WHERE property_id = ${id} ORDER BY is_primary DESC, media_id ASC`;
        
        // ==> 3. KANJIBO LES FEATURES (AVANTAGES) DYALO <==
        // Hna kandiro JOIN bin jouj dyal les tables
        const featuresResult = await sql`
            SELECT f.features_id, f.title, f.icon_url 
            FROM features f
            JOIN property_features pf ON f.features_id = pf.features_id
            WHERE pf.property_id = ${id};
        `;
         const ownerResult = await sql`SELECT user_id, name, role, profile_photo FROM users WHERE user_id = ${property.owner_id}
        `;
        
        // ==> 5. KANBNIW LES URLs L KAMLIM L LES MEDIA <==
        const mediaWithFullUrl = mediaResult.map(mediaItem => {
            let finalImageUrl = null;
            const imagePath = mediaItem.file_url;

            if (imagePath) {
                if (imagePath.startsWith('http')) {
                    finalImageUrl = imagePath;
                } else {
                    finalImageUrl = `${process.env.BASE_URL}${imagePath}`;
                }
            }
            return {
                ...mediaItem,
                file_url: finalImageUrl,
            };
        });

        // ==> 6. KAN JM3O HADCHI KOLO F RÉPONSE WE7DA N9IYA <==
        res.status(200).json({
            ...property,
            media: mediaWithFullUrl,
            features: featuresResult,
            owner: ownerResult.length > 0 ? ownerResult[0] : null
        });

    } catch (error) {
        console.error("Error in getPropertyById:", error.message);
        res.status(500).json({ message: 'Error fetching property details', error: error.message });
    }
};
// Bdel property
export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description /* ... bqa dakshi lakhor */ } = req.body;

        // T'hekek wach l'user howa mol l'property 9bel ma tbedel
        const propertyResult = await sql`SELECT owner_id FROM properties WHERE property_id = ${id}`;
        if (propertyResult.length === 0 || propertyResult[0].owner_id !== req.user.id) {
            return res.status(403).json({ message: "Ma 3ndeksh l'he9 tbedel had l'property." });
        }

        const updatedProperty = await sql`
            UPDATE properties
            SET title = ${title}, description = ${description} -- Zid les champs lokhrin hna
            WHERE property_id = ${id}
            RETURNING *;
        `;
        res.json(updatedProperty[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
};

// Msseh property
export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // T'hekek wach l'user howa mol l'property
         const propertyResult = await sql`SELECT owner_id FROM properties WHERE property_id = ${id}`;
        if (propertyResult.length === 0 || propertyResult[0].owner_id !== req.user.id) {
            return res.status(403).json({ message: "Ma 3ndeksh l'he9 tmsseh had l'property." });
        }

        await sql`DELETE FROM properties WHERE property_id = ${id};`;
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
};

// Zid feature l property
export const addFeatureToProperty = async (req, res) => {
    const { propertyId, featureId } = req.params;
    try {
        await sql`INSERT INTO property_features (property_id, features_id) VALUES (${propertyId}, ${featureId})`;
        res.status(201).json({ message: 'Feature added to property' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding feature', error: error.message });
    }
};

// Heyed feature men property
export const removeFeatureFromProperty = async (req, res) => {
    const { propertyId, featureId } = req.params;
    try {
        await sql`DELETE FROM property_features WHERE property_id = ${propertyId} AND features_id = ${featureId}`;
        res.json({ message: 'Feature removed from property' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing feature', error: error.message });
    }
};

/**
 * @desc    Upload media for a property
 * @route   POST /api/properties/:propertyId/media
 * @access  Private
 */
export const uploadPropertyMedia = async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user.id;

    try {
        // 1. Verify that the user owns the property
        const property = await sql`SELECT owner_id FROM properties WHERE property_id = ${propertyId}`;
        if (property.length === 0 || property[0].owner_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to add media to this property." });
        }

        // 2. Check if any files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'You must select at least one image to upload.' });
        }
        
        // 3. Store the information for each file in the database
        const mediaToInsert = req.files.map(file => ({
            property_id: propertyId,
            file_url: `/uploads/${file.filename}`, // The URL the frontend will use
            media_type: 'image'
        }));
        
        const insertedMedia = await sql`
            INSERT INTO property_media ${sql(mediaToInsert, 'property_id', 'file_url', 'media_type')}
            RETURNING *;
        `;

        res.status(201).json(insertedMedia);

    } catch (error) {
        res.status(500).json({ message: 'Error uploading property media', error: error.message });
    }
};

/**
 * @desc    Delete media from a property
 * @route   DELETE /api/properties/media/:mediaId
 * @access  Private
 */
export const deletePropertyMedia = async (req, res) => {
    const { mediaId } = req.params;
    const userId = req.user.id;

    try {
        // 1. Get the media and verify ownership in a single query
        const mediaResult = await sql`
            SELECT pm.file_url, p.owner_id
            FROM property_media pm
            JOIN properties p ON pm.property_id = p.property_id
            WHERE pm.media_id = ${mediaId}
        `;
        
        if (mediaResult.length === 0) {
            return res.status(404).json({ message: "Media not found." });
        }

        if (mediaResult[0].owner_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this media." });
        }

        // 2. Delete the physical file from the 'uploads' folder
        const filePath = path.join(process.cwd(), mediaResult[0].file_url);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Could not delete the file from server:", err);
        });

        // 3. Delete the media record from the database
        await sql`DELETE FROM property_media WHERE media_id = ${mediaId}`;

        res.status(200).json({ message: "Media deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property media', error: error.message });
    }
};

/**
 * @desc    Set a specific media item as the primary image for a property
 * @route   PUT /api/properties/media/:mediaId/set-primary
 * @access  Private
 */
export const setPrimaryMedia = async (req, res) => {
    const { mediaId } = req.params;
    const userId = req.user.id;

    try {
        // 1. Verify ownership, similar to the delete function
        const mediaResult = await sql`
            SELECT pm.property_id, p.owner_id
            FROM property_media pm
            JOIN properties p ON pm.property_id = p.property_id
            WHERE pm.media_id = ${mediaId}
        `;

        if (mediaResult.length === 0) {
            return res.status(404).json({ message: "Media not found." });
        }

        if (mediaResult[0].owner_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }

        const { property_id } = mediaResult[0];

        // 2. Use a transaction to ensure data integrity
        await sql.begin(async sql => {
            // First, set all media for this property to 'is_primary = false'
            await sql`
                UPDATE property_media
                SET is_primary = FALSE
                WHERE property_id = ${property_id}
            `;

            // Second, set only the desired media to 'is_primary = true'
            await sql`
                UPDATE property_media
                SET is_primary = TRUE
                WHERE media_id = ${mediaId}
            `;
        });
        
        res.status(200).json({ message: "Primary media has been set successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error setting primary media', error: error.message });
    }
};

/**
 * @desc    Get a list of all unique city names
 * @route   GET /api/properties/cities
 * @access  Public
 */
export const getUniqueCities = async (req, res) => {
    try {
        // HADI HIYA LA REQUÊTE L MOHIMA:
        // Katjib ghir l'colonne "city", o "DISTINCT" kat7yyed tikrar
        const result = await sql`
            SELECT DISTINCT city 
            FROM properties 
            WHERE city IS NOT NULL AND city != '' 
            ORDER BY city ASC;
        `;
        
        // L natija ghadi tkoun tableau d les objets: [{ city: 'Rabat' }, { city: 'Fez' }]
        // 7na bghina ghir tableau d les strings: ['Rabat', 'Fez']
        const cities = result.map(row => row.city);

        res.status(200).json(cities);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching unique cities', error: error.message });
    }
};