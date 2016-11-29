var express = require('express');
var router = express.Router();

var Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tasks/add', function(req, res, next){
    res.render('tasks/add');
});

router.post('/tasks/add', function(req, res, next){
    req.checkBody("name", "Please enter a task name.").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('tasks/add', {errors: errors});
    }else{
        task = new Task({
            name: req.body.name
        });
        task.save(function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/tasks/add');
            }
            console.log('data saved');
            res.render('tasks/add', {success: 'Task added successfully'});
        });
    }
});

router.get('/tasks/view', function(req, res, next){
    var perPage = 3, page = req.param('page') > 0 ? req.param('page') : 0;

    //Task.find(function(err, docs){
    Task.paginate({}, { page: 1, limit: 3 }, function(err, result) {
        if(err){
            console.log(err);
        }
        console.log(result);
         var taskData = [];
        for(i = 0; i < result.docs.length; i++){
          taskData.push(result.docs[i]);
        }
        res.render('tasks/view', { tasks: taskData, result: result });
    });
});

router.get('/tasks/edit/:id', function(req, res, next){
    taskId = req.params.id;
    Task.findById(taskId, function(err, docs){
        if(err){
            console.log(err);
        }
        console.log(docs);
        res.render('tasks/edit', { task: docs });
    });
});

router.post('/tasks/update', function(req, res, next){
    var taskId = req.body.id;
    Task.findById(taskId, function(err, docs){
        if(err){
            console.log(err);
            res.render('tasks/edit', { task: docs, error: err });
        }
        docs.name = req.body.name;
        docs.save();
        res.redirect('/tasks/view');
    });
});

router.get('/tasks/delete/:id', function(req, res, next){
    console.log('delete');
    var taskId = req.params.id;
    // Task.remove({id: taskId});
    Task.findByIdAndRemove(taskId).exec();
    res.redirect('/tasks/view');
});

router.post('/tasks/search', function(req, res, next){
    var searchTerm = req.body.name;
    req.checkBody("name", "Please enter a task name.").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log(errors);
        res.redirect('/tasks/view');
    }else{
        Task.find({name: searchTerm}, function(err, docs){
            if(err){
                console.log(err);
            }
            console.log(docs);
            var taskData = docs;
            res.render('tasks/view', { tasks: taskData });
        });
    }
});



module.exports = router;
