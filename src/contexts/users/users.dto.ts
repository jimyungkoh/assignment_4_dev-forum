import Joi from "joi";
import errorMessages from "../../errors/error.messages";

export const userRequestDtoSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages(errorMessages.stringRequired("이메일")),
  password: Joi.string()
    .required()
    .messages(errorMessages.stringRequired("패스워드")),
});

class UserDto {
  email!: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class UserRequestDto extends UserDto {
  password!: string;
  constructor(email: string, password: string) {
    super(email);
    this.password = password;
  }
}

export class UserResponseDto extends UserDto {}
