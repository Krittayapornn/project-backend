import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswerData } from "../middleware/answers.validation.mjs";

const answersRouter = Router();

answersRouter.post(
  "/questions/:id/answers",
  [validateCreateAnswerData],
  async (req, res) => {
    const content = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
    };
    const questionId = req.params.id;
    try {
      await connectionPool.query(
        `insert into answers (question_id, content)
         values ($1, $2)`,
        [questionId, content.content]
      );
    } catch {
      return res.status(400).json({
        message: "Bad Request: Missing or invalid request data",
      });
    }
    return res.status(201).json({
      message: "Created: Answer created successfully",
    });
  }
);

answersRouter.get("/questions/:id/answers", async (req, res)=>{
  const questionId = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `select content from answers
        where question_id=$1`,
      [questionId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read content because database connection",
    });
  }
  if (!results.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested content",
    });
  }
  return res.status(200).json({
    data: results.rows,
  });
});

answersRouter.delete("/questions/:id", async(req, res)=>{
  const questionId = req.params.id;
  try{
    await connectionPool.query(
      `delete from answers
      where question_id=$1`,
      [questionId]
    );
  }catch {
    return res.status(500).json({
      message: "Server could not delete content because database connection"
    })
  }
  
  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});

answersRouter.post("/answers/:id/upvote", async(req, res)=>{
  const answersId = req.params.id;
  try{
    await connectionPool.query(
      `update answer_votes 
      set vote = 3 
      where answer_id = $1`,
      [answersId]
    );
  }catch {
    return res.status(404).json({
      message: "Not Found: Answer not found"
    })
  }
  return res.status(200).json({
    message: "OK: Successfully upvoted the answer"
  });
})


export default answersRouter;
