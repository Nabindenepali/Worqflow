const Validator = require('validator');
const isEmpty = require('./is-empty');
const countries = require('country-data').countries;
const moment = require('moment');

module.exports = function validateProfileInput(data, files) {
    let errors = {};

    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    data.date_of_birth = !isEmpty(data.date_of_birth) ? data.date_of_birth : '';
    data.address = !isEmpty(data.address) ? data.address : '';
    data.country = !isEmpty(data.country) ? data.country : '';

    if (files) {
        const avatar = files.avatar;
        console.log(avatar.size);
        if (!avatar) {
            errors.avatar = 'Avatar field is required';
        } else if (avatar.size > 2*1024*1024) { // 2 MB, avatar.size gives bytes
            errors.avatar = 'File size for avatar can not exceed 2 MB'
        }
    }

    if (Validator.isEmpty(data.first_name)) {
        errors.first_name = 'First name field is required';
    } else if (!Validator.isLength(data.first_name, {min:2, max: 20})) {
        errors.first_name = 'First name must be between 2 and 20 characters';
    }

    if (Validator.isEmpty(data.last_name)) {
        errors.last_name = 'Last name field is required';
    } else if (!Validator.isLength(data.last_name, {min:2, max: 20})) {
        errors.last_name = 'Last name must be between 2 and 20 characters';
    }

    if (Validator.isEmpty(data.date_of_birth)) {
        errors.date_of_birth = 'Date of birth field is required';
    } else if (!moment(data.date_of_birth, 'YYYY-MM-DD', true).isValid()) {
        errors.date_of_birth = 'Date of birth is not valid';
    }

    if (Validator.isEmpty(data.address)) {
        errors.address = 'Address field is required';
    } else if (!Validator.isLength(data.address, {min:2, max: 60})) {
        errors.address = 'Address must be between 2 and 60 characters';
    }

    if (Validator.isEmpty(data.country)) {
        errors.country = 'Country field is required';
    } else if (!countries[data.country]) {
        errors.country = 'Entered country code is not valid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
