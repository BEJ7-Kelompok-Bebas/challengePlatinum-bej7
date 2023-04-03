const dataOneItem = {
  id: 1,
  user_id: 1,
  name: "item1",
  price: 10000,
  stock: 100,
  User: {
    id: 1,
    username: "admin",
    email: "admin@gmail.com",
  },
};

const findOneItem = (params) => {
  return Promise.resolve(dataOneItem);
};

const dataAllItem = [
  {
    id: 5,
    user_id: 1,
    name: "item5",
    price: 5000,
    stock: 100,
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  },
  {
    id: 1,
    user_id: 1,
    name: "item1",
    price: 5000,
    stock: 200,
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  },
  {
    id: 2,
    user_id: 1,
    name: "item2",
    price: 15000,
    stock: 100,
  },
  {
    id: 4,
    user_id: 1,
    name: "item4",
    price: 20000,
    stock: 60,
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  },
  {
    id: 3,
    user_id: 1,
    name: "item3",
    price: 25000,
    stock: 50,
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  },
];

const findAllItem = (params) => {
  return Promise.resolve(dataAllItem);
};
module.exports = {
  findOneItem,
  findAllItem,
  dataAllItem,
  dataOneItem,
};
