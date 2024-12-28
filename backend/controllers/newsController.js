const eventService = require("../services/eventService");
const newsService = require("../services/newsService");
const subsidiaryService = require("../services/subsidiaryService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling news-related actions such as retrieving, adding, editing, and deleting news for subsidiaries and events.
 * @class NewsController
 */
class NewsController {
  /**
   * Retrieves news related to subsidiaries.
   * If a subsidiary ID is provided, it is used to filter the news for specific subsidiaries.
   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object, containing the query parameters to filter the news.
   * @param {Object} res - Express response object, which returns the filtered news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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

  /**
   * Retrieves a single news item related to a subsidiary by its ID.
   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object, containing the news ID in the URL parameters.
   * @param {Object} res - Express response object, which returns the requested news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} -  If the ID is not provided or the news item is not found
   * @returns {Promise<void>}
   */
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

  /**
   * Adds news for a subsidiary.
   * The method validates that the required fields (`subsidiaryId`, `title`, and `authorId`) are provided in the request body.
   * On success, it returns a 200 status with the new news and successs message
   * @async
   * @param {Object} req - Express request object, containing the necessary fields in the body.
   * @param {Object} res - Express response object, which returns the newly added news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if any required fields are missing (`subsidiaryId`, `title`, `content`).
   * @returns {Promise<void>}
   */
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

  /**
   * Edits news for a subsidiary.
   * The method validates the necessary fields (`subsidiaryId`, `title`, `content`) and updates the news item for the subsidiary.
   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object, containing the news ID in the URL and updated data in the body.
   * @param {Object} res - Express response object, which returns the updated news for the subsidiary.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if any required fields are missing (`subsidiaryId`, `title`, `content`).
   * @returns {Promise<void>}
   */
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

      let userId = req.session.user.id;

      const updateData = {
        newsSetId: subsidiaryNewsSet.id,
        title,
        content,
      };

      const updatedNews = await newsService.editSubsidiaryNews(
        id,
        updateData,
        userId
      );

      res.status(200).json({
        message: "News for subsidiary edited successfully",
        news: updatedNews,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves news related to events.
   * If event IDs are provided, they are used to filter the news for specific events.
   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object, containing the query parameters to filter the news.
   * @param {Object} res - Express response object, which returns the filtered news for events.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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

  /**
   * This method fetches the news by the provided event ID and returns the details.

   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object, containing the news ID in the URL parameters.
   * @param {Object} res - Express response object, which returns the requested news for the event.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if the `id` parameter is missing or invalid.
   * @returns {Promise<void>}
   */
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

  /**
   * Adds news for an event.
   * The method validates that the required fields (`eventId`, `title`, and `authorId`) are provided in the request body.
   * On success, it returns a 201 status with the new news and successs message
   * @async
   * @param {Object} req - Express request object, containing the necessary fields in the body.
   * @param {Object} res - Express response object, which returns the newly added event news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if `subsidiaryId`, `title`, or `authorId` are missing.
   * @returns {Promise<void>}
   */
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

  /**
   * Edits news for an event.
   * The method validates the necessary fields (`eventId`, `title`, `content`) and updates the news item for the event.
   * On success, it returns a 200 status with the news and successs message
   * @async
   * @param {Object} req - Express request object, containing the event news ID in the URL and updated data in the body.
   * @param {Object} res - Express response object, which returns the updated event news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if any required fields are missing (`subsidiaryId`, `title`, `content`).
   * @returns {Promise<void>}
   */
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

      let userId = req.session.user.id;

      const updatedNews = await newsService.editEventNews(
        id,
        updateData,
        userId
      );

      res.status(200).json({
        message: "News for event edited successfully",
        news: updatedNews,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * This method fetches and returns the five most recent news entries from the service.
   * On success, it returns a 200 status with the news
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object, which returns the top five most recent news.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getTopFiveNews(req, res, next) {
    try {
      const news = await newsService.getTopFiveNews();
      res.status(200).json(news);
    } catch (err) {
      next(err);
    }
  }

  /**
   * This method accepts an array of news IDs and deletes the corresponding news entries.
   * On success, it returns a 200 status with the deleted count
   * @param {Object} req - Express request object, containing the array of news IDs in the body.
   * @param {Object} res - Express response object, which returns a success message and the count of deleted items.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if the `ids` parameter is missing or invalid.
   * @returns {Promise<void>}
   */
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
