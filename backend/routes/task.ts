import { Router } from "express";
import { DI } from "..";
import Task from "../entities/Task";
const taskRouter = Router();

taskRouter.post("/newtask", async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .send("You are not logged in, therefore unpermitted to this operation.");
  }
  const newTask = await DI.em.create(Task, {
    title: req.body.title,
    description: req.body.description,
  });
  if (req.body.due_date != null) {
    newTask.due_date = new Date(req.body.due_date);
  }
  await DI.em.persistAndFlush(newTask);
  return res.status(200).send({ data: newTask, errors: null });
});
