const findOneItem = (params) => {
  return Promise.resolve({
    id: 1,
    user_id: 1,
    name: "item1",
    price: 10000,
    stock: 100,
  });
};

const findAllItem = (params) => {
  return Promise.resolve([
    {
      id: 5,
      user_id: 1,
      name: "item5",
      price: 5000,
      stock: 100,
    },
    {
      id: 1,
      user_id: 1,
      name: "item1",
      price: 5000,
      stock: 200,
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
    },
    {
      id: 3,
      user_id: 1,
      name: "item3",
      price: 25000,
      stock: 50,
    },
  ]);
};
module.exports = { findOneItem };
