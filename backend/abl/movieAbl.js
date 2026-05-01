const JsonDao = require("../dao/jsonDao");
const schema = require("../schemas/movieSchema");
const {
  validate,
  applyDefaults,
  buildErrorList,
  hasFatalError,
} = require("../schemas/validator");

const dao = new JsonDao("movie");
const HOST = "movie";

function runCommand(commandName, dtoInType, dtoIn, businessLogic) {
  const validationResult = validate(dtoIn, dtoInType);
  const errorList = buildErrorList(validationResult, HOST, commandName);

  if (hasFatalError(errorList)) {
    return { status: 400, body: { errorList } };
  }

  const filledDtoIn = applyDefaults(dtoIn, dtoInType);

  const dtoOut = businessLogic(filledDtoIn) || {};

  if (errorList.length > 0) dtoOut.errorList = errorList; // warnings only
  return { status: 200, body: dtoOut };
}

exports.create = (req, res) => {
  const result = runCommand("create", schema.createDtoInType, req.body || {}, (data) =>
    dao.create(data)
  );
  res.status(result.status).json(result.body);
};

exports.get = (req, res) => {
  const dtoIn = {};
  if (req.query.id) dtoIn.id = String(req.query.id);
  if (req.query.tmdbId) dtoIn.tmdbId = Number(req.query.tmdbId);

  const result = runCommand("get", schema.getDtoInType, dtoIn, (data) => {
    const item = dao.get(data);
    return { item };
  });
  res.status(result.status).json(result.body);
};

exports.list = (req, res) => {
  const dtoIn = {};
  if (req.query.pageIndex !== undefined) dtoIn.pageIndex = Number(req.query.pageIndex);
  if (req.query.pageSize !== undefined) dtoIn.pageSize = Number(req.query.pageSize);

  const result = runCommand("list", schema.listDtoInType, dtoIn, (data) =>
    dao.list({ pageIndex: data.pageIndex, pageSize: data.pageSize })
  );
  res.status(result.status).json(result.body);
};

exports.update = (req, res) => {
  const result = runCommand("update", schema.updateDtoInType, req.body || {}, (data) => {
    const updated = dao.update(data);
    return { item: updated };
  });
  res.status(result.status).json(result.body);
};

exports.remove = (req, res) => {
  const result = runCommand("delete", schema.deleteDtoInType, req.body || {}, (data) => {
    dao.delete(data.id);
    return { ok: true };
  });
  res.status(result.status).json(result.body);
};
