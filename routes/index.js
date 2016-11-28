var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tasks/add', function(req, res, next){
    res.render('tasks/tasks-add');
});

router.post('/tasks/add', function(req, res, next){
    req.checkBody("task", "Please enter a task name1.").notEmpty();
    //req.checkBody('task', 'Please enter a task name').isEmpty();
    var errors = req.validationErrors();

    if(errors){
        //send error
        console.log('hello1');
        res.render('tasks/tasks-add', {errors: errors});
    }else{
        console.log('hello2');
        res.render('tasks/tasks-add', {success: 'Task added successfully'});
    }
})

module.exports = router;
