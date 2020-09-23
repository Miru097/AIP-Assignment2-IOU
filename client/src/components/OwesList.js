import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
//import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { getOwes, deleteOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';



class OwesList extends Component {

    static propTypes = {
        getOwes: PropTypes.func.isRequired,
        owe: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
    }

    componentDidMount() {
        this.props.getOwes();
    }

    onDeleteClick = (id) => {
        this.props.deleteOwe(id);
    }

    render() {
        const { owes } = this.props.owe;
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="owe-List">
                        {owes.map(({ _id, name, favor, creditor, debtor }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    {this.props.isAuthenticated ? <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                    >&times;</Button> : ''}
                                    {favor}{creditor}{debtor}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}



const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
    mapStateToProps,
    { getOwes, deleteOwe }
)(OwesList);