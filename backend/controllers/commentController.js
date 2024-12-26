const AppError = require("../utils/errorClass");
const commentService = require("../services/commentService");
const eventService = require("../services/eventService");
const subsidiaryService = require("../services/subsidiaryService");
const newsService = require("../services/newsService");
const { Op } = require("sequelize");

/**
 * Controller for handling actions related to comments such as retrieving, adding, deleting, and filtering comments.
 * Each method is associated with a specific entity (event, news, subsidiary) and facilitates interaction with the comment system.
 * @class CommentController
 */
class CommentController {
  /**
   * Retrieves all comments associated with a specific event identified by its event ID.
   * This method first fetches the event's comment set and then retrieves the associated comments.
   * On success, it returns a 200 status with the comments details
   *
   * @async
   * @param {Object} req - Express request object, containing the event ID as a URL parameter.
   * @param {Object} res - Express response object that will return the list of comments for the event.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} - Status 400 if no text is provided.
   * @throws {AppError} - Status 404 if the comment set is not found.
   * @returns {Promise<void>}
   */
  async getEventComments(req, res, next) {
    try {
      const { id } = req.params;

      //since event can have many comments we need to get the commentSet first
      const commentSet = await eventService.getEventCommentSetById(id);
      if (!commentSet) {
        throw new AppError("Comments not found", 404);
      }
      const comments = await commentService.getCommentsBySet(commentSet.id);
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new comment to a specific event, identified by the event ID in the URL.
   * This method ensures that the comment text is provided, then associates the comment with an event's comment set.
   * The comment is added and the newly created comment is returned in the response.
   * On success, it returns a 201 status with the comments details and success message.
   * @async
   * @param {Object} req - Express request object, containing the event ID and the comment data in the body (text, rating, userId).
   * @param {Object} res - Express response object, which will return the newly added comment in the response.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} - Status 400 if no text is provided.
   * @throws {AppError} - Status 404 if the comment set is not found.
   * @returns {Promise<void>}
   */
  async addEventComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

      //since event can have many comments we need to get the commentSet first to create connection
      const commentSet = await eventService.getEventCommentSetById(id);
      if (!commentSet) {
        throw new AppError("Comments not found", 404);
      }

      const newComment = await commentService.addComment({
        text,
        rating,
        commentSetId: commentSet.id,
        authorId: userId,
      });

      res.status(201).json({
        message: "Comment for event added successfully",
        comment: newComment,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all comments associated with a specific news item identified by its news ID.
   * Similar to the event comments, this method fetches the news item’s comment set and then retrieves the comments.
   * On success, it returns a 200 status with the comments details.
   * @async
   * @param {Object} req - Express request object, containing the news ID as a URL parameter.
   * @param {Object} res - Express response object that will return the list of comments for the news item.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} - Status 404 if the comment set is not found.
   * @returns {Promise<void>}
   */
  async getNewsComments(req, res, next) {
    try {
      const { id } = req.params;

      //since news can have many comments we need to get the commentSet first
      const commentSet = await newsService.getNewsCommentSetById(id);
      if (!commentSet) {
        throw new AppError("Comments not found", 404);
      }
      const comments = await commentService.getCommentsBySet(commentSet.id);

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new comment to a specific news item, identified by the news ID in the URL.
   * The comment's text, rating, and user ID are validated and the comment is then added to the appropriate comment set.
   * The newly added comment is returned in the response.
   * On success, it returns a 201 status with the comments details and success message.
   * @async
   * @param {Object} req - Express request object, containing the news ID and the comment data in the body (text, rating, userId).
   * @param {Object} res - Express response object, which will return the newly added comment in the response.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} - Status 400 if no text is provided.
   * @throws {AppError} - Status 404 if the comment set is not found.
   * @returns {Promise<void>}
   */
  async addNewsComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

      //since news can have many comments we need to get the commentSet first to create connection
      const commentSet = await newsService.getNewsCommentSetById(id);
      if (!commentSet) {
        throw new AppError("Comments not found", 404);
      }

      const newComment = await commentService.addComment({
        text,
        rating,
        commentSetId: commentSet.id,
        authorId: userId,
      });

      res.status(201).json({
        message: "Comment for news added successfully",
        comment: newComment,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all comments associated with a specific subsidiary, identified by its subsidiary ID.
   * This method works similarly to the event and news comment retrieval methods, by first fetching the subsidiary's comment set
   * and then retrieving the associated comments.
   * On success, it returns a 200 status with the comments details.
   * @async
   * @param {Object} req - Express request object, containing the subsidiary ID as a URL parameter.
   * @param {Object} res - Express response object which will return the list of comments for the subsidiary.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @returns {Promise<void>}
   */
  async getSubsidiaryComments(req, res, next) {
    try {
      const { id } = req.params;

      //since subsidiary can have many comments we need to get the commentSet first
      const commentSet = await subsidiaryService.getSubsidiaryCommentSetById(
        id
      );
      const comments = await commentService.getCommentsBySet(commentSet.id);

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new comment to a specific subsidiary, identified by the subsidiary ID in the URL.
   * The method validates the provided comment data (text, rating, userId) before associating it with the correct subsidiary's comment set.
   * Once added, the new comment is returned in the response.
   * On success, it returns a 201 status with the comments details with success message
   * @async
   * @param {Object} req - Express request object, containing the subsidiary ID and the comment data in the body (text, rating, userId).
   * @param {Object} res - Express response object which will return the newly added comment in the response.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} - Status 400 if no text is provided.
   * @throws {AppError} - Status 404 if the comment set is not found.
   * @returns {Promise<void>}
   */
  async addSubsidiaryComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!id) {
        throw new AppError("ID is required", 400);
      }

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

      //since subsidiary can have many comments we need to get the commentSet first to ensure connection
      const commentSet = await subsidiaryService.getSubsidiaryCommentSetById(
        id
      );

      if (!commentSet) {
        throw new AppError("Comments not found", 404);
      }

      const newComment = await commentService.addComment({
        text,
        rating,
        commentSetId: commentSet.id,
        authorId: userId,
      });

      res.status(201).json({
        message: "Comment for subsidiary added successfully",
        comment: newComment,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves all comments with optional filters, such as user ID, username, or text content.
   * On success, it returns a 200 status with the comments details.
   * @async
   * @param {Object} req - Express request object, containing optional filters as query parameters (id, username, text).
   * @param {Object} res - Express response object that will return the filtered list of comments.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @returns {Promise<void>}
   */
  async getAllComments(req, res, next) {
    try {
      const { id, username, text } = req.query;
      const filters = {};

      // Build the filter object based on query parameters
      if (id) filters["User.id"] = id;
      if (username) filters["User.username"] = { [Op.like]: `%${username}%` };
      if (text) filters.text = { [Op.like]: `%${text}%` };

      const comments = await commentService.getAllComments(filters);
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a list of comments based on the provided list of comment IDs.
   * The comment IDs are passed in the request body, and the comments are deleted in bulk.
   * On success, it returns a 200 status with the success message and deleted count.
   * @async
   * @param {Object} req - Express request object, containing the list of comment IDs to be deleted.
   * @param {Object} res - Express response object, which will return a success message along with the count of deleted comments.
   * @param {Function} next - Express next middleware function, typically used for error handling.
   * @throws {AppError} -  Error 400 If no valid comment IDs are provided
   * @returns {Promise<void>}
   */
  async deleteComments(req, res, next) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new AppError(
          "Invalid or missing 'ids' parameter. Provide an array of IDs.",
          400
        );
      }

      const deletedCount = await commentService.deleteComments(ids);
      res
        .status(200)
        .json({ message: "Successfully deleted comments", deletedCount });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();
