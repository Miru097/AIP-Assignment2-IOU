import React, { Component, Fragment } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,

    FormGroup,
    Label,
    Input,
    ModalFooter,
    CustomInput,
    FormText,
    Alert, Form
} from 'reactstrap';
import { Switch, Select, Upload } from 'antd';
import 'antd/dist/antd.css'
import { UploadOutlined } from '@ant-design/icons';

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
        fileList: [],
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
            fileList: [],
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
        console.log("1")
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
    fileHandleChange = info => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show 1 recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        // fileList = fileList.map(file => {
        //     if (file.response) {
        //         // Component will show file.url as link
        //         file.url = file.response.url;
        //     }
        //     return file;
        // });

        this.setState({ fileList });
    };


    render() {
        var { users } = this.props.users
        if (users.length != 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                users = users.filter(users => users._id !== id)
            }
        }
        const { Option } = Select;
        const normFile = (e) => {
            console.log('Upload event:', e);

            if (Array.isArray(e)) {
                return e;
            }

            return e && e.fileList;
        };
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
                                <Select
                                    showSearch
                                    size="large"
                                    style={{ width: '100%' }}
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

                            <FormGroup>
                                <Label for="proof">Proof</Label>
                                <br />
                                <Upload name="logo"
                                    listType="picture"
                                    fileList={this.state.fileList}
                                    name="proof1"
                                    label="Proof"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    extra="If you are a creditor, you need to upload evidence."
                                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                    onChange={this.fileHandleChange}
                                    accept=".jpg,.png,.bmp,.jpeg"
                                //action="/upload.do"
                                >
                                    <Button type="button" icon={<UploadOutlined />}>Click to upload</Button>
                                </Upload>
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
            </div >

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