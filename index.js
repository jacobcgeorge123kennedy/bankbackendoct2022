const express = require('express')
const cors = require('cors')
const dataService = require('./services/dataService')
const jwt = require('jsonwebtoken')
const server = express()
server.use(cors({
    origin:'http://localhost:4200'
}))
server.use(express.json())
server.listen(3000, ()=>{
    console.log('server started at 3000');
})
const appMiddleware = (req,res,next)=>{
    console.log('application specific middleware');
    next()
}
server.use(appMiddleware)
const jwtMiddleware = (req,res,next)=>{
    console.log('inside router specific middleware');
    const token = req.headers['access-token']
    try{
        const data =jwt.verify(token,'supersecretkey123')
        console.log(token)
        req.fromAcno = data.currentAcno
        console.log('Valid Token');
        next()
    }
    catch{
        console.log('Invalid Token');
        res.status(401).json({
            message:'Please Login!!!'
        })
    }
}
server.post('/register',(req,res)=>{
    console.log('Inside register function');
    console.log(req.body);
    dataService.register(req.body.uname, req.body.acno, req.body.pswd).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
server.post('/login',(req,res)=>{
    console.log('Inside login function');
    console.log(req.body);
    dataService.login(req.body.acno, req.body.pswd).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside getBalance api function');
    console.log(req.params);
    dataService.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside deposit api function');
    console.log(req.body);
    dataService.deposit(req.body.acno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer  function');
    console.log(req.body);
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount).then((result)=>{
         res.status(result.statusCode).json(result)
    })
})
server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log("Inside getAllTranssactions api");
    dataService.getAllTransactions(req).then((result)=>{
        res.status(result.statusCode).json(result)  
    })
})
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside delete-account api function');
    console.log(req.params.acno);
    dataService.deleteMyAccount(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})



