import { Router } from "express";
import { randomUUID, randomBytes } from "crypto";
import { handleAsync, sendNotFound } from "../util.js";
import { executeQuery } from "../db.js";

const RouteCreate = Router();
/*
RouteCreate.use('/', (req, res, next) => {
  const { target_url, short_code } = req.body;
  let code = short_code;
  const violations = {};

  // Validate the target URL
  if (!target_url) {
      violations.target_url = [{ message: "Target URL is required." }];
  } else {
      const urlViolations = validateTargetUrl(target_url);
      if (urlViolations.length > 0) {
          violations.target_url = urlViolations;
      }
  }

  // Generate a random short code if none is provided
  if (!code) {
      code = generateRandomShortCode();
  }

  // Validate the short code
  const shortCodeViolations = validateShortCode(code);
  if (shortCodeViolations.length > 0) {
      violations.short_code = shortCodeViolations;
  }

  // Check for violations
  if (Object.keys(violations).length > 0) {
      return res.status(400).send({
          error: "Request body is not valid.",
          invalid: true,
          violations: violations
      });
  }

  // Attach the generated or provided short code to the request
  req.body.short_code = code;
  next();
});

RouteCreate.post('/', handleAsync(async (req, res) => {
  const { target_url, short_code } = req.body;

  // Check if the target_url already exists
  const checkUrlSql = 'SELECT * FROM url WHERE target_url = ?';
  const existingUrl = await executeQuery(checkUrlSql, [target_url]);
  if (existingUrl.length > 0) {
      return res.status(400).send({
          error: "Request body is not valid.",
          invalid: true,
          violations: {
              target_url: [{ message: "Target URL already exists." }]
          }
      });
  }

  // Check if the short_code already exists
  const checkCodeSql = 'SELECT * FROM url WHERE short_code = ?';
  const existingCode = await executeQuery(checkCodeSql, [short_code]);
  if (existingCode.length > 0) {
      return res.status(400).send({
          error: "Request body is not valid.",
          invalid: true,
          violations: {
              short_code: [{ message: "Short Code is already in use." }]
          }
      });
  }

  // Insert the new short URL
  const edit_token = randomUUID();
  const insertSql = 'INSERT INTO url (target_url, short_code, edit_token) VALUES (?, ?, ?)';
  await executeQuery(insertSql, [target_url, short_code, edit_token]);

  // Respond with the created short URL
  res.status(201).send({
      short_code: short_code,
      target_url: target_url,
      edit_token: edit_token
  });
}));

export default RouteCreate;

// Function to generate a random short code
function generateRandomShortCode() {
  return randomBytes(4).toString('hex').slice(0, 12);
}

// Function to validate the target URL
function validateTargetUrl(url) {
  const errors = [];
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
      errors.push({ message: "Target URL must start with http:// or https://." });
  }
  if (url.length > 300) {
      errors.push({ message: "Target URL must be at most 300 characters long." });
  }

  // Check for "dot missing" and "dot not surrounded"
  const domain = url.replace(/^(http:\/\/|https:\/\/)/, ""); // Strip protocol
  if (!domain.includes(".")) {
      errors.push({ message: "Target URL dot missing." });
  } else if (/(\.\.)|(\.$)|(^\.)/.test(domain)) {
      errors.push({ message: "Target URL dot not surrounded." });
  } else {
      const parts = domain.split(".");
      const tld = parts[parts.length - 1]; // Last part after the dot
      if (!/^[a-zA-Z]+$/.test(tld)) {
          errors.push({ message: "Target URL dot followed by invalid characters." });
      }
  }

  return errors;
}

// Function to validate the short code
function validateShortCode(code) {
  const errors = [];
  if (code.length < 4) {
      errors.push({ message: "Short Code must be at least 4 characters long." });
  }
  if (code.length > 12) {
      errors.push({ message: "Short Code must be at most 12 characters long." });
  }
  if (!/^[a-zA-Z0-9]+$/.test(code)) {
      errors.push({ message: "Short Code contains invalid characters." });
  }
  return errors;
}
*/


  function generateRandomShortCode() {
    return randomBytes(4).toString('hex').slice(0, 12);
}

RouteCreate.put('/', handleAsync(async (req, res) => {
    const { target_url, short_code } = req.body;

    // Ensure the provided short_code is used in the query
    const selectSql = 'SELECT * FROM url WHERE short_code = ?';
    const results = await executeQuery(selectSql, [short_code]);

    if (results.length === 0) {
        // If the short_code does not exist, return an error
        return res.status(404).send({ message: "Short code not found." });
    }

    // Generate a new unique edit_token
    const newEditToken = randomUUID();

    // Update the URL and edit_token for the existing short_code
    const updateSql = 'UPDATE url SET target_url = ?, edit_token = ? WHERE short_code = ?';
    await executeQuery(updateSql, [target_url, newEditToken, short_code]);

    // Respond with the updated details
    res.status(200).send({
        short_code: short_code,
        edit_token: newEditToken,
        target_url: target_url
    });
}));


export { RouteCreate };