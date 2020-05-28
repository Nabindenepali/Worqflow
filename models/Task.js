const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TaskSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    time_log: {
        type: Number,
        default: 0
    },
    last_started: {
        type: Date
    },
    status: {
        type: String,
        enum: ['INACTIVE', 'ACTIVE', 'COMPLETED'],
        default: 'INACTIVE'
    }
});

module.exports = User = mongoose.model('task', TaskSchema);

