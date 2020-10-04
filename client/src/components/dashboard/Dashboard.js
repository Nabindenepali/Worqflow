import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import WqNavbar from '../Navbars/WqNavbar';
import { Card, Col, Container, Row } from 'reactstrap';
import SimpleFooter from '../Footers/SimpleFooter';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
    componentDidMount() {
        this.props.getCurrentProfile();

        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }

    render() {
        const { user } = this.props.auth;
        const { profile, loading } = this.props.profile;

        let dashboardContent;

        if (profile === null || loading) {
            dashboardContent = <Card className="card-profile shadow mt--300">
                <div className="px-4">
                    <div className="text-center mt-5">
                        <Spinner />
                    </div>
                </div>
            </Card>
        } else {
            // Check if logged in user has profile data
            if (Object.keys(profile).length) {
                dashboardContent = <Card className="card-profile shadow mt--300">
                    <div className="px-4">
                        <div className="text-center mt-5">
                            <h3>
                                Jessica Jones{" "}
                                <span className="font-weight-light">, 27</span>
                            </h3>
                            <div className="h6 font-weight-300">
                                <i className="ni location_pin mr-2" />
                                Bucharest, Romania
                            </div>
                            <div className="h6 mt-4">
                                <i className="ni business_briefcase-24 mr-2" />
                                Solution Manager - Creative Tim Officer
                            </div>
                            <div>
                                <i className="ni education_hat mr-2" />
                                University of Computer Science
                            </div>
                        </div>
                        <div className="mt-5 py-5 border-top text-center">
                            <Row className="justify-content-center">
                                <Col lg="9">
                                    <p>
                                        An artist of considerable range, Ryan — the name taken
                                        by Melbourne-raised, Brooklyn-based Nick Murphy —
                                        writes, performs and records all of his own music,
                                        giving it a warm, intimate feel with a solid groove
                                        structure. An artist of considerable range.
                                    </p>
                                    <a href="#pablo" onClick={e => e.preventDefault()}>
                                        Show more
                                    </a>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            } else {
                // User is logged in but has no profile
                dashboardContent = <Card className="card-profile shadow mt--300">
                    <div className="px-4">
                        <div className="text-center mt-5">
                            <h3>
                                { user.username }{" "}
                            </h3>
                        </div>
                        <div className="mt-5 py-5 border-top text-center">
                            <Row className="justify-content-center">
                                <Col lg="9">
                                    <p>
                                        You have not yet setup a profile, please add some info.
                                    </p>
                                    <Link to="/create-profile" className="btn btn-lg btn-info">
                                        Create Profile
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            }
        }

        return (
            <>
                <WqNavbar />
                <main className="profile-page" ref="main">
                    <section className="section-profile-cover section-shaped my-0">
                        {/* Circles background */}
                        <div className="shape shape-style-1 shape-default alpha-4">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        {/* SVG separator */}
                        <div className="separator separator-bottom separator-skew">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="fill-white"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </section>
                    <section className="section">
                        <Container>
                            {dashboardContent}
                        </Container>
                    </section>
                </main>
                <SimpleFooter />
            </>
        );
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
