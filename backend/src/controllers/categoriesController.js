import { sql } from '../config/db.js';

/**
 * @desc    Create a new category (Admin only)
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
    const { category_name } = req.body;
    // L'image path ghadi yji men l'middleware dyal upload
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!category_name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const newCategory = await sql`
            INSERT INTO categories (category_name, image_path)
            VALUES (${category_name}, ${image_path})
            RETURNING *;
        `;
        res.status(201).json(newCategory[0]);
    } catch (error) {
        // Hada l'erreur dyal "UNIQUE constraint" ila l'smiya déja kayna
        if (error.code === '23505') {
            return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};


/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */

// export const getAllCategories = async (req, res) => {
//     try {
//         const categories = await sql`SELECT * FROM categories ORDER BY category_name ASC;`;

        
//         // console.log("Value of process.env.BASE_URL is:", process.env.BASE_URL);

//         const categoriesWithFullUrl = categories.map(category => {
//             // console.log(`Processing ${category.category_name}, its image_path is:`, category.image_path);
            
          
//             const imageUrl = `${process.env.BASE_URL}/uploads/${category.image_path}`;
            
//             return {
//                 ...category,
//                 image_url: imageUrl,
//             };
//         });

//         res.status(200).json(categoriesWithFullUrl);

//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching categories', error: error.message });
//     }
// };

export const getAllCategories = async (req, res) => {
    try {
        const limit = req.query.limit; // Kayakhod l limit ila ja

        // BDLNA LA REQUÊTE HNA
        let query = sql`SELECT * FROM categories ORDER BY category_name ASC`;
        if (limit && !isNaN(parseInt(limit))) {
            query = sql`SELECT * FROM categories ORDER BY category_name ASC LIMIT ${parseInt(limit)}`;
        }
        
        const categories = await query;
        
        const categoriesWithFullUrl = categories.map(category => {
            const imageUrl = `${process.env.BASE_URL}/uploads/${category.image_path}`;
            return { ...category, image_url: imageUrl };
        });

        res.status(200).json(categoriesWithFullUrl);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};
/**
 * @desc    Get a single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await sql`SELECT * FROM categories WHERE category_id = ${id};`;
        if (category.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

/**
 * @desc    Update a category (Admin only)
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;

    try {
        const updatedCategory = await sql`
            UPDATE categories
            SET 
                category_name = ${category_name},
                image_path = ${image_path}
            WHERE category_id = ${id}
            RETURNING *;
        `;
        if (updatedCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory[0]);
    } catch (error) {
        if (error.code === '23505') {
             return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

/**
 * @desc    Delete a category (Admin only)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`DELETE FROM categories WHERE category_id = ${id} RETURNING *;`;
        if (result.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Hna t9der tzid code ymsseh hta l'tsawira men l'dosier 'uploads'
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};