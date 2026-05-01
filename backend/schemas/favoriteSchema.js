const createDtoInType = {
  userId: { type: "string", required: true, min: 1, max: 100 },
  tmdbId: { type: "number", required: true, min: 1 },
  title: { type: "string", required: true, min: 1, max: 300 },
  posterPath: { type: "string", default: "" },
};

const listDtoInType = {
  userId: { type: "string", required: true },
  pageIndex: { type: "number", default: 0, min: 0 },
  pageSize: { type: "number", default: 100, min: 1, max: 500 },
};

const deleteDtoInType = {
  id: { type: "string", required: true },
};

module.exports = { createDtoInType, listDtoInType, deleteDtoInType };
