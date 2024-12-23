const eventService = require("../services/eventService");
const newsService = require("../services/newsService");
const subsidiaryService = require("../services/subsidiaryService");
const AppError = require("../utils/errorClass");

class NewsController {
  async getSubsidiaryNews(req, res, next) {
    try {
      const {
        title,
        text,
        userRoles,
        userId,
        dateFrom,
        dateTo,
        subsidiaryIds,
      } = req.query;

      const subsidiaryIdsArray = subsidiaryIds
        ? subsidiaryIds.split(",").map((id) => Number(id.trim()))
        : [];

      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];

      const news = await newsService.getSubsidiaryNews({
        title,
        text,
        userRoles: rolesArray,
        userId,
        dateFrom,
        dateTo,
        subsidiaryIds: subsidiaryIdsArray,
      });

      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  async getOneSubsidiaryNews(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("News ID is required", 400);
      }

      const news = await newsService.getOneSubsidiaryNews(id);
      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  async addSubsidiaryNews(req, res, next) {
    try {
      const { subsidiaryId, title, content, authorId } = req.body;

      if (!subsidiaryId || !title || !authorId) {
        throw new AppError(
          "Fields subsidiaryId, title, and authorId are required",
          400
        );
      }

      const subsidiaryNewsSet =
        await subsidiaryService.getSubsidiaryNewsSetById(subsidiaryId);

      if (!subsidiaryNewsSet) {
        throw new AppError("Failed to get news set", 400);
      }

      const news = await newsService.addSubsidiaryNews(
        subsidiaryNewsSet.id,
        title,
        content,
        authorId
      );

      res.status(201).json({
        message: "News for subsidiary added successfully",
        news: news,
      });
    } catch (err) {
      next(err);
    }
  }

  async editSubsidiaryNews(req, res, next) {
    try {
      const { id } = req.params;
      const { subsidiaryId, title, content } = req.body;

      if (!id) {
        throw new AppError("News ID is required", 400);
      }

      if (!subsidiaryId) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      const subsidiaryNewsSet =
        await subsidiaryService.getSubsidiaryNewsSetById(subsidiaryId);

      if (!subsidiaryNewsSet) {
        throw new AppError(
          "Failed to find news set for the given subsidiary ID",
          400
        );
      }

      const updateData = {
        newsSetId: subsidiaryNewsSet.id,
        title,
        content,
      };

      const updatedNews = await newsService.editSubsidiaryNews(id, updateData);

      res.status(200).json({
        message: "News for subsidiary edited successfully",
        news: updatedNews,
      });
    } catch (err) {
      next(err);
    }
  }

  async getEventNews(req, res, next) {
    try {
      const { title, text, userRoles, userId, dateFrom, dateTo, eventIds } =
        req.query;

      const eventIdsArray = eventIds
        ? eventIds.split(",").map((id) => Number(id.trim()))
        : [];

      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];

      const news = await newsService.getEventNews({
        title,
        text,
        userRoles: rolesArray,
        userId,
        dateFrom,
        dateTo,
        eventIds: eventIdsArray,
      });

      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  async getOneEventNews(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("News ID is required", 400);
      }

      const news = await newsService.getOneEventNews(id);
      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  async addEventNews(req, res, next) {
    try {
      const { eventId, title, content, authorId } = req.body;

      if (!eventId || !title || !authorId) {
        throw new AppError(
          "Fields eventId, title, and authorId are required",
          400
        );
      }

      const eventNewsSet = await eventService.getEventNewsSetById(eventId);

      if (!eventNewsSet) {
        throw new AppError("Failed to get event news set", 400);
      }

      const news = await newsService.addEventNews(
        eventNewsSet.id,
        title,
        content,
        authorId
      );

      res.status(201).json({
        message: "News for event added successfully",
        news: news,
      });
    } catch (err) {
      next(err);
    }
  }

  async editEventNews(req, res, next) {
    try {
      const { id } = req.params;
      const { eventId, title, content } = req.body;

      if (!id) {
        throw new AppError("News ID is required", 400);
      }

      if (!eventId) {
        throw new AppError("Event ID is required", 400);
      }

      const eventNewsSet = await eventService.getEventNewsSetById(eventId);

      if (!eventNewsSet) {
        throw new AppError(
          "Failed to find news set for the given event ID",
          400
        );
      }

      const updateData = {
        newsSetId: eventNewsSet.id,
        title,
        content,
      };

      const updatedNews = await newsService.editEventNews(id, updateData);

      res.status(200).json({
        message: "News for event edited successfully",
        news: updatedNews,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTopFiveNews(req, res, next) {
    try {
      const news = await newsService.getTopFiveNews();
      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  async deleteNews(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids)) {
        throw new AppError("A valid array of IDs is required", 400);
      }

      const deletedCount = await newsService.deleteNewsRange(ids);
      res
        .status(200)
        .json({ message: "Successfully deleted news", deletedCount });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NewsController();
