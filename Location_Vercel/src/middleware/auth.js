const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const white_lists = ["/", "/getall"];
  if (white_lists.find((item) => "/location" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      // verify
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        }
        console.log("check token: ", decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Bạn chưa xác thực",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa xác thực",
      });
    }
  }
};

module.exports = auth;
