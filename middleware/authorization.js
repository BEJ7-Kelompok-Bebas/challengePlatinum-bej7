const ErrorResponse = require("../helpers/error.helper");
const ModuleJwt = require("../modules/jwt");
const { User } = require("../database/models");

const UserRole = {
  ADMIN: "admin",
  USER: "user",
};

const authenticated = (req, res, next) => {
  try {
    const accessToken =
      req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new ErrorResponse(401, "Unauthorized");
    }

    const decodedAccessToken =
      ModuleJwt.verifyToken(accessToken);

    if (!decodedAccessToken) {
      throw new ErrorResponse(401, "Unauthorized");
    }

    res.locals.userId = decodedAccessToken?.id;

    next();
  } catch (error) {
    next(error);
  }
};

const adminRole = async (req, res, next) => {
  try {
    const userId = res.locals.userId;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (user.role !== UserRole.ADMIN) {
      throw new ErrorResponse(403, "Forbidden");
    }

    next();
  } catch (err) {
    next(err);
  }
};

const userRole = async (req, res, next) => {
  try {
    const userId = res.locals.userId;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (user.role !== UserRole.USER) {
      throw new ErrorResponse(403, "Forbidden");
    }

    next();
  } catch (err) {
    next(err);
  }
};

const ioAuthenticator = (socket) => {
  const accessToken =
    socket.handshake.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    throw new ErrorResponse(401, "Unauthorized");
  }

  const decodedAccessToken =
    ModuleJwt.verifyToken(accessToken);

  if (!decodedAccessToken) {
    console.log("test3");
    throw new ErrorResponse(401, "Unauthorized");
  }

  return decodedAccessToken;
};

module.exports = {
  authenticated,
  adminRole,
  userRole,
  UserRole,
  ioAuthenticator,
};
