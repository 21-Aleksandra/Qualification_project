const AppError = require("../utils/errorClass");
const commentService = require("../services/commentService");
const eventService = require("../services/eventService");
const subsidiaryService = require("../services/subsidiaryService");
const newsService = require("../services/newsService");
const { Op } = require("sequelize");

class CommentController {
  async getEventComments(req, res, next) {
    try {
      const { id } = req.params;
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

  async addEventComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

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

  async getNewsComments(req, res, next) {
    try {
      const { id } = req.params;
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

  async addNewsComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

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

  async getSubsidiaryComments(req, res, next) {
    try {
      const { id } = req.params;
      const commentSet = await subsidiaryService.getSubsidiaryCommentSetById(
        id
      );
      const comments = await commentService.getCommentsBySet(commentSet.id);

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  async addSubsidiaryComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating, userId } = req.body;

      if (!text) {
        throw new AppError("Text is required to add a comment.", 400);
      }

      const commentSet = await subsidiaryService.getSubsidiaryCommentSetById(
        id
      );

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
  async getAllComments(req, res, next) {
    try {
      const { id, username, text } = req.query;
      const filters = {};

      if (id) filters["User.id"] = id;
      if (username) filters["User.username"] = { [Op.like]: `%${username}%` };
      if (text) filters.text = { [Op.like]: `%${text}%` };

      const comments = await commentService.getAllComments(filters);
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

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
