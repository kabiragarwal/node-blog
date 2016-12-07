var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

var User = require('../models/user');

router.get('/logout', isAdmin, function(req, res, next){

    req.logout();
    res.redirect('/admin/signin');
});

router.get('/dashboard', isAdmin, function(req, res, next) {
    User.find({'_id': req.user.id}, function(err, result){
        if(err){
            return res.write('Error!');
        }
        console.log(result);
        res.render('admin/dashboard', { user: result, layout: 'admin_layout' });
    });
});


/* GET users listing. */
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('admin/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/admin/signin',
    failureFlash: true
}), function(req, res, next) {
    res.redirect('/admin/dashboard');
});

module.exports = router;

function isAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.role == 'admin'){
        return next();
    }
    res.redirect('/admin/signin');
}
