"use strict";
var express = require('express');
var router = express.Router();
var Prod = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
/* GET products. */
router.get('/', function(req, res, next) {
    Prod.find(function(err, products) {
        if (err) res.send(err);
        if (products) res.json(products);
    });
});

router.get('/get-shopping-cart', function(req, res, next) {
    console.log(req.session);
    if (req.session.cart) {
        var cart = new Cart(req.session.cart.items);
        //var cart = new Cart({});
        cart.generateArray();
        console.log(cart.generateArray());
        res.json({
            items: cart.generateArray(),
            totalQty: cart.totalQty,
            totalPrice: cart.totalPrice
        });
    } else res.json({});
});

router.post('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});
    //var cart = new Cart({});
    Prod.findById(productId, function(err, product) {
        if (err) res.json(err);
        console.log('add cart', product);
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log('session_id', req.session.id);
        res.json({
            cart: req.session.cart,
            session_id: req.session.id
        });
    });
});

router.post('/getSession/:id', function(req, res, next) {
    var sessionId = req.params.id;

    Prod.findById(productId, function(err, product) {
        if (err) res.json(err);
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log('session_id', req.session.id);
        res.json({
            cart: req.session.cart,
            session_id: req.session.id
        });
    });
});

router.get('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        res.send({
            message: "Unauthorized"
        });
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.json(cart.totalPrice);
});

router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        res.json({
            message: "Unauthorized"
        });
    }
    console.log('begin save order');
    var cart = new Cart(req.session.cart.items);
    console.log(cart);
    var errMsg = req.flash('error')[0];
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: 'charge.id'
    });
    order.save(function(err, result) {
        console.log('success', 'Successfully bought product!');
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.json(result._id);
    });
});



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