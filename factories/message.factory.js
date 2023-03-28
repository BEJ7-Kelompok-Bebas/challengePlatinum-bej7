const findAllValue = (params) => {
  return Promise.resolve([
    {
      id: 1,
      text: "halo",
      user_id: 1,
    },
    {
      id: 2,
      text: "halo, ada yang bisa saya bantu?",
      user_id: 2,
    },
  ]);
};

const messageFindAllNull = (params) => {
  return Promise.resolve(null);
};
