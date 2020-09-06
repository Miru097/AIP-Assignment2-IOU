import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import { addOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';

class OweModal extends Component {
    state = {
        modal: false,
        name: ''
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const newOwe = {
            name: this.state.name
        }
        this.props.addOwe(newOwe);
        this.toggle();
    }

    render() {
        return (
            <div>
                {this.props.isAuthenticated ? <Button
                    color="dark"
                    style={{ marginBottom: '2rem' }}
                    onClick={this.toggle}
                >Add New Owe
                </Button> : <h4 className="mb-3 ml-4">Please log in to manage your owe list</h4>}
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add To Owe List</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="owe">Owe</Label>
                                <Input type="text"
                                    name="name"
                                    id="owe"
                                    placeholder="Add description"
                                    onChange={this.onChange}
                                />
                                <ModalFooter>
                                    <Button
                                        color="dark"
                                        style={{ marginTop: '2rem' }}
                                    >Add Owe</Button>
                                </ModalFooter>

                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps,
    { addOwe })(OweModal);