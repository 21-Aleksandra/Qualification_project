const eventService = require("../services/eventService");
const AppError = require("../utils/errorClass");

class EventController {
  async getEventFilteredList(req, res, next) {
    try {
      const filters = {
        name: req.query.name || "",
        cities: req.query.cities
          ? req.query.cities.split(",").map((city) => city.trim())
          : [],
        countries: req.query.countries
          ? req.query.countries.split(",").map((country) => country.trim())
          : [],
        subsidiaryIds: req.query.subsidiaryIds
          ? req.query.subsidiaryIds.split(",").map((id) => id.trim())
          : [],
        typeIds: req.query.typeIds
          ? req.query.typeIds.split(",").map((id) => id.trim())
          : [],
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        applicationDeadline: req.query.applicationDeadline,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        userId: req.query.userId,
        userRoles: req.query.userRoles
          ? req.query.userRoles.split(",").map((role) => Number(role.trim()))
          : [],
      };

      const events = await eventService.getEventFilteredList(filters);

      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.query.userId;
      const userRoles = req.query.userRoles;
      if (!id) {
        throw new AppError("Eevent ID is required", 400);
      }

      const event = await eventService.getEventById(id, userId, userRoles);

      res.status(200).json(event);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getEventNamesList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];

      const events = await eventService.findEventNames(userId, rolesArray);

      res.status(200).json(events);
    } catch (err) {
      next(err);
    }
  }

  async addEvent(req, res, next) {
    try {
      console.log(req.files);
      const {
        managerId,
        name,
        description,
        typeId,
        dateFrom,
        dateTo,
        publishOn,
        applicationDeadline,
        addressId,
        subsidiaryId,
        maxPeopleAllowed,
      } = req.body;

      if (!name || !managerId) {
        throw new AppError("ManagedId and name are required", 400);
      }

      const bannerPhoto = req.files.bannerPhoto
        ? req.files.bannerPhoto[0]
        : null;
      const otherPhotos = req.files.otherPhotos || [];

      const newEvent = await eventService.addEvent({
        managerId,
        name,
        description,
        typeId,
        dateFrom,
        dateTo,
        publishOn,
        applicationDeadline,
        addressId,
        subsidiaryId,
        maxPeopleAllowed,
        bannerPhoto,
        otherPhotos,
      });

      res.status(201).json(newEvent);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async editEvent(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        typeId,
        dateFrom,
        dateTo,
        publishOn,
        applicationDeadline,
        addressId,
        subsidiaryId,
        maxPeopleAllowed,
      } = req.body;

      const bannerPhoto = req.files.bannerPhoto
        ? req.files.bannerPhoto[0]
        : null;
      const otherPhotos = req.files.otherPhotos || [];

      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      if (!name || name == "") {
        throw new AppError("Name is required", 400);
      }

      const updatedEvent = await eventService.editEvent(id, {
        name,
        typeId,
        description,
        dateFrom,
        dateTo,
        publishOn,
        applicationDeadline,
        addressId,
        subsidiaryId,
        maxPeopleAllowed,
        bannerPhoto,
        otherPhotos,
      });

      res.status(200).json(updatedEvent);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async deleteEvents(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError("A valid array of event IDs is required", 400);
      }

      const result = await eventService.deleteEvents(ids);
      res
        .status(200)
        .json({ message: `Successfully deleted ${result} events` });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = new EventController();
