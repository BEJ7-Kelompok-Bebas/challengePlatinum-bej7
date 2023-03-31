class ResponseFormat {
  constructor(code, data) {
    this.code = code;
    this.status = "Success";
    this.data = data;
  }
}

module.exports = ResponseFormat;
