

const createDtoInType = {
  tmdbId: { type: "number", required: true, min: 1 },
  title: { type: "string", required: true, min: 1, max: 300 },
  overview: { type: "string", default: "", max: 5000 },
  posterPath: { type: "string", default: "" },
  backdropPath: { type: "string", default: "" },
  releaseDate: { type: "string", default: "" },
  voteAverage: { type: "number", default: 0, min: 0, max: 10 },
  genreIds: { type: "array", default: [] },
};

const getDtoInType = {
  id: { type: "string" },
  tmdbId: { type: "number" },
};

const listDtoInType = {
  pageIndex: { type: "number", default: 0, min: 0 },
  pageSize: { type: "number", default: 50, min: 1, max: 500 },
};

const updateDtoInType = {
  id: { type: "string", required: true },
  title: { type: "string", max: 300 },
  overview: { type: "string", max: 5000 },
  posterPath: { type: "string" },
  backdropPath: { type: "string" },
  releaseDate: { type: "string" },
  voteAverage: { type: "number", min: 0, max: 10 },
  genreIds: { type: "array" },
};

const deleteDtoInType = {
  id: { type: "string", required: true },
};

module.exports = {
  createDtoInType,
  getDtoInType,
  listDtoInType,
  updateDtoInType,
  deleteDtoInType,
};
