const {User} = require('../database/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../helpers/error.helper')
const ResponseFormat = require('../helpers/response.helper')
const { registerSchema } = require('../validation/schemas/register.schema')
const validate = require('../middleware/validation')
const { loginSchema } = require('../validation/schemas/login.schema')

class UserController{
    async register(req,res,next){
        try {
            
            const {email, username, password, address, phone} = req.body
    
            // Validate req. body
            await validate(registerSchema,req.body)

            //Check email exist
            const isEmailExist = await User.findOne({
                where:{
                    email
                },
                attributes: ['id']
            })
            
            if(isEmailExist){
                throw new ErrorResponse(400,"Email already exist")
            }
    
            //Hash password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)
    
            //Create User
            const user = await User.create({
                email,
                username,
                password:hashPassword,
                address,
                phone
            })

            //generate token
            const jwtPayload = {
                user_id : user.id,
            }
            
            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn:"30d"})


            return new ResponseFormat(res,201,{
                token
            })

        } catch (error) {
            next(error)
        }
    }

    async login(req,res,next){
        try {
            const {email, password} = req.body

            //Validate req.body
            await validate(loginSchema, req.body)

            //Check isEmailExist
            const user = await User.findOne({
                where: {
                    email
                },
            })

            if(!user){
                throw new ErrorResponse(401,"Invalid Credential")
            }

            //Compare Password
            const compare = await bcrypt.compare(password, user.password)
            if(!compare){
                throw new ErrorResponse(401,"Invalid Credential")
            }

            //token
            const jwtPayload = {
                user_id : user.id,
            }
            
            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn:"30d"})

            //login
            return new ResponseFormat(res, 200, {token})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {UserController}