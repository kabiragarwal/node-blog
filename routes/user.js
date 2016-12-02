var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

var User = require('../models/user');

router.get('/logout', isLoggedIn, function(req, res, next){

    req.logout();
    res.redirect('/');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
    User.find({'_id': req.user.id}, function(err, result){
        if(err){
            return res.write('Error!');
        }
        console.log(result);
        res.render('users/profile', { user: result });
    });
});

router.use('/', notLoggedIn, function(req, res, next){
    next();
});

/* GET users listing. */
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next) {
    res.redirect('/user/profile');
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('users/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next) {
    res.redirect('/user/profile');
});



module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
