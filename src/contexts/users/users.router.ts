import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  ConflictError,
  UnauthorizedError,
} from "../../errors/http-client-side.error";
import wrapAsync from "../../utils/wrap-async";
import usersService from "./service";
import { UserRequestDto, userRequestDtoSchema } from "./users.dto";
const usersRouter = Router();
const jwtSecret = process.env.JWT_SECRET || "";

usersRouter.post(
  "/sign-up",
  wrapAsync(async (req, res, _) => {
    const { email, password } = await userRequestDtoSchema.validateAsync(
      req.body
    );

    const userDto = new UserRequestDto(email, password);
    const user = await usersService.createUser(userDto);

    if (!user) throw new ConflictError("이미 존재하는 유저입니다.");

    const token = jwt.sign({}, jwtSecret, { subject: user.email });

    res.status(201).header("authorization", `Bearer ${token}`).json({ token });
  })
);

usersRouter.post(
  "/sign-in",
  wrapAsync(async (req, res, body) => {
    const { email, password } = await userRequestDtoSchema.validateAsync(
      req.body
    );

    const userDto = new UserRequestDto(email, password);

    const user = await usersService.validateUser(userDto);

    if (!user)
      throw new UnauthorizedError("이메일 또는 패스워드가 일치하지 않습니다.");

    const token = jwt.sign({}, jwtSecret, { subject: user.email });

    res.status(200).header("authorization", `Bearer ${token}`).json({ token });
  })
);

export default usersRouter;
