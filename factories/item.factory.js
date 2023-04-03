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

const updateItem = (params) => {
  return Promise.resolve({
    id: 1,
    user_id: 1,
    name: "item1",
    price: 1000,
    stock: 10,
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  });
};

const sortedItem = [
  {
    id: 1,
    user_id: 1,
    name: "item1",
    price: 5000,
    stock: 200,
    created_at: new Date("2023-04-02"),
    updated_at: new Date("2023-04-02"),
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
    created_at: new Date("2023-04-03"),
    updated_at: new Date("2023-04-03"),
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
  },
];

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
    User: {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
    },
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

const findAllItemQuerySort = (params) => {
  return Promise.resolve(dataAllItem);
};

const findAllItemAutoSort = (params) => {
  return Promise.resolve(sortedItem);
};

const destroyItemTrue = (params) => {
  return Promise.resolve(1);
};

const destroyItemFalse = (params) => {
  return Promise.resolve(0);
};

module.exports = {
  findOneItem,
  findAllItemQuerySort,
  findAllItemAutoSort,
  updateItem,
  destroyItemFalse,
  destroyItemTrue,
  dataAllItem,
  dataOneItem,
  sortedItem,
};
