const findOneBuyer = (params) => {
  return Promise.resolve({
    user_id: 1,
    email: "test1@gmail.com",
    username: "test1",
    role: "user",
  });
};

const findOneAdmin = (params) => {
  return Promise.resolve({
    user_id: 2,
    email: "test2@gmail.com",
    username: "test2",
    role: "admin",
  });
};

const findOneNull = (params) => {
  return Promise.resolve(null);
};

module.exports = {
  findOneBuyer,
  findOneAdmin,
  findOneNull,
};
