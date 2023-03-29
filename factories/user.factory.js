const findOneBuyer = (params) => {
  return Promise.resolve({
    user_id: 1,
    email: "test1@gmail.com",
    username: "test1",
    role: "buyer",
  });
};

const findOneAdmin = (params) => {
  return Promise.resolve({
    user_id: 2,
    email: "test2@gmail.com",
    username: "test2",
    role: "seller",
  });
};

const findOneNull = (params) => {
  return Promise.resolve(null);
};

module.exports = {
  findOneBuyer,
  findOneSeller,
  findOneNull,
};
