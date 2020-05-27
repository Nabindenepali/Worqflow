const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: String,
        required: true
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
    status: {
        type: String,
        enum: ['INACTIVE', 'ACTIVE', 'COMPLETED'],
        default: 'INACTIVE'
    }
});

module.exports = User = mongoose.model('project', ProjectSchema);

