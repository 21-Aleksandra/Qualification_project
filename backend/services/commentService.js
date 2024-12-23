const { Comment, CommentSet, User, Photo } = require("../models");
const AppError = require("../utils/errorClass");

class CommentService {
  async getAllComments(filters) {
    const commentFilters = {};
    const userFilters = {};

    if (filters.text) commentFilters.text = filters.text;
    if (filters["User.id"]) userFilters.id = filters["User.id"];
    if (filters["User.username"])
      userFilters.username = filters["User.username"];

    const comments = await Comment.findAll({
      where: commentFilters,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
          where: userFilters,
          required: true,
        },
      ],
    });
    return comments;
  }

  async deleteComments(ids) {
    const deletedCount = await Comment.destroy({
      where: { id: ids },
    });
    return deletedCount;
  }

  async getCommentsBySet(commentSetId) {
    const comments = await Comment.findAll({
      where: { commentSetId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["username"],
          include: [
            {
              model: Photo,
              as: "Photo",
              attributes: ["url"],
            },
          ],
        },
      ],
    });

    if (!comments.length) {
      throw new AppError("Comments not found", 404);
    }

    return comments;
  }

  async addComment(commentData) {
    const newComment = await Comment.create(commentData);
    return newComment;
  }
}

module.exports = new CommentService();
