const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")
const {Item, User} = require("../database/models")
const ErrorResponse = require("../helpers/error.helper")
const ResponseFormat = require("../helpers/response.helper")
const validate = require("../middleware/validation")
const createItemSchema = require("../validation/schemas/createItem.schema")

class ItemController{
    async getItems(req,res,next){
        try {
            const {name, sort, numericFilters} = req.query
            let queryObject = {}
            
            if(name){
                queryObject.name = {[Op.like]: `%${name}%`}
            }

            // example ?numericFilters=price>1000,stock<20
            if(numericFilters){
                const operatorMap = {
                    '>': Op.gt,
                    '>=': Op.gte,
                    '=': Op.eq,
                    '<': Op.lt,
                    '<=': Op.lte,
                };
                const regEx = /\b(<|>|>=|=|<|<=)\b/g;
                numericFilters.split(',').forEach((item) => {
                    // qty>1
                    const filter = item.replace(regEx, match => `_${match}_`)
                    const filterSplit = filter.split('_')
                    queryObject[filterSplit[0]] = {[operatorMap[filterSplit[1]]]: filterSplit[2]}
                })
            }
            

            // example ?sort=price-A,stock-D
            let sortList = []
            if(sort){
                const map = {
                    "A": 'ASC',
                    "D": "DESC"
                }
                const filter = sort.split(',').forEach((data) => {
                    const [field, option] = data.split('-')
                    sortList.push([field,map[option]])
                })
            }else{
                sortList.push(['created_at','ASC'])
            }
            
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            
            let items = await Item.findAll({
                where:{
                    ...queryObject
                },
                order: sortList,
                limit: limit,
                offset: skip,
                attributes: ["id", "name", "price", "stock"],
                include: {
                    model: User,
                    attributes: ['id','username','email']
                }
            })

            if(items.length===0){
                throw new ErrorResponse(404,"No Items Found")
            }

            return new ResponseFormat(res,200,items)
        } catch (error) {
            next(error)
        }
    }

    async createItem(req,res,next){
        try {
            const {
                user:{user_id},
                body:{name, price, stock}
            } = req
            
            await validate(createItemSchema, req.body)

            const item = await Item.create({
                user_id,
                name,
                price,
                stock
            })

            return new ResponseFormat(res, 201, item)

        } catch (error) {
            next(error)
        }

    }

    async getItem(req,res,next){
        try {
            const {id: item_id} = req.params
            
            const item = await Item.findAll({
                where: {
                    id: parseInt(item_id)
                },
                include: [{
                    model: User,
                    attributes: ['id','username','email']
                }]
            })
            
            return new ResponseFormat(res, 200, item)
        } catch (error) {
            next(error)
        }
    }

    async updateItem(req,res,next){
        try {
            const {
                user:{user_id},
                params:{id:item_id},
                body:{price,stock}
            } = req

            const updatedAttr = {price:price, stock:stock} 

            let item = await Item.findOne({
                where:{
                    id: item_id,
                    user_id
                }
            })
            
            if(!item){
                throw new ErrorResponse(404,'Item Not Found')
            }
            
            await Item.update({...updatedAttr},{
                where:{
                    id: item_id,
                    user_id
                }
            })
            
            // item = await Item.findOne({
            //     where:{
            //         id: item_id,
            //         user_id
            //     }
            // })
            
            return new ResponseFormat(res, 200, item)

        } catch (error) {
            next(error)
        }
    }

    async deleteItem(req,res,next){
        try {
            const {
                user:{user_id},
                params:{id:item_id}
            } = req
            
            const item = await Item.destroy({
                where: {
                    id: item_id,
                    user_id
                }
            })

            if(!item){
                throw new ErrorResponse(404,'Item Not Found')
            }

            return new ResponseFormat(res,200,'Item deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {ItemController}