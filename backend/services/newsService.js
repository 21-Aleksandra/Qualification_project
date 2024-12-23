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

class NewsService {
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

  async getSubsidiaryNews(filters) {
    const { title, text, userRoles, userId, dateFrom, dateTo, subsidiaryIds } =
      filters;

    const whereClause = {
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(text && { content: { [Op.like]: `%${text}%` } }),
      ...(dateFrom && { createdAt: { [Op.gte]: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { [Op.lte]: new Date(dateTo) } }),
    };

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

  async addSubsidiaryNews(newsSetId, title, content, authorId) {
    const news = await News.create({
      newsSetId,
      title,
      content,
      authorId,
    });

    return news;
  }

  async editSubsidiaryNews(id, updateData) {
    const news = await News.findByPk(id);

    if (!news) {
      throw new AppError("News not found", 404);
    }

    if (updateData.subsidiaryId) {
      const newsSet = await subsidiaryService.getSubsidiaryNewsSetById(
        updateData.subsidiaryId
      );
      updateData.newsSetId = newsSet.id;
    }

    await news.update(updateData);
    return news;
  }

  async getEventNews(filters) {
    const { title, text, userRoles, userId, dateFrom, dateTo, eventIds } =
      filters;

    const whereClause = {
      ...(title && { title: { [Op.like]: `%${title}%` } }),
      ...(text && { content: { [Op.like]: `%${text}%` } }),
      ...(dateFrom && { createdAt: { [Op.gte]: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { [Op.lte]: new Date(dateTo) } }),
    };

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

  async addEventNews(newsSetId, title, content, authorId) {
    const news = await News.create({
      newsSetId,
      title,
      content,
      authorId,
    });

    return news;
  }

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
