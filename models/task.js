var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;


var taskSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true, default: 'default.jpg'}
});

taskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', taskSchema);
