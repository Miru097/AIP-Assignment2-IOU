import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    ModalFooter,
    CustomInput,
    Alert
} from 'reactstrap';
import { Switch, Select, Upload, message } from 'antd';
import 'antd/dist/antd.css'
import { UploadOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

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
        users: []
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
            proof: null,
            imageUrl: null
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
                debtor: e,
                creditor: this.props.user._id
            });
        }
    };
    FavorChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = async (e) => {
        this.props.clearErrors();
        e.preventDefault();
        const { favor, debtor, creditor, proof, checked } = this.state;
        const newOwe = {
            favor,
            debtor,
            creditor,
            proof,
            checked
        };
        try {
            await this.props.addOwe(newOwe);
            this.toggleclose();
        } catch (err) {
            return
        }
    }
    handleChange = (checked) => {
        this.setState({ checked });
        this.setState({
            debtor: this.state.creditor,
            creditor: this.state.debtor,
            fileList: null,
            proof: null
        });
    }
    fileHandleChange = (e) => {
        let fileList = [...e.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        this.setState({ fileList });
    };
    dummyRequest({ file, onSuccess }) {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }
    onRemove = (e) => {
        this.setState({
            proof: null
        })
    }

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (isJpgOrPng && isLt2M) {
            this.getBase64(file, imageUrl => this.setState({ imageUrl }));
            setTimeout(() => {
                this.setState({ proof: this.state.imageUrl })
                return false;
            }, 300)
        }
        return new Promise((resolve, reject) => {
            if (!isJpgOrPng) {
                message.error({
                    content: 'You can only upload JPG/PNG file!',
                    className: 'custom-class',
                    style: {
                        zIndex: '1100'
                    },
                });
                reject(file);
            } else if (!isLt2M) {
                message.error({
                    content: 'Image must smaller than 2MB!',
                    className: 'custom-class',
                    style: {
                        zIndex: '1100'
                    },
                });
            }
            else {
                resolve(file);
            }
        });
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
            this.setState({ imageUrl: reader.result })
        );
        reader.readAsDataURL(img);
    };


    render() {
        var { users } = this.props.users
        if (users.length !== 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                users = users.filter(users => users._id !== id)
            }
        }
        const { Option } = Select;
        const { Text } = Typography;
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
                    centered={true}
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
                                null :
                                (<FormGroup><Label for="proofLabel">Proof</Label>
                                    <br />
                                    <Upload
                                        listType="picture"
                                        fileList={this.state.fileList}
                                        name="proof"
                                        id="proof"
                                        label="Proof"
                                        valuePropName="fileList"
                                        //getValueFromEvent={normFile}
                                        extra="If you are a creditor, you need to upload evidence."
                                        customRequest={this.dummyRequest}
                                        onChange={this.fileHandleChange}
                                        beforeUpload={this.beforeUpload}
                                        onRemove={this.onRemove}
                                        accept=".jpg,.png,.jpeg"
                                    >
                                        <Button type="button" icon={<UploadOutlined />}>Click to upload</Button>
                                        <br />
                                        <Text type="secondary">If you are a creditor, you need to upload evidence.
                                         The file should be a image and less than 2MB.</Text>
                                    </Upload>

                                </FormGroup>)}
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


