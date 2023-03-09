const { User } = require("../database/models");
const ErrorResponse = require("../helpers/error.helper");
const ResponseFormat = require("../helpers/response.helper");
const {
  registerSchema,
} = require("../validation/schemas/register.schema");
const validate = require("../middleware/validation");
const {
  loginSchema,
} = require("../validation/schemas/login.schema");
const Hash = require("../modules/hash");
const ModuleJwt = require("../modules/jwt");

class UserController {
  async register(req, res, next) {
    try {
      const {
        email,
        username,
        password,
        role,
        address,
        phone,
      } = req.body;

      // Validate req. body
      await validate(registerSchema, req.body);

      //Check email exist
      const isEmailExist = await User.findOne({
        where: {
          email,
        },
        attributes: ["id"],
      });

      if (isEmailExist) {
        throw new ErrorResponse(400, "Email already exist");
      }

      const isUsernameExist = await User.findOne({
        where: {
          username,
        },
        attributes: ["id"],
      });

      if (isUsernameExist) {
        throw new ErrorResponse(
          400,
          "Username already exist",
        );
      }

      //Hash password
      const hashedPassword = await Hash.hashing(password);

      //Create User
      await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        address,
        phone,
      });

      return new ResponseFormat(res, 201, {
        message: "User created",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      //Validate req.body
      await validate(loginSchema, req.body);

      //Check isEmailExist
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ErrorResponse(401, "Invalid Credential");
      }

      //Compare Password
      const isMatched = await Hash.compare(
        password,
        user.password,
      );
      if (!isMatched) {
        throw new ErrorResponse(401, "Invalid Credential");
      }

      //token
      const accessToken = ModuleJwt.signToken(user.id);
      const refreshToken = ModuleJwt.signRefreshToken(
        user.id,
      );

      user.refresh_token = refreshToken;
      await user.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      //login
      return new ResponseFormat(res, 200, { accessToken });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies?.jwt;
      console.log(refreshToken);

      if (!refreshToken) {
        throw new ErrorResponse(401, "Unauthorized");
      }

      // find the user
      const user = await User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });

      // detected reuse or hack
      if (!user) {
        throw new ErrorResponse(403, "Forbidden");
      }

      const decodedRefreshToken =
        ModuleJwt.verifyRefreshToken(refreshToken);

      // detected reuse or hack
      if (decodedRefreshToken.id !== user.id) {
        throw new ErrorResponse(403, "Forbidden");
      }

      // issue new acces token
      const newAccessToken = ModuleJwt.signToken(
        decodedRefreshToken.id,
      );

      return new ResponseFormat(res, 200, {
        accessToken: newAccessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async currentUser(req, res, next) {
    try {
      const userId = res.locals.userId;
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      // user not found
      if (!user) {
        throw new ErrorResponse(404, "Not found");
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      };

      return new ResponseFormat(res, 200, {
        user: userData,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req?.cookies?.jwt;

      if (!refreshToken) {
        return res
          .status(200)
          .json({ message: "User logged out" });
      }

      const user = await User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });

      // detected hack
      if (!user) {
        res.clearCookie("jwt");
        return new ResponseFormat(res, 200, {
          message: "User logged out",
        });
      }

      // delete token in jwt
      res.clearCookie("jwt");

      // delete refresh token in db
      user.refresh_token = null;
      user.save();

      return new ResponseFormat(res, 200, {
        message: "User logged out",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { UserController };
