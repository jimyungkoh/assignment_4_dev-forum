import { Router } from "express";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/http-client-side.error";
import formattedResponse from "../../utils/formatted-response";
import wrapAsync from "../../utils/wrap-async";
import { BoardType, isBoardType } from "./boards.type";
import {
  CreateCommentDto,
  createCommentDtoSchema,
  updateCommentDtoSchema,
} from "./dto/comments.dto";
import {
  CreatePostDto,
  UpdatePostDto,
  createPostDtoSchema,
} from "./dto/posts.dto";
import boardsService from "./service";

const boardsRouter = Router();

// 최신 게시물 가져오기
boardsRouter.get(
  "/latest/posts",
  wrapAsync(async (req, res) => {
    const posts = await boardsService.getLatestPosts();
    res.json(formattedResponse(true, posts));
  })
);

// 게시판별 게시물 가져오기
boardsRouter.get(
  "/:boardName(backend|frontend)/posts",
  wrapAsync(async (req, res) => {
    const { boardName } = req.params;

    if (!isBoardType(boardName)) {
      throw new NotFoundError("존재하지 않는 게시판입니다.");
    }

    const posts = await boardsService.getPostsByBoard(boardName as BoardType);
    if (!posts) throw new NotFoundError("게시물이 존재하지 않습니다.");

    res.json(formattedResponse(true, posts));
  })
);

// 게시물 단건 조회
boardsRouter.get(
  "/:boardName(backend|frontend)/posts/:postId",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;
    const posts = await boardsService.getPostById(postId);
    res.json(formattedResponse(true, posts));
  })
);

// 게시물 생성
boardsRouter.post(
  "/:boardName(backend|frontend)/posts",
  wrapAsync(async (req, res) => {
    const { title, content } = await createPostDtoSchema.validateAsync(
      req.body
    );
    const { boardName } = req.params;
    const { email } = req.user as { email: string };

    if (!email) throw new UnauthorizedError("사용자 정보를 찾을 수 없습니다.");

    const createPostDto = new CreatePostDto(
      email,
      title,
      content,
      boardName as BoardType
    );
    const result = await boardsService.createPost(createPostDto);

    res.status(201).json(formattedResponse(true, result));
  })
);

// 게시물 수정
boardsRouter.put(
  "/posts/:postId",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const { title, content } = await createPostDtoSchema.validateAsync(
      req.body
    );
    const post = await boardsService.getPostById(postId);
    const { email } = req.user as { email: string };

    if (!post) throw new NotFoundError("게시물이 존재하지 않습니다.");
    else if (post.author.email != email)
      throw new ForbiddenError("게시물 수정 권한이 없습니다.");

    const updatePostDto = new UpdatePostDto(postId, email, title, content);
    const result = await boardsService.updatePost(updatePostDto);

    res.status(200).json(formattedResponse(true, result));
  })
);

// 게시물 삭제
boardsRouter.delete(
  "/posts/:postId",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const post = await boardsService.getPostById(postId);
    const { email } = req.user as { email: string };

    if (!post) {
      throw new NotFoundError("게시물이 존재하지 않습니다.");
    } else if (post.author.email != email) {
      throw new ForbiddenError("게시물 삭제 권한이 없습니다.");
    }

    const result = await boardsService.deletePost(postId);

    res.status(200).json(formattedResponse(true, result));
  })
);

// 댓글 작성
boardsRouter.post(
  "/posts/:postId/comments",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const { content } = await createCommentDtoSchema.validateAsync(req.body);
    const { email } = req.user as { email: string };
    if (!email) throw new UnauthorizedError("사용자 정보를 찾을 수 없습니다.");

    const post = await boardsService.getPostById(postId);
    if (!post) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const createCommentDto = new CreateCommentDto(postId, email, content);
    const result = await boardsService.createComment(createCommentDto);

    res.status(201).json(formattedResponse(true, result));
  })
);

// 댓글 수정
boardsRouter.put(
  "/posts/:postId/comments/:commentId",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");
    if (!commentId) throw new NotFoundError("댓글이 존재하지 않습니다.");

    const { content } = await updateCommentDtoSchema.validateAsync(req.body);
    const { email } = req.user as { email: string };
    if (!email) throw new UnauthorizedError("사용자 정보를 찾을 수 없습니다.");

    const post = await boardsService.getPostById(postId);
    if (!post) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const comment = await boardsService.findOneCommentById(commentId);
    if (!comment) throw new NotFoundError("댓글이 존재하지 않습니다");
    else if (email !== comment.author.email)
      throw new ForbiddenError("댓글 수정 권한이 없습니다.");

    const result = await boardsService.updateComment(commentId, content);

    res.status(200).json(formattedResponse(true, result));
  })
);

// 댓글 삭제
boardsRouter.delete(
  "/posts/:postId/comments/:commentId",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");
    if (!commentId) throw new NotFoundError("댓글이 존재하지 않습니다.");

    const { email } = req.user as { email: string };
    if (!email) throw new UnauthorizedError("사용자 정보를 찾을 수 없습니다.");

    const post = await boardsService.getPostById(postId);
    if (!post) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const comment = await boardsService.findOneCommentById(commentId);

    if (!comment) throw new NotFoundError("댓글이 존재하지 않습니다");
    else if (email !== comment.author.email)
      throw new ForbiddenError("댓글 삭제 권한이 없습니다.");

    const result = await boardsService.deleteComment(commentId);

    res.status(200).json(formattedResponse(true, result));
  })
);

// 좋아요 기능
boardsRouter.post(
  "/posts/:postId/like",
  wrapAsync(async (req, res) => {
    const postId = req.params.postId;

    if (!postId) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const post = await boardsService.getPostById(postId);
    const { email } = req.user as { email: string };

    if (!post) throw new NotFoundError("게시물이 존재하지 않습니다.");

    const result = await boardsService.likePost(postId, email);

    res.status(200).json(formattedResponse(true, result));
  })
);

export default boardsRouter;
