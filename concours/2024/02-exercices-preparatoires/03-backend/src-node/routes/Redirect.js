import { Router } from "express";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const exampleRouter = Router();

exampleRouter.get('/:shortCode', handleAsync(async (req, res) => {
    const { shortCode } = req.params;
    const selectSql = 'SELECT target_url FROM url WHERE short_code = ?';
    const results = await executeQuery(selectSql, [shortCode]);

    if (results.length > 0) {
        res.redirect(302, results[0].target_url);
    } else {
        res.status(404).send({ message: "URL not found" });
    }
}));


export { exampleRouter }
