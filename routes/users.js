"use strict";
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');

router.get('/signstatus', function(req, res) {
    console.log(req.isAuthenticated());
    res.json({ sign: req.isAuthenticated() });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    console.log("user logout");
    //req.session = null;
    req.logout();
    console.log(req.session);
    //clear cart
    req.session.cart = null;
    res.json({ message: 'logout successful' });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
    console.log("get profile", req.user);
    res.json(req.user);
});

router.get('/orders', isLoggedIn, function(req, res, next) {
    console.log("get order", req.user);
    Order.find({ user: req.user }, function(err, orders) {
        if (err) res.send(err);
        console.log('orders', orders);
        var cart;
        for (let order of orders) {
            cart = new Cart(order.cart.items);
            console.log('order cart', cart);
            order.cart.items = cart.generateArray();
            console.log('order items', order.items);
        };
        console.log('orders after array', orders);
        res.json(orders);
    });


});

// router.post('/signup', notLoggedIn, passport.authenticate('local.signup'),
//     function(req, res) {
//         console.log(req, "signup");
//         res.json(req.user._id);
//     });
router.post('/signup', notLoggedIn, function(req, res, next) {
    passport.authenticate('local.signup', function(err, user, info) {
        if (user === false) {
            // handle login error ...
            res.json({ message: "email already in use" });

        } else {
            // handle successful signup ...
            res.json({ user: user._id });
        }
    })(req, res, next);
});

router.post('/signin', notLoggedIn, passport.authenticate('local.signin'),
    function(req, res) {
        console.log('session_id', req.session.id);
        console.log('cookies', req.cookies);

        var response = {
            user: "welcome " + req.user.email,
            sign: req.isAuthenticated(),
            direction: req.url
        }
        res.json(response);
    });
// router.post('/signin', function(req, res, next) {
//     passport.authenticate('local.signin', function(err, user, info) {
//         if (user === false) {
//             // handle login error ...
//             res.json({ message: "login fail" });

//         } else {
//             // handle successful login ...
//             var response = {
//                 user: "welcome " + req.user.email,
//                 sign: req.isAuthenticated()
//             }
//             res.json(response);
//         }
//     })(req, res, next);
// });

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.send({
        message: "Unauthorized"
    });
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.send({
        message: "you already login",
        sign: true
    });
}