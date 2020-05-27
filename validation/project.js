const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.category = !isEmpty(data.category) ? data.category : '';
    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    if (!Validator.isLength(data.category, {min: 2, max: 20})) {
        errors.category = 'Category must be between 2 and 20 characters';
    }

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
