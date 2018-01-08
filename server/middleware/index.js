const jwt = require('jsonwebtoken');
const secretKey = require('../constants').secretKey;

const checkToken = (req, res , next) => {
    let bearer = req.headers['authorization'];

    if (bearer) {
        let token = bearer.split(' ');

        return jwt.verify(token[1], secretKey, (err , decoded) => {
            if (err) {
                res.sendStatus(401)
            }

            next();
        });
    }

    res.sendStatus(403);
}

module.exports.checkToken = checkToken;
