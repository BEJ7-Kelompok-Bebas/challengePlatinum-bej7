class ResponseFormat{
    constructor(res, status, data){
        return res.status(status).json({
            status: 'Success',
            data: data,
            error: {}
        })
    }
}

module.exports = ResponseFormat