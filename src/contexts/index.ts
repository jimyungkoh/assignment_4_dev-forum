import { Router } from "express";
import boardsRouter from "./boards/boards.router";
import usersRouter from "./users/users.router";

const routers = Router();

routers.use("/users", usersRouter);
routers.use("/boards", boardsRouter);

export default routers;

