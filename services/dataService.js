const db = require('./db')
const jwt = require('jsonwebtoken')
const register = (uname,acno,pswd)=>{
    console.log('Inside register function in data service');
    return db.User.findOne({
        acno
    }).then((result)=>{
        console.log(result);
        if(result){
            return {
                statusCode:403,
                message:'Account Already Exist!!!'
            }
        }
        else{
            const newUser = new db.User({
                username:uname,
                acno,
                password:pswd,
                balance:0,
                transacctions:[]
            })
            newUser.save()
            return {
                statusCode:200,
                message:'Registration Successfull...'
            }
        }
    })
}
const login=(acno,pswd)=>{
    console.log('inside login function body'); 
    return db.User.findOne({
        acno:acno,
        password:pswd
    }).then((result)=>{
        if(result){
            const token = jwt.sign({
                currentAcno:acno
            },'supersecretkey123')
            return{
                statusCode:200,
                message:'Login Successfull...',
                username:result.username,
                currentAcno:acno,
                token
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account / Password'
            }
        }
    })
}
const getBalance =(acno)=>{
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return {
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account'
            }
        }
    })
}
const deposit= (acno,amt)=>{
    let amount = Number(amt)
    console.log(amount);
    return db.User.findOne({
        acno
    }).then((result)=>{
        console.log(result);
        if(result){
            result.balance += amount
            result.transacctions.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            result.save()
            return{
                statusCode:200,
                message:`${amount} succcessfully deposited...`
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account'
            }
        }
    })
}
const fundTransfer = (req,toAcno,pswd,amt)=>{
    let amount= parseInt(amt)
    let fromAcno = parseInt(req.fromAcno)
    console.log(fromAcno);
    return db.User.findOne({
        acno:fromAcno,
        password:pswd
        }).then(result=>{
            if(fromAcno==toAcno){
                return {
                    statusCode:401,
                    message:"Permission denies due to own account transfer"
                }
            }
        if(result){
            let fromAcnoBalance = result.balance
            if(fromAcnoBalance>=amount){
                result.balance=fromAcnoBalance-amount
                return db.User.findOne({
                    acno:toAcno
                }).then(creditdata=>{
                    if(creditdata){
                        creditdata.balance+=amount
                        creditdata.transacctions.push({
                            type:"CREDIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        creditdata.save()
                        result.transacctions.push({
                            type:"DEBIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save()
                        return{
                            statusCode:200,
                            message:"Amount transfer successfull"
                        }
                    }else{
                        return {
                            statusCode:401,
                            message:"Invalid credit account number"
                        }
                    }
                })
            }else{
                return {
                    statusCode:403,
                    message:"INsufficient Balance"
                }
            }
        }
        else{
            return {
                statusCode:401,
                message:"Invalid debit account number or password"
            }
        }
    })

}
const getAllTransactions=(req)=>{
    let acno=req.fromAcno
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return {
                statusCode:200,
                transactions:result.transacctions
            }
        }else{
            return {
                statusCode:401,
                message:"Invalid Account Number"
            }
        }
    })
}
const deleteMyAccount= (acno) => {
    return db.User.deleteOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                message:"Account deleted successfully"
           }
        }else{
           return{
                statusCode:401,
                message:"Invalid Account"
           } 

        }
    })
}
module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransactions,
    deleteMyAccount
}