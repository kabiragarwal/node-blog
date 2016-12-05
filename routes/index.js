var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');


var Task = require('../models/task');
var Category = require('../models/category');
var Post = require('../models/post');
var Post1 = require('../helpers/foo');

var storageProperties = multer.diskStorage({

    destination: function (req, file, callback) {
        // console.log(req.body);
        // console.log(req.file);
        callback(null, 'public/files/') //file destination
    },

    filename: function (req, file, callback) {
        var fullName = file.originalname.split('.'),
        lastName = fullName[fullName.length - 1];
        var newFileName = + new Date() + '.' + lastName;
        callback(null, newFileName )
    }
});

var upload = multer({  fileFilter: function (req, file, cb) {

       var fullName = file.originalname.split('.'),
       lastName = fullName[fullName.length - 1];
       var filetypes = /jpeg|jpg/;
       var mimetype = filetypes.test(file.mimetype);
       var extname = filetypes.test(lastName.toLowerCase());

       if (mimetype && extname) {
         return cb(null, true);
       }
     }, storage: storageProperties
 });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tasks/add', function(req, res, next){
    res.render('tasks/add');
});

router.post('/tasks/add', upload.single('image'), function(req, res, next){
    req.checkBody("name", "Please enter a task name.").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('tasks/add', {errors: errors});
    }else{
        task = new Task({
            name: req.body.name
        });

        console.log(req.file);
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
    var perPage = 100, page = req.param('page') > 0 ? req.param('page') : 0;

    Task.paginate({}, { page: 1, limit: perPage }, function(err, result) {
        if(err){
            console.log(err);
        }
        //console.log(result);
         var taskData = []; pagingEnabled =false; paging = [];
        for(i = 0; i < result.docs.length; i++){
          taskData.push(result.docs[i]);
        }
        for(i = 1; i <= result.pages; i++){
            pagingEnabled = true;
          paging.push('<li class="active"><a href="/?page=i">{{i}}</a></li>');
        }
        res.render('tasks/view', { tasks: taskData, result: result, pagingData: paging, pagingStatus : pagingEnabled });
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

router.post('/tasks/update', upload.single('image'), function(req, res, next){
    var taskId = req.body.id;
    req.checkBody("name", "Please enter a task name.").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('tasks/edit', {errors: errors});
    }else{
        Task.findById(taskId, function(err, docs){
            if(err){
                console.log(err);
                res.render('tasks/edit', { task: docs, error: err });
            }
            console.log(req.file);
            docs.name = req.body.name;
            docs.image = req.file.filename;
            if(req.body.old_image!='default.jpg'){
                deleteFile('public/files/' + req.body.old_image);
            }
            docs.save();
            res.redirect('/tasks/view');
        });
    }
});

function deleteFile (file) {
    fs.unlink(file, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

router.get('/tasks/delete/:id', function(req, res, next){
    console.log('delete');
    var taskId = req.params.id;
    // Task.remove({id: taskId});
    Task.findById(taskId, function(err, docs){
        if(err){
            console.log(err);
            res.render('tasks/edit', { task: docs, error: err });
        }
        console.log(docs);
        console.log(docs.image);
        if(docs.image!='default.jpg'){
            deleteFile('public/files/' + docs.image);
        }
        Task.findByIdAndRemove(taskId).exec();
    });

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

//blog crud operations
router.get('/blogs/create', function(req, res, next){
    Category.find(function(err, docs){
        if(err){
            console.log(err);
        }
        console.log(docs);
        res.render('blogs/create', {Category: docs});
    })
})

router.post('/blogs/create', upload.single('image'), function(req, res, next){
    req.checkBody("name", "Please enter a post name.").notEmpty();
    req.checkBody("content", "Please enter content.").notEmpty();
    req.checkBody("category", "Please select a category.").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('blogs/create', {errors: errors});
    }else{
        post = new Post({
            name: req.body.name,
            content: req.body.content,
            category: req.body.category,
            image: req.file.filename
        });
        post.save(function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/blogs/create');
            }
            req.flash('success', 'Post created successfully');
            res.redirect('/blogs/view');
        });
    }
});

router.get('/blogs/view', function(req, res, next){

    var successMsg = req.flash('success')[0];
    Post.find()
        .populate('category')
        .exec(function(err, results) {
            if (err) console.log(err);
        res.render('blogs/view', { posts: results, successMsg:successMsg, noMessage: !successMsg });
    });

    // Post.find({}, function(err, result) {
    //     if(err){
    //         console.log(err);
    //     }
    //     res.render('blogs/view', { posts: result });
    // });
});


router.get('/blogs/update/:id', function(req, res, next){
    postId = req.params.id;
    catData = '';
    Category.find(function(err, res){
        if(err)console.log(err);
        catData = res;
        //console.log(catData);
    })

    Post.findOne({ _id: postId }).populate('category').exec(function(err, docs){
        if(err){
            console.log(err);
        }
        catDataUpdated = [];
        var selected = options = '';
        for(i=0; i<catData.length; i++){
            selected = options = '';
            selected = (docs.category.name == catData[i].name)?'selected="selected"': '';
            options = '<option value="'+ catData[i]._id +'"' + selected + '>';
            catDataUpdated.push(options + catData[i].name+ "</option>")
        }
        res.render('blogs/update', {Category:catData, post: docs, optionsData: catDataUpdated});
    });
});

router.post('/blogs/update', upload.single('image'), function(req, res, next){
    req.checkBody("name", "Please enter a post name.").notEmpty();
    req.checkBody("content", "Please enter content.").notEmpty();
    req.checkBody("category", "Please select a category.").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('blogs/view', {errors: errors});
    }else{
        var postId = req.body.id;
        Post.findById(postId, function(err, docs){
            if(err){
                console.log(err);
                res.render('blogs/view', { task: docs, error: err });
            }
            docs.name = req.body.name;
            docs.content = req.body.content;
            docs.category = req.body.category;
            docs.image = req.file.filename;
            if(req.body.old_image!='default.jpg'){
                deleteFile('public/files/' + req.body.old_image);
            }
            docs.save();
            req.flash('success', 'Post updated successfully');
            res.redirect('/blogs/view');
        });
    }
});

router.get('/blogs/delete/:id', function(req, res, next){
    console.log('delete');
    var postId = req.params.id;
    // Task.remove({id: taskId});
    Post.findById(postId, function(err, docs){
        if(err){
            console.log(err);
            res.render('blogs/edit', { post: docs, error: err });
        }
        console.log(docs);
        console.log(docs.image);
        if(docs.image!='default.jpg'){
            deleteFile('public/files/' + docs.image);
        }
        Post.findByIdAndRemove(postId).exec();
    });
    res.redirect('/blogs/view');
});

module.exports = router;
