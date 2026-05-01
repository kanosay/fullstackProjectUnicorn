
function typeOf(val) {
  if (Array.isArray(val)) return "array";
  if (val === null) return "null";
  return typeof val;
}

function validate(dtoIn, dtoInType) {
  const result = {
    unsupportedKeyList: [],
    invalidTypeKeyMap: {},
    invalidValueKeyMap: {},
    missingKeyMap: {},
  };

  if (!dtoIn || typeof dtoIn !== "object") {
    result.invalidValueKeyMap.__root__ = "dtoIn must be an object";
    return result;
  }

  const allowed = new Set(Object.keys(dtoInType));
  for (const k of Object.keys(dtoIn)) {
    if (!allowed.has(k)) result.unsupportedKeyList.push(k);
  }

  for (const [key, spec] of Object.entries(dtoInType)) {
    const hasKey = Object.prototype.hasOwnProperty.call(dtoIn, key);
    const value = dtoIn[key];

    if (!hasKey || value === undefined) {
      if (spec.required && spec.default === undefined) {
        result.missingKeyMap[key] = "required";
      }
      continue;
    }

    const actual = typeOf(value);
    if (spec.type && actual !== spec.type) {
      result.invalidTypeKeyMap[key] = spec.type;
      continue;
    }

    if (spec.type === "string") {
      if (spec.min !== undefined && value.length < spec.min) {
        result.invalidValueKeyMap[key] = `minLength=${spec.min}`;
      } else if (spec.max !== undefined && value.length > spec.max) {
        result.invalidValueKeyMap[key] = `maxLength=${spec.max}`;
      } else if (spec.pattern && !spec.pattern.test(value)) {
        result.invalidValueKeyMap[key] = `pattern=${spec.pattern}`;
      }
    } else if (spec.type === "number") {
      if (spec.min !== undefined && value < spec.min) {
        result.invalidValueKeyMap[key] = `min=${spec.min}`;
      } else if (spec.max !== undefined && value > spec.max) {
        result.invalidValueKeyMap[key] = `max=${spec.max}`;
      }
    }
  }

  return result;
}

function applyDefaults(dtoIn, dtoInType) {
  const out = { ...dtoIn };
  for (const [key, spec] of Object.entries(dtoInType)) {
    if (out[key] === undefined && spec.default !== undefined) {
      out[key] = typeof spec.default === "function" ? spec.default() : spec.default;
    }
  }
  return out;
}


function buildErrorList(validationResult, host = "", command = "") {
  const errors = [];
  const prefix = host && command ? `${host}/${command}/` : "";

  if (validationResult.unsupportedKeyList.length > 0) {
    errors.push({
      type: "warning",
      code: `${prefix}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      params: { unsupportedKeyList: validationResult.unsupportedKeyList },
    });
  }

  const hasInvalid =
    Object.keys(validationResult.invalidTypeKeyMap).length > 0 ||
    Object.keys(validationResult.invalidValueKeyMap).length > 0 ||
    Object.keys(validationResult.missingKeyMap).length > 0;

  if (hasInvalid) {
    errors.push({
      type: "error",
      code: `${prefix}invalidDtoIn`,
      message: "DtoIn is not valid.",
      params: {
        invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
        invalidValueKeyMap: validationResult.invalidValueKeyMap,
        missingKeyMap: validationResult.missingKeyMap,
      },
    });
  }

  return errors;
}

function hasFatalError(errorList) {
  return errorList.some((e) => e.type === "error");
}

module.exports = { validate, applyDefaults, buildErrorList, hasFatalError };
