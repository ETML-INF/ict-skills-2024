import express from "express";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";
import { randomUUID } from "crypto";

const RouteUpdate = express.Router();

RouteUpdate.put(
  "/",
  handleAsync(async (req, res) => {
    const { target_url, short_code } = req.body;

    // Validate request body for target_url
    if (!target_url) {
      return res.status(400).send({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          target_url: {
            message: "Target URL is required.",
          },
        },
      });
    }

    if (target_url.length > 300) {
      return res.status(400).send({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          target_url: {
            message: "Target URL must be at most 300 characters long.",
          },
        },
      });
    }

    // Validate that target_url is a proper URL
    const urlPattern = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    const invalidDotsPattern = /(\.\.)/;
    if (!urlPattern.test(target_url) || invalidDotsPattern.test(target_url)) {
      return res.status(400).send({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          target_url: {
            message: "Target URL is not a valid URL.",
          },
        },
      });
    }

    // Ensure short_code is provided without further validation
    if (!short_code) {
      return res.status(400).send({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          short_code: [
            {
              message: "Short code is required.",
            },
          ],
        },
      });
    }

    const editTokenHeader = req.headers["x-edit-token"];

    if (!editTokenHeader) {
      return res.status(400).send({
        error: "Edit token header is missing.",
        invalid: true,
        violations: {
          edit_token: [
            {
              message: "Edit token is required in the header.",
            },
          ],
        },
      });
    }

    // Ensure the provided short_code is used in the query
    const selectSql = "SELECT * FROM url WHERE short_code = ?";
    const results = await executeQuery(selectSql, [short_code]);

    if (results.length === 0) {
      // If the short_code does not exist, return an error
      return res.status(404).send({ error: "Short code does not exist." });
    }

    const existingEntry = results[0];

    // If the edit_token does not match, return an error
    if (existingEntry.edit_token !== editTokenHeader) {
      return res.status(403).send({
        error:
          "Edit token does not match. Please specify the header X-EDIT-TOKEN.",
      });
    }

    // Generate a new unique edit_token
    const newEditToken = randomUUID();

    // Update the URL and edit_token for the existing short_code
    const updateSql =
      "UPDATE url SET target_url = ?, edit_token = ? WHERE short_code = ?";
    await executeQuery(updateSql, [target_url, newEditToken, short_code]);

    // Respond with the updated details
    res.status(200).send({
      short_code: short_code,
      edit_token: newEditToken,
      target_url: target_url,
    });
  })
);

export { RouteUpdate };
