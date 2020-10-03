import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const TextFieldGroup = ({
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    icon,
    onChange,
    disabled
}) => {
    return (
        <FormGroup className={classnames('mb-3', {
            'has-danger': error
        })}>
            <InputGroup className="input-group-alternative">
                {icon && <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className={classnames('ni', 'ni-' + icon)} />
                    </InputGroupText>
                </InputGroupAddon>}
                <Input className={classnames('form-control', {
                    'is-invalid': error
                })}
                   type={type}
                   name={name}
                   placeholder={placeholder}
                   value={value}
                   onChange={onChange}
                   disabled={disabled}
                />
                {info && (<small className="form-text text-muted">{info}</small>)}
                {error && (<div className="invalid-feedback">{error}</div>)}
            </InputGroup>
        </FormGroup>
    )
};

TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
    type: 'text'
};

export default TextFieldGroup;
