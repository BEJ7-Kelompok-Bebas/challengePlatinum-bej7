const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

class ModuleJwt {
  static signToken = (id) => {
    const secretKey = process.env.JWT_SECRET;

    const accessToken = jwt.sign(
      {
        id,
      },
      secretKey,
      {
        expiresIn: "600s",
      },
    );
    return accessToken;
  };

  static signRefreshToken = (id) => {
    const secretKey = process.env.JWT_REFRESH_KEY;

    const refreshToken = jwt.sign(
      {
        id,
      },
      secretKey,
      {
        expiresIn: "30d",
      },
    );
    return refreshToken;
  };

  static verifyToken = (token) => {
    const secretKey = process.env.JWT_SECRET;

    let data;
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        data = null;
      } else {
        data = decoded;
      }
    });
    return data;
  };

  static verifyRefreshToken = (token) => {
    const secretKey = process.env.JWT_REFRESH_KEY;

    let data;
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        data = null;
      } else {
        data = decoded;
      }
    });
    return data;
  };
}

module.exports = ModuleJwt;
