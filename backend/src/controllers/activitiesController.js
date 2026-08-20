import { sql } from '../config/db.js';

/**
 * @desc    Get all activities for the logged-in user
 * @route   GET /api/activities
 * @access  Private
 */
export const getUserActivities = async (req, res) => {
    const userId = req.user.id; // Kanakhdo l'ID dyal l'user li m'connecté men l'middleware

    try {
        const activities = await sql`
            SELECT * FROM activities 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC; -- N'ratiw men l'jdid l l'9dim
        `;
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user activities", error: error.message });
    }
};

/**
 * @desc    Mark a specific activity as read
 * @route   PUT /api/activities/:id/read
 * @access  Private
 */
export const markActivityAsRead = async (req, res) => {
    const { id: activityId } = req.params;
    const userId = req.user.id;

    try {
        // Kan t'hekko belli l'activity dyal had l'user bach ma y9derch ybedel dyal user akhor
        const updatedActivity = await sql`
            UPDATE activities
            SET is_read = TRUE
            WHERE activity_id = ${activityId} AND user_id = ${userId}
            RETURNING *;
        `;

        if (updatedActivity.length === 0) {
            return res.status(404).json({ message: 'Activity not found or you do not have permission to change it' });
        }
        
        res.status(200).json(updatedActivity[0]);
    } catch (error) {
        res.status(500).json({ message: "Error marking activity as read", error: error.message });
    }
};

/**
 * @desc    Mark all unread activities as read for the user
 * @route   PUT /api/activities/mark-all-as-read
 * @access  Private
 */
export const markAllActivitiesAsRead = async (req, res) => {
    const userId = req.user.id;

    try {
        await sql`
            UPDATE activities
            SET is_read = TRUE
            WHERE user_id = ${userId} AND is_read = FALSE;
        `;
        res.status(200).json({ message: "All activities marked as read." });
    } catch (error) {
        res.status(500).json({ message: "Error marking all activities as read", error: error.message });
    }
};

/**
 * @desc    Delete a specific activity
 * @route   DELETE /api/activities/:id
 * @access  Private
 */
export const deleteActivity = async (req, res) => {
    const { id: activityId } = req.params;
    const userId = req.user.id;

    try {
        // Hna hta howa, kan t'hekko wach l'activity dyal had l'user
        const result = await sql`
            DELETE FROM activities 
            WHERE activity_id = ${activityId} AND user_id = ${userId} 
            RETURNING *;
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Activity not found or you do not have permission to delete it' });
        }
        
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity", error: error.message });
    }
};