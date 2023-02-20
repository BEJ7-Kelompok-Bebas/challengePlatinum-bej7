const express = require('express')
const router = express.Router()
const authUser = require('../middleware/authentication')
const {ItemController} = require('../controller/item.controller')

const itemController = new ItemController()



router.get('/',itemController.getItems)
router.post('/', authUser, itemController.createItem)
router.get('/:id', itemController.getItem)
router.patch('/:id', authUser, itemController.updateItem)
router.delete('/:id', authUser, itemController.deleteItem)



module.exports = router