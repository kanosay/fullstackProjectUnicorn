const JsonDao = require("../dao/jsonDao");
const schema = require("../schemas/favoriteSchema");
const {
  validate,
  applyDefaults,
  buildErrorList,
  hasFatalError,
} = require("../schemas/validator");

const dao = new JsonDao("favorite");
const HOST = "favorite";

function runCommand(commandName, dtoInType, dtoIn, businessLogic) {
  const validationResult = validate(dtoIn, dtoInType);
  const errorList = buildErrorList(validationResult, HOST, commandName);

  if (hasFatalError(errorList)) return { status: 400, body: { errorList } };

  const filledDtoIn = applyDefaults(dtoIn, dtoInType);
  const dtoOut = businessLogic(filledDtoIn) || {};
  if (errorList.length > 0) dtoOut.errorList = errorList;
  return { status: 200, body: dtoOut };
}

exports.create = (req, res) => {
  const result = runCommand("create", schema.createDtoInType, req.body || {}, (data) => {
    const existing = dao.get({ userId: data.userId, tmdbId: data.tmdbId });
    if (existing) return existing;
    return dao.create(data);
  });
  res.status(result.status).json(result.body);
};

exports.list = (req, res) => {
  const dtoIn = {};
  if (req.query.userId) dtoIn.userId = String(req.query.userId);
  if (req.query.pageIndex !== undefined) dtoIn.pageIndex = Number(req.query.pageIndex);
  if (req.query.pageSize !== undefined) dtoIn.pageSize = Number(req.query.pageSize);

  const result = runCommand("list", schema.listDtoInType, dtoIn, (data) =>
    dao.list({
      pageIndex: data.pageIndex,
      pageSize: data.pageSize,
      filter: { userId: data.userId },
    })
  );
  res.status(result.status).json(result.body);
};

exports.remove = (req, res) => {
  const result = runCommand("delete", schema.deleteDtoInType, req.body || {}, (data) => {
    dao.delete(data.id);
    return { ok: true };
  });
  res.status(result.status).json(result.body);
};
