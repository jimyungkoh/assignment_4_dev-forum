import bcrypt, { hash } from "bcrypt";
import prismaClient from "../../../database/sql";
import { UserRequestDto, UserResponseDto } from "../users.dto";

export const createUser = async (userDto: UserRequestDto) => {
  const { email, password } = userDto;

  const duplicateUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (duplicateUser) return;

  const encryptedPassword = await hash(password, 12);

  const user = await prismaClient.user.create({
    data: { email, encryptedPassword },
    select: { email: true, createdAt: true },
  });

  return new UserResponseDto(user.email);
};

export const validateUser = async (userDto: UserRequestDto) => {
  const { email, password } = userDto;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) return;

  const passwordMatch = await bcrypt.compare(password, user.encryptedPassword);

  if (!passwordMatch) return;

  return new UserResponseDto(user.email);
};
