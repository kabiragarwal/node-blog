var Category = require('../models/category');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/node-todo');
mongoose.Promise = require('bluebird');


var categories = [
        new Category({
            name: 'First Category',
            description: 'First Category Description'
        }),
        new Category({
            name: 'Second Category',
            description: 'Second Category Description'
        }),
        new Category({
            name: 'Third Category',
            description: 'Third Category Description'
        }),
        new Category({
            name: 'Fourth Category',
            description: 'Fourth Category Description'
        })
];

    var done =0;
    for(i = 0; i < categories.length; i++){
        categories[i].save(function(err, result){
            done++;
            if(done === categories.length){
                exit();
            }
        });
    }

    function exit(){
        mongoose.disconnect();
    }
