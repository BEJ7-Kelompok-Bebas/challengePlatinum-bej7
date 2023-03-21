const { User } = require("../../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../../helpers/error.helper");
const ResponseFormat = require("../../helpers/response.helper");
const { registerSchema } = require("../../validation/schemas/register.schema");
const validate = require("../../middleware/validation");
const { loginSchema } = require("../../validation/schemas/login.schema");
require("dotenv").config({ path: ".env" });
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");

class UserEmailController {
  async register(req, res, next) {
    try {
      const { email, username, password, address, phone } = req.body;

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

      let randomToken = uuidv4();
      // for (let i = 0; i < 25; i++) {
      //   randomToken +=
      //     characters[Math.floor(Math.random() * characters.length)];
      // }

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
        verification_token: randomToken,
      });

      //generate token
      const jwtPayload = {
        user_id: user.id,
      };
      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      const message = "silahkan verivikasi email anda";

      // kirim email dengan parameter user register
      sendEmail(user);

      // return response
      return new ResponseFormat(res, 201, message, token);
    } catch (error) {
      next(error);
    }
  }

  async confirmRegister(req, res, next) {
    const { token } = req.params;
    try {
      // Mencari user berdasarkan email, yg telah diberi verif code.
      const users = await User.findOne({
        where: {
          verification_token: token,
        },
      });
      if (!users) {
        return res.status(404).json({
          message: "Invalid token",
        });
      }

      if (users) {
        await User.update(
          { verification_token: null, register_status: "Validated" },
          {
            where: {
              verification_token: token,
            },
          }
        );
      }
      // users.is_verified = true;
      // users.verification_token = null;
      // await users.save();
      return res.status(200).json({
        message: "Email berhasil terverifikasi. Register Berhasil ",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  // async login(req,res,next){
  //     try {
  //         const {email, password} = req.body

  //         //Validate req.body
  //         await validate(loginSchema, req.body)

  //         //Check isEmailExist
  //         const user = await User.findOne({
  //             where: {
  //                 email
  //             },
  //         })
  //         if(!user){
  //             throw new ErrorResponse(401,"Invalid Credential")
  //         }
  //         //Compare Password
  //         const compare = await bcrypt.compare(password, user.password)
  //         if(!compare){
  //             throw new ErrorResponse(401,"Invalid Credential")
  //         }
  //         //token
  //         const jwtPayload = {
  //             user_id : user.id,
  //         }
  //         const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn:"30d"})
  //         //login
  //         return new ResponseFormat(res, 200, {token})
  //     } catch (error) {
  //         next(error)
  //     }
  // }
}

module.exports = { UserEmailController };

//   const { email, username, password, address, phone } = req.body;

//   // Validate req. body
//   await validate(registerSchema, req.body);

//   //Check email exist
//   const isEmailExist = await User.findOne({
//     where: {
//       email,
//     },
//     attributes: ["id"],
//   });

//   if (isEmailExist) {
//     throw new ErrorResponse(400, "Email already exist");
//   }

//   //Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);

//   //Create User
//   const user = await User.create({
//     email,
//     username,
//     password: hashPassword,
//     address,
//     phone,
//   });
//   //generate token
//   const jwtPayload = {
//     user_id: user.id,
//   };
//   const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
//   return new ResponseFormat(res, 201, {
//     token,
//   });
