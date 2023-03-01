const bcrypt = require('bcrypt');

class Hash {
  static hashing = (text) => {
    return bcrypt.hash(text, 10);
  };

  static compare = async (text, encryptedText) => {
    const result = await bcrypt.compare(
      text,
      encryptedText,
    );
    return result;
  };
}

module.exports = Hash;
