import Joi from "joi";
import errorMessages from "../../../errors/error.messages";

const commentContentSchema = Joi.string()
  .required()
  .messages(errorMessages.stringRequired("내용"));

export const createCommentDtoSchema = Joi.object({
  content: commentContentSchema,
});

export const updateCommentDtoSchema = Joi.object({
  content: commentContentSchema,
});

export class CreateCommentDto {
  postId!: string;
  email!: string;
  content!: string;
  constructor(postId: string, email: string, content: string) {
    this.postId = postId;
    this.email = email;
    this.content = content;
  }
}
