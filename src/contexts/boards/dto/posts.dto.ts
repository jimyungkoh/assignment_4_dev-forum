import Joi from "joi";
import errorMessages from "../../../errors/error.messages";
import { BoardType } from "../boards.type";

export const createPostDtoSchema = Joi.object({
  title: Joi.string().required().messages(errorMessages.stringRequired("제목")),
  content: Joi.string()
    .required()
    .messages(errorMessages.stringRequired("내용")),
});

export const updatePostDtoSchema = Joi.object({
  title: Joi.string().messages(errorMessages.string("제목")),
  content: Joi.string().messages(errorMessages.string("내용")),
});

export class CreatePostDto {
  email!: string;
  title!: string;
  content!: string;
  boardName!: BoardType;
  constructor(
    email: string,
    title: string,
    content: string,
    boardName: BoardType
  ) {
    this.email = email;
    this.title = title;
    this.content = content;
    this.boardName = boardName;
  }
}

export class UpdatePostDto {
  postId!: string;
  email!: string;
  title?: string;
  content?: string;
  constructor(postId: string, email: string, title?: string, content?: string) {
    this.postId = postId;
    this.email = email;
    this.title = title;
    this.content = content;
  }
}
