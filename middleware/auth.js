const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    //https://www.youtube.com/watch?v=USaB1adUHM0&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE&index=9&t=77s
    //Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorizaton denied' });
    }
    try {
        //Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        //Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;