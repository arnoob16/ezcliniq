const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{ //next is called when authentication is done to proceed further
    //here the jwt token comes in header after the user is authenticated
    const token = req.header('x-auth-token')
    //if their is no token given
    if(!token)
    {
        return res.status(401).json({meg:'No authrntication token , authentication denied'}) //401 -> unauthorised
    }
    //if token is given then verify the token
    const verified = jwt.verify(token,process.env.JWT_SECRET) //it verifies the token with secret
    //and gives decoded object which is stored in verified. Basically gives user._id
    if(!verified) //jwt token is created by someone else eg - hacker , it will not verify
    {
        return res.status(401).json({meg:'Token verification failed , authentication denied'})
    }
    //console.log("Verifird :",verified);
    req.user = verified.id //returns the req to the next step
    next() //in delete this will take to next parameter
}

module.exports = auth