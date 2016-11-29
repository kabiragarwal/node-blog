var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;


var taskSchema = new Schema({
    name: {type: String, required: true}
});

taskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', taskSchema);
