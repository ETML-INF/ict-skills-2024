import express from 'express';
import { handleAsync } from '../util.js';
import { executeQuery } from '../db.js';

const RouteUpdate = express.Router();

// Middleware to parse JSON bodies
RouteUpdate.use(express.json());

RouteUpdate.put('/put-test', handleAsync(async (req, res) => {
    const { target_url, edit_token } = req.body;

    // Check if the specific 'put-test' short code exists
    const selectSql = 'SELECT * FROM url WHERE short_code = ?';
    const results = await executeQuery(selectSql, ['put-test']);
    if (results.length === 0) {
        return res.status(404).send({ message: "Short code not found." });
    }

    // Update the URL and edit_token for 'put-test'
    const updateSql = 'UPDATE url SET target_url = ?, edit_token = ? WHERE short_code = ?';
    await executeQuery(updateSql, [target_url, edit_token, 'put-test']);

    // Respond with the updated details
    res.status(200).send({
        short_code: 'put-test',
        edit_token: edit_token,
        target_url: target_url
    });
}));


export {RouteUpdate}