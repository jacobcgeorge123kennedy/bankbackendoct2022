const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('MONGODB CONNECTED SUCCESSFULLY');
})
const User = mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transacctions:[]
})
module.exports={
    User
}