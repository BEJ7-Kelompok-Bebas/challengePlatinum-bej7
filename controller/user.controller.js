const {
  registerSchema,
  loginSchema,
} = require("../validation/schemas");
const { v4: uuidv4 } = require("uuid");

class UserController {
  constructor(
    User,
    Hash,
    ModuleJwt,
    validate,
    ResponseFormat,
    ErrorResponse,
    sendEmail,
  ) {
    this.User = User;
    this.Hash = Hash;
    this.ModuleJwt = ModuleJwt;
    this.validate = validate;
    this.ResponseFormat = ResponseFormat;
    this.ErrorResponse = ErrorResponse;
    this.sendEmail = sendEmail;
  }
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
      await this.validate(registerSchema, req.body);

      //Check email exist
      const isEmailExist = await this.User.findOne({
        where: {
          email,
        },
        attributes: ["id"],
      });

      if (isEmailExist) {
        throw new this.ErrorResponse(
          400,
          "Email already exist",
        );
      }

      const isUsernameExist = await this.User.findOne({
        where: {
          username,
        },
        attributes: ["id"],
      });

      if (isUsernameExist) {
        throw new this.ErrorResponse(
          400,
          "Username already exist",
        );
      }
      // create random token
      let randomToken = uuidv4();
      //Hash password
      const hashedPassword = await this.Hash.hashing(
        password,
      );

      //Create User
      const user = await this.User.create({
        username,
        email,
        password: hashedPassword,
        role,
        address,
        phone,
        verification_token: randomToken,
      });
      // kirim email dengan parameter user register
      this.sendEmail(user);

      return res
        .status(200)
        .json(new this.ResponseFormat(201, "User created"));
    } catch (error) {
      return next(error);
    }
  }

  // confirm register
  async confirmRegister(req, res, next) {
    const { token } = req.params;
    try {
      // Mencari user berdasarkan email, yg telah diberi verif code.
      const users = await this.User.findOne({
        where: {
          verification_token: token,
        },
      });

      if (!users) {
        throw new this.ErrorResponse(404, {
          message: "Invalid Token",
        });
      }

      if (users) {
        await this.User.update(
          {
            verification_token: null,
            register_status: "Validated",
          },
          {
            where: {
              verification_token: token,
            },
          },
        );
      }
      // users.is_verified = true;
      // users.verification_token = null;
      // await users.save();
      return new this.ResponseFormat(res, 200, {
        message:
          "Email berhasil terverifikasi. Register Berhasil ",
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      //Validate req.body
      await this.validate(loginSchema, req.body);

      //Check isEmailExist
      const user = await this.User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new this.ErrorResponse(
          401,
          "Invalid Credential",
        );
      }

      //Compare Password
      const isMatched = await this.Hash.compare(
        password,
        user.password,
      );

      if (!isMatched) {
        throw new this.ErrorResponse(
          401,
          "Invalid Credential",
        );
      }

      //token
      const accessToken = this.ModuleJwt.signToken(user.id);
      const refreshToken = this.ModuleJwt.signRefreshToken(
        user.id,
      );

      user.refresh_token = refreshToken;
      await user.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      //login
      return res.status(200).json(
        new this.ResponseFormat(200, {
          accessToken,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies?.jwt;
      console.log(refreshToken);

      if (!refreshToken) {
        throw new this.ErrorResponse(401, "Unauthorized");
      }

      // find the user
      const user = await this.User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });

      // detected reuse or hack
      if (!user) {
        throw new this.ErrorResponse(403, "Forbidden");
      }

      const decodedRefreshToken =
        this.ModuleJwt.verifyRefreshToken(refreshToken);

      // detected reuse or hack
      if (decodedRefreshToken.id !== user.id) {
        console.log("error ini");
        throw new this.ErrorResponse(403, "Forbidden");
      }

      // issue new acces token
      const newAccessToken = this.ModuleJwt.signToken(
        decodedRefreshToken.id,
      );

      return res.status(200).json(
        new this.ResponseFormat(200, {
          accessToken: newAccessToken,
        }),
      );
    } catch (err) {
      return next(err);
    }
  }

  async currentUser(req, res, next) {
    try {
      const userId = res.locals.userId;
      const user = await this.User.findOne({
        where: {
          id: userId,
        },
        attributes: [
          "id",
          "username",
          "email",
          "role",
          "address",
        ],
      });

      // user not found
      if (!user) {
        throw new this.ErrorResponse(404, "Not found");
      }

      return res.status(200).json(
        new this.ResponseFormat(200, {
          user: user,
        }),
      );
    } catch (err) {
      return next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req?.cookies?.jwt;

      if (!refreshToken) {
        return res.status(200).json(
          new this.ResponseFormat(200, {
            message: "User logged out",
          }),
        );
      }

      const user = await this.User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });

      // detected hack
      if (!user) {
        res.clearCookie("jwt");
        throw new this.ErrorResponse(404, "User Not Found");
      }

      // delete token in jwt
      res.clearCookie("jwt");

      // delete refresh token in db
      user.refresh_token = null;
      user.save();

      return res.status(200).json(
        new this.ResponseFormat(200, {
          message: "User logged out",
        }),
      );
    } catch (err) {
      return next(err);
    }
  }
  register = this.register.bind(this);
  login = this.login.bind(this);
  refreshToken = this.refreshToken.bind(this);
  currentUser = this.currentUser.bind(this);
  logout = this.logout.bind(this);
}

module.exports = { UserController };
