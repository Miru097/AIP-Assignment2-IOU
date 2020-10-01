import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap'
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

export class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    };
    Logout = () => {
        this.props.logout()
        window.location.reload()
    }
    render() {
        return (
            <Fragment>
                <NavLink onClick={this.Logout} href="#">
                    Logout
                </NavLink>
            </Fragment>
        )
    }
}

export default connect(null, { logout })(Logout);