const { User } = require("../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helpers/error.helper");
const ResponseFormat = require("../helpers/response.helper");
const { registerSchema } = require("../validation/schemas/register.schema");
const validate = require("../middleware/validation");
const { loginSchema } = require("../validation/schemas/login.schema");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });

class UserController {
  async register(req, res, next) {
    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    try {
      let { email, username, password, address, phone } = req.body;

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

      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      //Create User
      const user = await User.create({
        email,
        username,
        password: hashPassword,
        address,
        phone,
      });

      //generate token
      const jwtPayload = {
        user_id: user.id,
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      //send verification mail to user
      let option = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: "Verify email!",
        text: "email send success!",
        html: `<h1>Welcome ${username} to bingle shop, thanks for registering on our website!</h1>
                <h3>Please verify your mail to continue...</h3>
                <a href="http://localhost:3000/login">Verify Your Email</a>`,
      };

      //sending email
      transporter.sendMail(await option, (err, info) => {
        if (err) {
          console.log("error");
        } else {
          console.log("Verification email is sent to your inbox!");
        }
      });

      return new ResponseFormat(res, 201, {
        token,
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
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        throw new ErrorResponse(401, "Invalid Credential");
      }

      //token
      const jwtPayload = {
        user_id: user.id,
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      //login
      return new ResponseFormat(res, 200, { token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
