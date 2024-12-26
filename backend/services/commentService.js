const { Comment, CommentSet, User, Photo } = require("../models");
const AppError = require("../utils/errorClass");

/**
 * Service for handling comment-related actions such as retrieving, adding, and deleting comments.
 * @class CommentService
 */
class CommentService {
  /**
   * Retrieves all comments based on the provided filters, including user details.
   * @async
   * @param {Object} filters - The filters to apply when retrieving comments(text,user id, user name).
   * @returns {Promise<Array>} - An array of comments matching the filters.
   */
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

  /**
   * Deletes comments by their IDs.
   * @async
   * @param {Array<number>} ids - An array of comment IDs to be deleted.
   * @returns {Promise<number>} - The number of deleted comments.
   */
  async deleteComments(ids) {
    const deletedCount = await Comment.destroy({
      where: { id: ids },
    });
    return deletedCount;
  }

  /**
   * Retrieves comments for a specific comment set, including user and photo details.
   * @async
   * @param {number} commentSetId - The ID of the comment set to retrieve comments for.
   * @returns {Promise<Array>} - An array of comments within the specified comment set.
   */
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
              attributes: ["url"], // for user profile photo display
            },
          ],
        },
      ],
    });

    if (!comments.length) {
      return [];
    }

    return comments;
  }

  /**
   * Adds a new comment.
   * @async
   * @param {Object} commentData - The data for the new comment.
   * @returns {Promise<Object>} - The newly created comment.
   */
  async addComment(commentData) {
    const newComment = await Comment.create(commentData);
    return newComment;
  }
}

module.exports = new CommentService();
