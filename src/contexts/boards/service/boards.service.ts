import { BoardType } from "../boards.type";
import { CreateCommentDto } from "../dto/comments.dto";
import { CreatePostDto, UpdatePostDto } from "../dto/posts.dto";
import boardsModel from "../model";
export const getLatestPosts = async (
  page: number = 0,
  itemsPerPage: number = 10
) => {
  if (page < 0 || itemsPerPage < 0) {
    page = 0;
    itemsPerPage = 10;
  }

  const backendPosts = await boardsModel.findManyPosts(
    "backend",
    page,
    itemsPerPage
  );

  const frontendPosts = await boardsModel.findManyPosts(
    "frontend", // 수정: "frontend"로 변경
    page,
    itemsPerPage
  );

  return { backend: backendPosts, frontend: frontendPosts };
};

export const getPostsByBoard = async (board: BoardType): Promise<any> => {
  const posts = await boardsModel.findManyPosts(board);

  return posts;
};

export const createPost = async (createPostDto: CreatePostDto) => {
  const result = await boardsModel.createdPost(createPostDto);
  return result;
};

export const getPostById = async (postId: string) => {
  const result = await boardsModel.findOnePostById(postId);
  return result;
};

export const updatePost = async (updatePostDto: UpdatePostDto) => {
  const data: any = {};

  if (updatePostDto.title) data.title = updatePostDto.title;

  if (updatePostDto.content) data.content = updatePostDto.content;

  return await boardsModel.updateOnePostById(updatePostDto.postId, data);
};

export const deletePost = async (postId: string) => {
  return await boardsModel.deletePostById(postId);
};

export const createComment = async (createCommentDto: CreateCommentDto) => {
  return await boardsModel.createComment(createCommentDto);
};

export const findOneCommentById = async (commentId: string) => {
  return await boardsModel.findOneCommentById(commentId);
};

export const updateComment = async (commentId: string, content: string) => {
  return await boardsModel.updateCommentById(commentId, content);
};
export const deleteComment = async (commentId: string) => {
  return await boardsModel.deleteCommentById(commentId);
};

export const likePost = async (postId: string, email: string) => {
  const like = await boardsModel.findPostLike(postId, email);

  if (!like) return await boardsModel.createPostLike(postId, email);

  return await boardsModel.togglePostsList(like.id, like.value);
};
