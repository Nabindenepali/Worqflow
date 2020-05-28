const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTaskInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if (!Validator.isLength(data.name, {min: 2, max: 50})) {
        errors.name = 'Name must be between 2 and 50 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
