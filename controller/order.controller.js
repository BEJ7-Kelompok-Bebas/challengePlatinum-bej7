const { QueryTypes } = require('sequelize')
const {OrderItem, Order, Item} = require('../database/models')
const ErrorResponse = require('../helpers/error.helper')
const ResponseFormat = require('../helpers/response.helper')


class OrderController{
    constructor(){
        this.updateStock = async(order, args)=>{
            console.log(order);
            let stocks = []
            let item_ids = []
            const orderItem = order.OrderItems
            orderItem.forEach(data => {
                if(args){
                    stocks.push(data.Item.stock + data.qty)
                }else{
                    stocks.push(data.Item.stock - data.qty)
                }
                item_ids.push(data.item_id)
            })
    
            for(let i = 0; i < stocks.length-1;i++){
                await Item.update({stock:stocks[i]},{
                    where:{
                        id:item_ids[i]
                    }
                })
            }
        }

        this.DOIT = function(order,args){
            return this.updateStock(order,args).bind(this)
        }
        
    }
    
    async getOrders(req,res,next){
        try {
            const {
                user:{user_id},
                query:{status,order_id}
            } = req

            let queryObject= {user_id:user_id}
            if(status){
                queryObject.status = status
            }

            if(order_id){
                queryObject.order_id = order_id
            }

            const order = await Order.findAll({
                where: {
                    ...queryObject,
                },
                attributes: ['id','total','status'],
                include: {
                    model: OrderItem,
                    attributes: ['id','item_id','qty','price'],
                    include: {
                        model: Item,
                        attributes: ['name']
                    }
                }
            })
            
            if (!order){
                throw new ErrorResponse(400, 'There is no orders')
            }
    
            return new ResponseFormat(res,200,order)
        } catch (error) {
            next(error)
        }

    }


    /** create order json example
     * {
        "data":[{
            "order_id":0,
            "item_id":2,
            "qty":5,
            "price":8000
        },{
            "order_id":0,
            "item_id":7,
            "qty":3,
            "price":23000
        }]
        }
      */
    async createOrder(req,res,next){
        try {
            const { user:{user_id} } = req
            
            const orderItems = req.body.data

            let total = 0
            
            let order = await Order.create({
                user_id:user_id,
                total: total,
            })
            
            const order_id = order.id
            
            orderItems.forEach(element => {
                element.order_id = order_id,
                element.user_id = user_id
                total += (element.qty * element.price)
            })
            
            const orderItem = await OrderItem.bulkCreate(orderItems)

            await Order.update({total},{
                where:{
                    id:order_id,
                    user_id:user_id
                }
            })

            const getOrder = await Order.findOne({
                where: {
                    user_id,
                    id:order_id
                },
                include: {
                    model: OrderItem,
                    attributes: ['id','item_id','qty','price'],
                    include:{
                        model: Item,
                        attributes: ['name','stock']
                    }
                }
            })

            if(getOrder){
                //this.updateStock(getOrder,false)
                let stocks = []
                let item_ids = []
                const orderItem = getOrder.OrderItems
                orderItem.forEach(data => {
                    stocks.push(data.Item.stock - data.qty)
                    item_ids.push(data.item_id)
                })

                for(let i = 0; i < stocks.length-1;i++){
                    await Item.update({stock:stocks[i]},{
                        where:{
                            id:item_ids[i]
                        }
                    })
                }
            }
            

            return new ResponseFormat(res,200,getOrder)
    
        } catch (error) {
            next(error)
        }
    }

    async updateOrder(req,res,next){
        try {
            const {
                user:{user_id},
                params:{id:order_id},
                body:{status}
            } = req

            let order = await Order.findOne({
                where: {
                    id:order_id,
                    user_id,
                    status:'Pending'
                },
                include: [{
                    model: OrderItem,
                    attributes: ['id','item_id','qty','price'],
                    include:{
                        model: Item,
                        attributes: ['name','stock']
                    }
                }]
            })

            if(!order){
                throw new ErrorResponse(404,`Order Not Found`)
            }

            if(status === 'Cancelled'){
                // this.updateStock(order,true)
                let stocks = []
                let item_ids = []
                const orderItem = order.OrderItems
                orderItem.forEach(data => {
                    stocks.push(data.Item.stock + data.qty)
                    item_ids.push(data.item_id)
                })

                for(let i = 0; i < stocks.length-1;i++){
                    await Item.update({stock:stocks[i]},{
                        where:{
                            id:item_ids[i]
                        }
                    })
                }   
            }

            await order.update({status},{
                where: {
                    id:order_id,
                    user_id
                }
            })

            return new ResponseFormat(res,200,order)

        } catch (error) {
            next(error)
        }
    }

    async deleteOrder(req,res,next){
        try {
            const {
                user:{user_id},
                params:{id:order_id},
            } = req
            
            const order = await Order.findOne({
                where: {
                    id:order_id,
                    user_id,
                    status:'Pending'
                },
                include: [{
                    model: OrderItem,
                    attributes: ['id','item_id','qty','price'],
                    include:{
                        model: Item,
                        attributes: ['name','stock']
                    }
                }]
            })

            // update stock item
            if(order){
                // this.updateStock(order,true)
                let stocks = []
                let item_ids = []
                const orderItem = order.OrderItems
                orderItem.forEach(data => {
                    stocks.push(data.Item.stock + data.qty)
                    item_ids.push(data.item_id)
                })

                for(let i = 0; i < stocks.length-1;i++){
                    await Item.update({stock:stocks[i]},{
                        where:{
                            id:item_ids[i]
                        }
                    })
                }
            }
            const orderUpdate = await Order.update({status:'Cancelled'},{
                where:{
                    id:order_id,
                    user_id
                }
            })

            await OrderItem.destroy({
                where: {
                    user_id,
                    id:order_id
                }
            })
    
            await Order.destroy({
                where: {
                    user_id,
                    id:order_id
                }
            })
            
            return new ResponseFormat(res,200,'Order deleted')
        } catch (error) {
            next(error)
        }
        
    }

}


module.exports = {OrderController}