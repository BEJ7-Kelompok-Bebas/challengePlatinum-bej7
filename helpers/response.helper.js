class ResponseFormat {
  constructor(res, status, message, data) {
    return res.status(status).json({
      status: "Success",
      message: message,
      data: data,
      error: {},
    });
  }
}

module.exports = ResponseFormat;
