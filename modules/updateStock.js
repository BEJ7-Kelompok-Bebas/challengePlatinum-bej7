const updateStock = async (orders, Item, args) => {
  let stocks = [];
  let item_ids = [];
  const orderItem = orders.OrderItems;
  orderItem.forEach((data) => {
    if (args) {
      stocks.push(data.Item.stock + data.qty);
    } else {
      stocks.push(data.Item.stock - data.qty);
    }
    item_ids.push(data.item_id);
  });

  for (let i = 0; i < stocks.length - 1; i++) {
    await Item.update(
      { stock: stocks[i] },
      {
        where: {
          id: item_ids[i],
        },
      },
    );
  }
};

module.exports = updateStock;
