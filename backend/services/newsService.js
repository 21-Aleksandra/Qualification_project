const {
  News,
  Comment_Set,
  Comment,
  Subsidiary,
  News_Set,
  User,
  Role,
  Event,
} = require("../models");
const AppError = require("../utils/errorClass");
const { Op } = require("sequelize");
const Roles = require("../enums/roles");

/**
 * Service for managing news.
 * Provides operations like fetching, creating, updating, and deleting news entries
 * depending on news type- event, subsidiary.
 * @class NewsService
 */
class NewsService {
  /**
   * Fetches the comment set associated with a specific news entry.
   * @async
   * @param {number} id - ID of the news entry.
   * @returns {Promise<Object>} - The associated comment set.
   * @throws {AppError} - If the news or its comment set is not found.
   */
  async getNewsCommentSetById(id) {
    const news = await News.findByPk(id);

    if (!news) {
      throw new AppError("News not found", 404);
    }

    const commentSet = await Comment_Set.findByPk(news.commentSetId);

    if (!commentSet) {
      throw new AppError("Comment set not found for this news", 404);
    }

    return commentSet;
  }

  /**
   * Retrieves news entries related to specific subsidiaries based on filters.
   * If users role includes manager than retrueves only news specific to this manager
   * @async
   * @param {Object} filters - Filters for retrieving subsidiary news (title, text, userRoles, userId, etc.)
   * @returns {Promise<Array>} - List of subsidiary news entries.
   */
  async getSubsidiaryNews(filters) {
    const { title, text, userRoles, userId, dateFrom, dateTo, subsidiaryIds } =
      filters;

    const whereClause = {
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(text && { content: { [Op.like]: `%${text}%` } }),
      ...(dateFrom && { createdAt: { [Op.gte]: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { [Op.lte]: new Date(dateTo) } }),
    };

    // Restrict results to the manager's authored news if applicable
    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      whereClause.authorId = userId;
    }

    const subsidiaries = await Subsidiary.findAll({
      attributes: ["id", "newsSetId"],
      where: {
        ...(subsidiaryIds &&
          subsidiaryIds.length > 0 && { id: { [Op.in]: subsidiaryIds } }),
      },
    });

    const newsSetIds = subsidiaries
      .map((subsidiary) => subsidiary.newsSetId)
      .filter((newsSetId) => newsSetId != null);

    if (newsSetIds.length === 0) {
      // return if no news sets e.g. no news
      return [];
    }

    whereClause.newsSetId = { [Op.in]: newsSetIds };

    const news = await News.findAll({
      where: whereClause,
      include: [
        {
          model: News_Set,
          include: [
            {
              model: Subsidiary,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return news;
  }
  /**
   * Retrieves a specific subsidiary news entry by ID.
   * @async
   * @param {number} id - ID of the subsidiary news.
   * @returns {Promise<Object>} - The subsidiary news entry with associated data.
   * @throws {AppError} - If the news or associated subsidiary is not found.
   */
  async getOneSubsidiaryNews(id) {
    const whereClause = {
      id: id,
    };

    const news = await News.findOne({
      where: whereClause,
      include: [
        {
          model: News_Set,
          include: [
            {
              model: Subsidiary,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (!news || !news.News_Set || !news.News_Set.Subsidiary) {
      throw new AppError(
        "Subsidiary News not found or not associated with a subsidiary",
        404
      );
    }

    return news;
  }

  /**
   * Adds a new subsidiary news entry to the database.
   *
   * @async
   * @param {number} newsSetId - ID of the news set associated with the subsidiary.
   * @param {string} title - Title of the news.
   * @param {string} content - Content of the news.
   * @param {number} authorId - ID of the author.
   * @returns {Promise<Object>} - The newly created subsidiary news entry.
   */

  async addSubsidiaryNews(newsSetId, title, content, authorId) {
    const news = await News.create({
      newsSetId,
      title,
      content,
      authorId,
    });

    return news;
  }

  /**
   * Updates an existing subsidiary news entry.
   * Allows updating fields such as event association, title, and content.
   * @async
   * @param {number} id - ID of the news entry to update.
   * @param {Object} updateData - Fields to update.
   * @returns {Promise<Object>} - The updated subsidiary news entry.
   * @throws {AppError} - If the news entry is not found.
   */
  async editSubsidiaryNews(id, updateData) {
    const news = await News.findByPk(id);

    if (!news) {
      throw new AppError("News not found", 404);
    }

    // If changing the associated subsidiary, update the news set ID
    if (updateData.subsidiaryId) {
      const newsSet = await subsidiaryService.getSubsidiaryNewsSetById(
        updateData.subsidiaryId
      );
      updateData.newsSetId = newsSet.id;
    }

    await news.update(updateData);
    return news;
  }

  /**
   * Fetches news entries related to specific events based on filters.
   * If users role includes manager than retrueves only news specific to this manager
   * @async
   * @param {Object} filters - Filters for retrieving event news.(title, text, userRoles, userId, etc.)
   * @returns {Promise<Array>} - List of event news entries.
   */

  async getEventNews(filters) {
    const { title, text, userRoles, userId, dateFrom, dateTo, eventIds } =
      filters;

    const whereClause = {
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(text && { content: { [Op.like]: `%${text}%` } }),
      ...(dateFrom && { createdAt: { [Op.gte]: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { [Op.lte]: new Date(dateTo) } }),
    };

    // Restrict results to the manager's authored news if applicable
    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      whereClause.authorId = userId;
    }

    const events = await Event.findAll({
      attributes: ["id", "newsSetId"],
      where: {
        ...(eventIds && eventIds.length > 0 && { id: { [Op.in]: eventIds } }),
      },
    });

    const newsSetIds = events
      .map((event) => event.newsSetId)
      .filter((newsSetId) => newsSetId != null);

    if (newsSetIds.length === 0) {
      return [];
    }

    whereClause.newsSetId = { [Op.in]: newsSetIds };

    const news = await News.findAll({
      where: whereClause,
      include: [
        {
          model: News_Set,
          include: [
            {
              model: Event,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return news;
  }

  /**
   * Fetches a specific event news entry by its ID.
   * @async
   * @param {number} id - ID of the event news to retrieve.
   * @returns {Promise<Object>} - The requested event news entry.
   * @throws {AppError} - If the news or its associated event is not found.
   */
  async getOneEventNews(id) {
    const whereClause = {
      id: id,
    };

    const news = await News.findOne({
      where: whereClause,
      include: [
        {
          model: News_Set,
          include: [
            {
              model: Event,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (!news || !news.News_Set || !news.News_Set.Event) {
      throw new AppError(
        "Event News not found or not associated with an event",
        404
      );
    }

    return news;
  }

  /**
   * Adds a new event news entry to the database.
   * @async
   * @param {number} newsSetId - ID of the news set to associate the news with.
   * @param {string} title - Title of the news.
   * @param {string} content - Content of the news.
   * @param {number} authorId - ID of the author creating the news.
   * @returns {Promise<Object>} - The newly created event news entry.
   */
  async addEventNews(newsSetId, title, content, authorId) {
    const news = await News.create({
      newsSetId,
      title,
      content,
      authorId,
    });

    return news;
  }

  /**
   * Updates an existing event news entry by its ID.
   * Allows updating fields such as event association, title, and content.
   * @async
   * @param {number} id - ID of the news entry to update.
   * @param {Object} updateData - Fields to update.
   * @returns {Promise<Object>} - The updated event news entry.
   * @throws {AppError} - If the news entry is not found.
   */
  async editEventNews(id, updateData) {
    const news = await News.findByPk(id);

    if (!news) {
      throw new AppError("News not found", 404);
    }

    if (updateData.eventId) {
      const newsSet = await eventService.getEventNewsSetById(
        updateData.eventId
      );
      updateData.newsSetId = newsSet.id;
    }

    await news.update(updateData);
    return news;
  }

  /**
   * Fetches the top 5 most recent news entries.
   * Includes author details for each news entry.
   * @async
   * @returns {Promise<Array>} - List of the top 5 news entries.
   */
  async getTopFiveNews() {
    const news = await News.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    return news;
  }

  /**
   * Deletes multiple news entries by their IDs.
   * @async
   * @param {Array<number>} ids - IDs of the news entries to delete.
   * @returns {Promise<number>} - The count of deleted news entries.
   * @throws {AppError} - If no news entries are found for the given IDs.
   */
  async deleteNewsRange(ids) {
    const deletedCount = await News.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (deletedCount === 0) {
      throw new AppError("No news items found for the given IDs", 404);
    }

    return deletedCount;
  }
}

module.exports = new NewsService();
