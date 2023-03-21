const express = require('express')
const userRouter = require('./routes/user.routes')
const itemRouter = require('./routes/item.routes')
const orderRouter = require('./routes/order.routes')
const userEmailRouter = require('./domain.development-email.js/routes/email.router')
// const sendEmail = require('./domain.development-email.js/email2')

const app = express()


app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/item', itemRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/email', userEmailRouter)



app.use((err, req, res, next) => {
    console.log(err)

    const status = err.status || 500
    const error = err.error || err.message || 'Internal server error'

    return res.status(status).json({
        status: 'failed',
        data: {},
        error: error
    })
})

module.exports = app