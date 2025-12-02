import {responseSuccess,responseError,} from "../common/helper/function.helper.js";
import { filmsService } from "../services/films.services.js";

export const filmsController = {
  async findSeasons(req, res, next) {
    try {
      const filmId = Number(req.params.id);
      if (!filmId) {
        const response = responseError("Invalid film id", 400);
        return res.status(response.statusCode).json(response);
      }

      const film = await filmsService.findById(filmId);
      if (!film) {
        const response = responseError("Film not found", 404);
        return res.status(response.statusCode).json(response);
      }

      const key = film.original_name ?? film.title;
      if (!key) {
        const response = responseSuccess([], "No grouping key");
        return res.status(response.statusCode).json(response);
      }

      const seasons = await filmsService.findByFilter({
        filter: { original_name: key },
        orderBy: { season: "asc" },
      });

      const exists = req.params.season
        ? seasons.some((s) => Number(s.season) === Number(req.params.season))
        : true;

      const response = responseSuccess(
        seasons,
        exists ? "OK" : `Season #${req.params.season} not found`
      );
      return res.status(response.statusCode).json(response);
    } catch (err) {
      const response = responseError(err.message, 500, err.stack);
      return res.status(response.statusCode).json(response);
    }
  },
  // CRUD
  create: async function (req, res, next) {
    const result = await filmsService.create(req);
    const response = responseSuccess(result, `Create films successfully`);
    res.status(response.statusCode).json(response);
  },

  findAll: async function (req, res, next) {
    const result = await filmsService.findAll(req);
    const response = responseSuccess(result, `Get all films successfully`);
    res.status(response.statusCode).json(response);
  },

  findOne: async function (req, res, next) {
    const result = await filmsService.findOne(req);
    const response = responseSuccess(
      result,
      `Get films #${req.params.id} successfully`
    );
    res.status(response.statusCode).json(response);
  },

  update: async function (req, res, next) {
    const result = await filmsService.update(req);
    const response = responseSuccess(
      result,
      `Update films #${req.params.id} successfully`
    );
    res.status(response.statusCode).json(response);
  },

  remove: async function (req, res, next) {
    const result = await filmsService.remove(req);
    const response = responseSuccess(
      result,
      `Remove films #${req.params.id} successfully`
    );
    res.status(response.statusCode).json(response);
  },
};
