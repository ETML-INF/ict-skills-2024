import { Router } from "express";
import { randomUUID } from "crypto";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const exampleRouter = Router();

// Example route that can be deleted or adapted.
// This can be called via GET http://localhost:4000/api/example/blubb
exampleRouter.get(
  "/:var1",
  handleAsync(async (req, res, next) => {
    const results = await executeQuery(
      "SELECT 1 as id, 'example' as value WHERE 'example_param' = ?",
      ["example_param"]
    );
    res.send({
      foo: "bar",
      pathParam: req.params["var1"],
      uuid: randomUUID(),
      results,
    });
  })
);

export { exampleRouter };
