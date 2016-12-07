var User = require('../models/user');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/node-todo');
mongoose.Promise = require('bluebird');

var newUser = new User();
newUser.email = 'admin@gmail.com';
newUser.password = newUser.encryptPassword('123456');
newUser.role = 'admin';


newUser.save(function(err, result){
    if(err){
        return done(err);
    }
    console.log('done'); 
    exit();
});


function exit(){
    mongoose.disconnect();
}
