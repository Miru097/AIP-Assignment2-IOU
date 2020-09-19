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
    FormText
} from 'reactstrap';
import { connect } from 'react-redux';
import { addOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import 'antd/dist/antd.css'



class OweModal extends Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool,
    };

    state = {
        modal: false,
        debtor: ''
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
        const { favor, debtor, creditor, proof } = this.state;
        const newOwe = {
            favor,
            debtor,
            creditor,
            proof
        };
        this.props.addOwe(newOwe);
        this.toggle();
    }


    /*
    onSubmit = (e) => {
        e.preventDefault();

        const newOwe = {
            name: this.state.name
        }
        this.props.addOwe(newOwe);
        this.toggle();
    }
    */

    render() {
        if (this.props.isAuthenticated) {
            const { id } = this.props.user._id
        }
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
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="iam">I am:</Label>
                                <br />
                                <Switch checkedChildren="Debtor" unCheckedChildren="Creditor" defaultChecked />
                                <br />
                            </FormGroup>
                            <FormGroup>
                                <Label for="with">To:</Label>
                                <Input type="text"
                                    name="favor"
                                    id="owe"
                                    placeholder="Search Name"
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="favor">Favor</Label>
                                <CustomInput type="select"
                                    name="favor"
                                    id="favor"
                                    onChange={this.onChange}>
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


                            {/*
                            <FormGroup>

                               
                                <Label for="owe">Owe</Label>
                                <Input type="text"
                                    name="favor"
                                    id="owe"
                                    placeholder="Add description"
                                    onChange={this.onChange}
                                />
                                <Label for="owe">Owe</Label>
                                <Input type="text"
                                    name="name"
                                    id="owe"
                                    placeholder="Add description"
                                    onChange={this.onChange}
                                />
                                <Label for="owe">Owe</Label>
                                <Input type="text"
                                    name="name"
                                    id="owe"
                                    placeholder="Add description"
                                    onChange={this.onChange}
                                />
                                <Label for="owe">Owe</Label>
                                <Input type="text"
                                    name="name"
                                    id="owe"
                                    placeholder="Add description"
                                    onChange={this.onChange}
                                />
                                </FormGroup>
                                */}

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
    user: state.auth.user
});


export default connect(mapStateToProps,
    { addOwe })(OweModal);