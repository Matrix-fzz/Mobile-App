import { sql } from '../config/db.js';

/**
 * @desc    Zid feature jdida (Admin only)
 * @route   POST /api/features
 * @access  Private/Admin
 */
export const createFeature = async (req, res) => {
    const { title, status, icon_url } = req.body;

    if (!title || !status || !icon_url) {
        return res.status(400).json({ message: 'Khass kol l7o9ol ykouno 3amrin: title, status, icon_url' });
    }

    try {
        const newFeature = await sql`
            INSERT INTO features (title, status, icon_url)
            VALUES (${title}, ${status}, ${icon_url})
            RETURNING *;
        `;
        res.status(201).json(newFeature[0]);
    } catch (error) {
        res.status(500).json({ message: "Moshkil f l'iḍafa dyal feature", error: error.message });
    }
};

/**
 * @desc    Jib kol l'features
 * @route   GET /api/features
 * @access  Public
 */
export const getAllFeatures = async (req, res) => {
    try {
        const features = await sql`SELECT * FROM features ORDER BY title ASC;`;
        res.status(200).json(features);
    } catch (error) {
        res.status(500).json({ message: "Moshkil f jaleb l'features", error: error.message });
    }
};

/**
 * @desc    Jib feature wehda b ID dyalha
 * @route   GET /api/features/:id
 * @access  Public
 */
export const getFeatureById = async (req, res) => {
    const { id } = req.params;
    try {
        const feature = await sql`SELECT * FROM features WHERE features_id = ${id};`;
        if (feature.length === 0) {
            return res.status(404).json({ message: 'Ma l9inash had l feature' });
        }
        res.status(200).json(feature[0]);
    } catch (error) {
        res.status(500).json({ message: "Moshkil f jaleb l'feature", error: error.message });
    }
};

/**
 * @desc    Bdel ma3loumat feature (Admin only)
 * @route   PUT /api/features/:id
 * @access  Private/Admin
 */
export const updateFeature = async (req, res) => {
    const { id } = req.params;
    const { title, status, icon_url } = req.body;

    try {
        const updatedFeature = await sql`
            UPDATE features
            SET 
                title = ${title},
                status = ${status},
                icon_url = ${icon_url}
            WHERE features_id = ${id}
            RETURNING *;
        `;

        if (updatedFeature.length === 0) {
            return res.status(404).json({ message: 'Ma l9inash had l feature bach nbedloha' });
        }
        res.status(200).json(updatedFeature[0]);
    } catch (error) {
        res.status(500).json({ message: "Moshkil f ta3dil l'feature", error: error.message });
    }
};

/**
 * @desc    Msseh feature (Admin only)
 * @route   DELETE /api/features/:id
 * @access  Private/Admin
 */
export const deleteFeature = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`DELETE FROM features WHERE features_id = ${id} RETURNING *;`;
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Ma l9inash had l feature bach nms7oha' });
        }

        res.status(200).json({ message: 'Feature tmes7et b naja7' });
    } catch (error) {
        // Hna khass n'hekmo hta l'erreur dyal foreign key constraint
        if (error.code === '23503') { // PostgreSQL error code for foreign key violation
            return res.status(400).json({ message: "Ma ymknsh tmsseh had l'feature hit mrbouta m3a shi 3a9arat (properties)." });
        }
        res.status(500).json({ message: "Moshkil f l'hadf dyal feature", error: error.message });
    }
};