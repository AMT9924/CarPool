const jwt = require('jsonwebtoken');
const { customError } = require('./errorhandler.middleware');

const auth = (req, res, next)=>{
    const {cookie, authorization} = req.headers;
    let token;
    if (cookie) {
        token = cookie?.split('; ')?.filter((c)=> c.includes('jwtToken'))?.[0]?.replace('jwtToken=','');
    }
    if(!token && authorization){
        token = authorization;
        console.log(authorization);
        
    }

    if (!token) {
        throw new customError(400, 'Bad request Token not available')
    }
    try {
        const payload = jwt.verify(token, 'secret');
        req.userId = payload.userId;
    } catch (error) {
        throw new customError(400, 'Token expired')
    }
    next()
}

module.exports = auth;