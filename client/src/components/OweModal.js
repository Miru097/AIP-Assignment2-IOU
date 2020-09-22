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
    Alert,
    ListGroupItem
} from 'reactstrap';
import { Switch, Select } from 'antd';
import 'antd/dist/antd.css'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addOwe } from '../actions/oweActions';
import { clearErrors } from '../actions/errorActions';
import { getUsers } from '../actions/userActions';

class OweModal extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        getUsers: PropTypes.func.isRequired,
    };
    state = {
        modal: false,
        debtor: '',
        creditor: '',
        checked: true,
        msg: null,
    };
    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    }
    componentDidMount() {
        this.props.getUsers();
    }

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this)
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal,
            debtor: null,
            creditor: null,
            favor: null,
            checked: true,
        });
    };
    toggleclose = () => {
        this.props.clearErrors();
        this.setState({
            modal: false,
            debtor: null,
            creditor: null,
            favor: null,
            checked: true,
        });
    }
    onChange = (e) => {
        if (this.state.checked) {
            this.setState({
                debtor: this.props.user._id,
                creditor: e
            });
        } else {
            this.setState({
                //debtor: e.target.value,
                creditor: this.props.user._id
            });
        }
    };

    FavorChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { favor, debtor, creditor, proof, checked } = this.state;
        const newOwe = {
            favor,
            debtor,
            creditor,
            proof,
            checked
        };
        this.props.addOwe(newOwe);
        //this.toggleclose();
    }
    handleChange = (checked) => {
        this.setState({ checked });
        this.setState({
            debtor: this.state.creditor,
            creditor: this.state.debtor
        });
    }


    render() {
        var { users } = this.props.users
        if (users.length != 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                users = users.filter(users => users._id !== id)
            }
        }
        const { Option } = Select;
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
                    toggle={this.toggle}
                >
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
                                {/*<Input type="text"
                                    name="to"
                                    id="to"
                                    placeholder="Search Name"
                                    onChange={this.onChange}
                        />*/}

                                <Select
                                    showSearch
                                    style={{ width: 400 }}
                                    name="to"
                                    id="to"
                                    placeholder="Search Name"
                                    optionFilterProp="children"
                                    onChange={this.onChange}
                                    //onFocus={onFocus}
                                    //onBlur={onBlur}
                                    //onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.info.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {users.map(({ _id, name, email }) => (
                                        <Option info={name + email} value={_id} key={_id}>{name} ({email})</Option>
                                    ))}

                                </Select>

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
                            {this.state.checked ?
                                null
                                : (<FormGroup>
                                    <Label for="proof">Proof</Label>
                                    <Input type="file" name="proof" id="proof" />
                                    <FormText color="muted">
                                        If you are a creditor, you need to upload evidence.
                            </FormText>
                                </FormGroup>)}

                            <ModalFooter>
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                >Add Owe</Button>
                            </ModalFooter>
                        </Form>
                        {/*
                        <TransitionGroup className="owe-List">
                            {users.map(({ _id, name, email }) => (
                                <CSSTransition key={_id} timeout={500} classNames="fade">
                                    <ListGroupItem>
                                        {name}({email})
                                    </ListGroupItem>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                        */}
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
    error: state.error,
    msg: state.error.msg,
    users: state.user
});


export default connect(mapStateToProps,
    { addOwe, clearErrors, getUsers })(OweModal);