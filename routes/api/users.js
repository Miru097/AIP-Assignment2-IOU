const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    //https://www.jb51.net/article/115170.htm
    const nameRegexp = /^[a-zA-Z0-9_-]{4,20}$/;
    //http://www.jsdaxue.com/archives/182.html
    const emailRegexp = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //https://blog.csdn.net/Z_ammo/article/details/103420485
    //const passwordRegexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields!' });
    }
    if (!nameRegexp.test(name)) {
        return res.status(400).json({ msg: 'Please enter the username as required!' });
    }
    if (!emailRegexp.test(email)) {
        return res.status(400).json({ msg: 'Please check your email!' });
    }
    if (!passwordRegexp.test(password)) {
        return res.status(400).json({ msg: 'Please enter the password as required!' });
    }
    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User email already exists' });
            const newUser = new User({
                name,
                email,
                password
            });
            //Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    jwt.sign(
                                        { id: user.id },
                                        config.get('jwtSecret'),
                                        { expiresIn: 3600 },
                                        (err, token) => {
                                            if (err) throw err;
                                            res.json({
                                                token: token,
                                                user: {
                                                    id: user.id,
                                                    name: user.name,
                                                    email: user.email
                                                }
                                            });
                                        }
                                    )
                                }
                            )
                        });
                })
            })
        })
});

router.get('/', (req, res) => {
    User.find({}, { password: 0, register_date: 0 })
        .sort({ _id: -1 })
        .then(user => res.json(user));
});

module.exports = router;
