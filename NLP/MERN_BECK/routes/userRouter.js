const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const { json } = require('express')

router.post('/register',async(req,res)=>{
    let {email,password,passwordCheck,displayName} = req.body;

    //validation if password,email and displayName exists
    if(!email || !password || !passwordCheck)
    {
        return res.status(404).json({msg:'Not all feilds have been entered'})
    }
    if(password.length < 5)
    {
        return res.status(404).json({msg:'the password should be atleast 5 character long'})
    }
    if(password!=passwordCheck)
    {
        return res.status(404).json({msg:'Enter Same Password twice for verification'})
    }

    //finding existing user in mondoDb
    const existingUser = await User.findOne({email:email}) //await waits till mongoDB finds the User
    // if User is not found it returns null
    if(existingUser)
    {
        return res.status(404).json({msg:'Account with this email exists'})
    }

    if(!displayName)
    {
        displayName=email
    }

    //encryping password to store in the database
    const salt = await bcrypt.genSalt() //generates random salt value
    const passwordHash = await bcrypt.hash(password,salt)
    //console.log(passwordHash)

    //Save the user
    const newUser = new User({
        email:email,
        password:passwordHash,
        displayName:displayName
    })

    const saveUser = await newUser.save()
    res.json(saveUser)
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    
    //validate
    if(!email || !password)
    {
        return res.status(404).json({msg:'Not all feilds have been entered'})
    }

    const user = await User.findOne({email:email})
    console.log(user)
    if(!user)
    {
        return res.status(404).json({msg:'No account with this email has been registered'})
    }
    //if user found match the password
    const isMatch = await bcrypt.compare(password,user.password)//matching entered password
    //to the user password that we receive. returns true if password matches , flase otherwise
    if(!isMatch)
    {
        return res.status(404).json({msg:'Invalid Credentials'})
    }

    //As everything goes correct we can sign jwt that tells the frontend you are indeed logged in
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    //contains which user is logged in and tells the frontend that this user is verified

    res.json({
        token:token,
        user:{
            id:user._id,
            displayName:user.displayName
        }
    })
})

//deleting the account, but this should be private, one can only delete self account not everyone's
router.post('/delete',auth,async(req,res)=>{
    //console.log(req.user)
    const deletedUser = await User.findByIdAndDelete(req.user)
    res.json(deletedUser)
})

//this route returns true if token isValid else false
router.post('/tokenIsValid',async(req,res)=>{
    const token = req.header('x-auth-token')
    if(!token)
    {
        return res.json(false)
    }
    const verified = jwt.verify(token,process.env.JWT_SECRET) //it verifies the token with secret
    if(!verified)
    {
        return res.json(false)
    }

    //verifying again user exists in database
    const user = await User.findById(verified.id)
    if(!user)
    {
        return res.json(false)
    }
    return res.json(true)
})

//for getting information about single user in frontend which is currently login
router.get("/",auth,async (req,res)=>{
    const user = await User.findById(req.user)
    res.json({
        displayName:user.displayName,
        id:user._id
    });
})

router.post("/search",async(req,res)=>{
    console.log("Request Body :",req.body.search);
    const sval = req.body.search;
    const spwan = require('child_process').spawn
    //const childProcess = spwan('python',['test.py'])
    const childProcess = spwan('python',['nlpModel.py',sval])

    childProcess.stdout.on('data',(data)=>{
        res.send(data)
        console.log(`stdout: ${data}`)
    })

    childProcess.stderr.on('data',(data)=>{
        console.log(`stderr: ${data}`)
    })

    childProcess.on('close',(code)=>{
        console.log(`process ends with code ${code}`)
    })
})

module.exports = router