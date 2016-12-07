var mongoose = require('mongoose');
var paginate  = require('mongoose-paginate');

var Schema = mongoose.Schema;


var postSchema = new Schema({
    name: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'category'},
    content: {type: String, required: true},
    image: {type: String, required: true, default: 'default.jpg'}
});

postSchema.plugin(paginate);

module.exports = mongoose.model('Post', postSchema);
