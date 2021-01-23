const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    displayName:{
        type:String
    }
})

module.exports = User = mongoose.model('user',userSchema) //exports with name 'User' 
//and mongoose.model('collection name of database',schemaName)