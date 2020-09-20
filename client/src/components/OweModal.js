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
    ModalFooter,
    CustomInput,
    FormText,
    Alert
} from 'reactstrap';
import { Switch } from 'antd';
import 'antd/dist/antd.css'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addOwe } from '../actions/oweActions';
import { clearErrors } from '../actions/errorActions';

class OweModal extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    state = {
        modal: false,
        debtor: '',
        creditor: '',
        checked: true,
        msg: null
    };
    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
        //If authenticated, close modal
        //if (this.state.modal) {
        //    if (isAuthenticated) {
        //        this.toggle();
        //    }
        // }
    }



    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this)
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (e) => {
        if (this.state.checked) {
            this.setState({
                debtor: this.props.user._id,
                creditor: e.target.value
            });
        } else {
            this.setState({
                debtor: e.target.value,
                creditor: this.props.user._id
            });
        }
    };

    FavorChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { favor, debtor, creditor, proof } = this.state;
        const newOwe = {
            favor,
            debtor,
            creditor,
            proof
        };
        this.props.addOwe(newOwe);
        //this.toggle();
    }
    handleChange = (checked) => {
        this.setState({ checked });
        this.setState({
            debtor: this.state.creditor,
            creditor: this.state.debtor
        });
    }

    render() {
        return (
            <div>
                <h4 className="mb-3 ml-4">Your Owe List</h4>
                {this.props.isAuthenticated ? <Button
                    color="dark"
                    style={{ marginBottom: '2rem' }}
                    onClick={this.toggle}
                >Add New Owe
                </Button> : <h4 className="mb-3 ml-4">Please log in to manage your owe list</h4>}

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add New Owe</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (
                            <Alert color='danger'>{this.state.msg}</Alert>
                        ) : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="iam">I am:</Label>
                                <br />
                                <Switch
                                    name="DrCr"
                                    checkedChildren="Debtor"
                                    unCheckedChildren="Creditor"
                                    defaultChecked
                                    checked={this.state.checked}
                                    onChange={this.handleChange} />
                                <br />
                            </FormGroup>
                            <FormGroup>
                                <Label for="to">To:</Label>
                                <Input type="text"
                                    name="to"
                                    id="to"
                                    placeholder="Search Name"
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="favor">Favor</Label>
                                <CustomInput type="select"
                                    name="favor"
                                    id="favor"
                                    onChange={this.FavorChange}>
                                    <option value="">Select</option>
                                    <option>Coffee</option>
                                    <option>Chocolate</option>
                                    <option>Mint</option>
                                    <option>Pizza</option>
                                    <option>Cupcake</option>
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <Label for="proof">Proof</Label>
                                <Input type="file" name="proof" id="proof" />
                                <FormText color="muted">
                                    If you are a creditor, you need to upload evidence
                                </FormText>
                            </FormGroup>
                            <ModalFooter>
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                >Add Owe</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    error: state.error
});


export default connect(mapStateToProps,
    { addOwe, clearErrors })(OweModal);