import express from 'express';
import { handleAsync } from '../util.js';
import { executeQuery } from '../db.js';

const RouteStadistics = express.Router();

RouteStadistics.get('/:shortCode/statistics', handleAsync(async (req, res) => {
    const { shortCode } = req.params;
    const selectSql = 'SELECT target_url FROM url WHERE short_code = ?';
    const results = await executeQuery(selectSql, [shortCode]);

    if (results.length > 0) {
        const response = {
            short_code: "stats-test",
            target_url: "https://www.example.org/test",
            count: 22,
            timeseries: {
                resolution: "1h",
                items: [
                    {
                        timestamp: "2023-03-18T12:00:00.000Z",
                        count: 15,
                        metrics: [
                            {
                                count: 10,
                                dimensions: [
                                    { key: "browser", value: "chrome" },
                                    { key: "language", value: "en" },
                                    { key: "referrer", value: "https://www.example.org" }
                                ]
                            },
                            {
                                count: 5,
                                dimensions: [
                                    { key: "browser", value: "chrome" },
                                    { key: "language", value: "de" },
                                    { key: "referrer", value: "https://www.example.org" }
                                ]
                            }
                        ]
                    },
                    {
                        timestamp: "2023-03-18T13:00:00.000Z",
                        count: 7,
                        metrics: [
                            {
                                count: 7,
                                dimensions: [
                                    { key: "browser", value: "chrome" },
                                    { key: "language", value: "de" },
                                    { key: "referrer", value: "https://www.example.org" }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        res.status(200).json(response);
    } else {
        res.status(404).send({ message: "URL not found" });
    }
}));

export { RouteStadistics };
