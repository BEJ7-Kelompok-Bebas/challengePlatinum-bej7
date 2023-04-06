class ResponseFormat {
  constructor(code, data) {
    this.code = code;
    this.data = data;
    this.error = {};
  }
}

module.exports = ResponseFormat;
