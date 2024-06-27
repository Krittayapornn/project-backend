import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };

  try {
    await connectionPool.query(
      `insert into questions (title, description,category)
          values ($1, $2, $3)`,
      [newPost.title, newPost.description, newPost.category]
    );
  } catch {
    return res.status(400).json({
      message: "Bad Request: Missing or invalid request data",
    });
  }

  return res.status(201).json({
    message: "Created: Question created successfully",
  });
})

questionsRouter.get("/", async (req, res) => {
  let results;
  try {
    results = await connectionPool.query(`select * from questions `);
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }

  return res.status(200).json({
    data: results.rows,
  });
});

questionsRouter.get("/:id", async (req, res) => {
  const questionsIdFromClient = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `select * from questions
       where id=$1`,
      [questionsIdFromClient]
    );
  } catch {
    return res.status(404).json({
      message: "Not Found: Question not found",
    });
  }

  return res.status(200).json({
    data: results.rows[0],
  });
});

questionsRouter.put("/:id", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };
  const questionsIdFromClient = req.params.id;
  try {
    await connectionPool.query(
      `update questions
        set title = $2,
        description = $3
        where id=$1
        returning *`,
      [questionsIdFromClient, newPost.title, newPost.description]
    );
  } catch {
    return res.status(400).json({
      message: "Bad Request: Missing or invalid request data",
    });
  }

  if (!questionsIdFromClient) {
    return res.status(404).json({
      message: "Not Found: Question not found",
    });
  }

  return res.status(200).json({
    message: "OK: Successfully updated the question.",
  });
});

questionsRouter.delete("/:id", async (req, res) => {
  const questionsIdFromClient = req.params.id;
  try {
    await connectionPool.query(
      `delete from questions
       where id = $1`,
      [questionsIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete Question because database connection",
    });
  }

  if (!questionsIdFromClient) {
    return res.status(404).json({
      message: "Not Found: Question not found",
    });
  }

  return res.status(200).json({
    message: "OK: Successfully deleted the question",
  });
});

export default questionsRouter;