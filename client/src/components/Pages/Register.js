/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from "reactstrap";

// core components
import WqNavbar from "components/Navbars/WqNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/profile');
        }

        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };

        this.props.registerUser(newUser, this.props.history);
    }

    render() {
        const {errors} = this.state;

        return (
            <>
                <WqNavbar/>
                <main ref="main">
                    <section className="section section-shaped section-lg">
                        <div className="shape shape-style-1 bg-gradient-default">
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                        <Container className="pt-lg-7">
                            <Row className="justify-content-center">
                                <Col lg="5">
                                    <Card className="bg-secondary shadow border-0">
                                        <CardBody className="px-lg-5 py-lg-5">
                                            <div className="text-center text-muted mb-5">
                                                <small>Sign up with credentials</small>
                                            </div>
                                            <Form noValidate role="form" onSubmit={this.onSubmit}>
                                                <TextFieldGroup
                                                    icon="hat-3"
                                                    placeholder="Username"
                                                    name="username"
                                                    type="text"
                                                    value={this.state.username}
                                                    onChange={this.onChange}
                                                    error={errors.username}
                                                />
                                                <TextFieldGroup
                                                    icon="email-83"
                                                    placeholder="Email"
                                                    name="email"
                                                    type="email"
                                                    value={this.state.email}
                                                    onChange={this.onChange}
                                                    error={errors.email}
                                                />
                                                <TextFieldGroup
                                                    icon="lock-circle-open"
                                                    placeholder="Password"
                                                    name="password"
                                                    type="password"
                                                    value={this.state.password}
                                                    onChange={this.onChange}
                                                    error={errors.password}
                                                />
                                                <TextFieldGroup
                                                    icon="lock-circle-open"
                                                    placeholder="Confirm Password"
                                                    name="password_confirmation"
                                                    type="password"
                                                    value={this.state.password_confirmation}
                                                    onChange={this.onChange}
                                                    error={errors.password_confirmation}
                                                />
                                                <div className="text-center">
                                                    <Button
                                                        className="mt-4"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        Create account
                                                    </Button>
                                                </div>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                    <Row className="mt-3">
                                        <Col className="text-center">
                                            <Link to="/login"
                                                  className="text-light"
                                            >
                                                <small>Login with existing account</small>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </main>
                <SimpleFooter/>
            </>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {registerUser})(withRouter(Register));
