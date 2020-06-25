const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        default : 0,
        validate : (value) => {
            if(value < 0){
                throw new Error('Age must be positive')
            }
        }
    },
    email : {
        type : String,
        unique : true,
        required : true,
        validate : (value) => {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        },
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 6,
        validate : (value) => {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain the term *password*')
            }
        }
    },
    tokens : [
       {
           token : {
               type : String,
               required : true
           }
       }
    ],
    avatar : {
        type : Buffer
    }
}, { timestamps : true })
//setup virtual attributes for relationships among entities
userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

//static methos accessible on models
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//methods accessible on instances
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//Hashing the password before saving
userSchema.pre('save', async function (next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete tasks when a user is deleted

userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner : user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User