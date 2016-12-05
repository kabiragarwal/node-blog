var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var postSchema = new Schema({
    name: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'category'},
    content: {type: String, required: true},
    image: {type: String, required: true, default: 'default.jpg'}
});



module.exports = mongoose.model('Post', postSchema);
