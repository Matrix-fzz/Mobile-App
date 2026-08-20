import { sql } from '../config/db.js';

// Sifet message
export const sendMessage = async (req, res) => {
    const { receiver_id, text } = req.body;
    const sender_id = req.user.id; // Mn middleware

    if (!receiver_id || !text) {
        return res.status(400).json({ message: 'Khass receiver_id o text.' });
    }

    try {
        const message = await sql`
            INSERT INTO messages (sender_id, receiver_id, text)
            VALUES (${sender_id}, ${receiver_id}, ${text})
            RETURNING *;
        `;
        res.status(201).json(message[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Jib conversation m3a user wehd
export const getConversation = async (req, res) => {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    try {
        const messages = await sql`
            SELECT * FROM messages
            WHERE (sender_id = ${currentUserId} AND receiver_id = ${otherUserId})
               OR (sender_id = ${otherUserId} AND receiver_id = ${currentUserId})
            ORDER BY created_at ASC;
        `;
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error: error.message });
    }
};

// Jib lista dyal kol conversations
export const getInbox = async (req, res) => {
    const userId = req.user.id;
    try {
        // Hadi requete chwiya compliquée, katjib akher message men kol conversation
        const inbox = await sql`
            SELECT DISTINCT ON (conversation_partner)
                   m.*,
                   CASE WHEN m.sender_id = ${userId} THEN m.receiver_id ELSE m.sender_id END as conversation_partner
            FROM messages m
            WHERE m.sender_id = ${userId} OR m.receiver_id = ${userId}
            ORDER BY conversation_partner, m.created_at DESC;
        `;
        res.json(inbox);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inbox', error: error.message });
    }
}