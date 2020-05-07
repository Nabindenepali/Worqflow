const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation : '';

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    if (!Validator.isLength(data.username, {min: 2, max: 30})) {
        errors.username = 'Username must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, {min: 6})) {
        errors.password = 'Password needs to be at least 6 characters';
    }

    if (Validator.isEmpty(data.password_confirmation)) {
        errors.password_confirmation = 'Password confirmation field is required';
    }

    if (!Validator.equals(data.password, data.password_confirmation)) {
        errors.password_confirmation = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
