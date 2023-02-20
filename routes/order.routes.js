const express = require('express')
const router = express.Router()
const {OrderController} = require('../controller/order.controller')
const authUser = require('../middleware/authentication')

const orderController = new OrderController

router.get('/', authUser, orderController.getOrders)

router.patch('/:id/update', authUser, orderController.updateOrder)

router.post('/', authUser, orderController.createOrder)

router.delete('/:id', authUser, orderController.deleteOrder)




module.exports = router