import prismaClient from "../../../database/sql";
import { BoardType } from "../boards.type";
import { CreateCommentDto } from "../dto/comments.dto";
import { CreatePostDto } from "../dto/posts.dto";
export const findManyPosts = async (
  boardName: BoardType,
  page?: number,
  itemsPerPage?: number
) => {
  let offset = itemsPerPage && page ? page * itemsPerPage : 0;
  let take: number | undefined = itemsPerPage;

  return await prismaClient.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: {
          email: true,
        },
      },
      board: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          Comment: true,
          Like: true,
        },
      },
    },
    where: {
      board: {
        name: boardName,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: take,
  });
};

export const createdPost = async (createPostDto: CreatePostDto) => {
  const { title, content, email, boardName } = createPostDto;
  return await prismaClient.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          email,
        },
      },
      board: {
        connect: {
          name: boardName,
        },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      board: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          email: true,
        },
      },
      createdAt: true,
    },
  });
};

export const findOnePostById = async (postId: string) => {
  return await prismaClient.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: { email: true },
      },
      _count: {
        select: {
          Like: true,
          Comment: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateOnePostById = async (id: string, data: any) => {
  return await prismaClient.post.update({
    data: { ...data, updatedAt: new Date() },
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deletePostById = async (postId: string) => {
  return await prismaClient.post.delete({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });
};

export const createComment = async (createCommentDto: CreateCommentDto) => {
  return await prismaClient.comment.create({
    data: {
      content: createCommentDto.content,
      post: {
        connect: {
          id: createCommentDto.postId,
        },
      },
      author: {
        connect: {
          email: createCommentDto.email,
        },
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      postId: true,
      authorId: true,
    },
  });
};

export const findOneCommentById = async (commentId: string) => {
  return await prismaClient.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      author: {
        select: {
          email: true,
        },
      },
    },
  });
};

export const updateCommentById = async (commentId: string, content: string) => {
  return await prismaClient.comment.update({
    data: {
      content,
      updatedAt: new Date(),
    },
    where: {
      id: commentId,
    },
  });
};

export const deleteCommentById = async (commentId: string) => {
  return await prismaClient.comment.delete({
    where: {
      id: commentId,
    },
    select: {
      id: true,
    },
  });
};

export const findPostLike = async (postId: string, email: string) => {
  return await prismaClient.like.findFirst({
    where: {
      post: {
        id: postId,
      },
      liker: {
        email: email,
      },
    },
    select: {
      id: true,
      value: true,
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      liker: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const createPostLike = async (postId: string, email: string) => {
  return await prismaClient.like.create({
    data: {
      value: true,
      post: {
        connect: {
          id: postId,
        },
      },
      liker: {
        connect: {
          email: email,
        },
      },
    },
    select: {
      id: true,
      value: true,
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      liker: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const togglePostsList = async (likeId: string, value: boolean) => {
  return await prismaClient.like.update({
    data: {
      value: !value,
    },
    where: {
      id: likeId,
    },
    select: {
      id: true,
      value: true,
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      liker: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};
