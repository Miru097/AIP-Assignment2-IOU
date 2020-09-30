import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Select, Upload, message, Typography, Modal, Form, Input, Row } from 'antd';
import 'antd/dist/antd.css'
import { UploadOutlined } from '@ant-design/icons';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addRequest } from '../actions/requestActions';
import { clearErrors } from '../actions/errorActions';


class RequestModal extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        clearErrors: PropTypes.func.isRequired,
    };
    state = {
        visible: false,
        debtor: [],
        creditor: null,
        fileList: [],
        users: [],
        favor: [],
        description: null
    };
    showModal = () => {
        this.props.clearErrors();
        this.setState({
            visible: true,
            debtor: [this.props.user._id],
            favor: [],
            creditor: null,
            description: null,
            proof: null,
            fileList: []
        });
    };
    handleOk = (e) => {
        e.preventDefault();
        if (this.state.description === null || this.state.favor.length === 0) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            const { description, favor,
                debtor, creditor, proof
            } = this.state;
            const newRequest = {
                description,
                favor,
                debtor,
                creditor,
                proof
            };
            this.props.addRequest(newRequest);
            this.setState({
                visible: false,
            });
        }

    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    DescriptionChange = (e) => {
        this.setState({ description: e.target.value });
    }
    FavorChange = (e) => {
        this.setState({ favor: [e] });
    }
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
                message.error({ content: 'You can only upload JPG/PNG file!' });
                reject(file);
            } else if (!isLt2M) {
                message.error({ content: 'Image must smaller than 2MB!' });
            }
            else {
                resolve(file);
            }
        });
    }
    fileHandleChange = (e) => {
        let fileList = [...e.fileList];
        fileList = fileList.slice(-1);
        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        this.setState({ fileList });
    };
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
            this.setState({ imageUrl: reader.result })
        );
        reader.readAsDataURL(img);
    };
    render() {
        const { Option } = Select;
        const { Text } = Typography;
        return (
            <div>
                <Row>
                    {this.props.isAuthenticated ? <Button
                        color="dark"
                        style={{ marginBottom: '2rem' }}
                        onClick={this.showModal}
                    >Add New Request
                </Button> : null}
                    <Modal
                        title="Add New Request"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        destroyOnClose
                        centered
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Return</Button>,
                            <Button key="submit" type="primary" onClick={this.handleOk}>
                                Submit</Button>,
                        ]}
                    >
                        <Form
                            layout="vertical"
                            name="addRequest"
                        >
                            <Form.Item label="Description:">
                                <Input placeholder="Your request description"
                                    name="description"
                                    onChange={this.DescriptionChange} />
                            </Form.Item>
                            <Form.Item label="Favor:">
                                <Select
                                    placeholder="Select"
                                    onChange={this.FavorChange}
                                    name="favorSelect"
                                //allowClear
                                >
                                    <Option value="Coffee">Coffee</Option>
                                    <Option value="Chocolate">Chocolate</Option>
                                    <Option value="Mint">Mint</Option>
                                    <Option value="Pizza">Pizza</Option>
                                    <Option value="Cupcake">Cupcake</Option>
                                </Select>
                                <Text type="secondary">You can add more favors after first submission with update button.</Text>
                            </Form.Item>
                            <p>Photo: </p>
                            <Upload
                                listType="picture"
                                fileList={this.state.fileList}
                                name="photo"
                                id="photo"
                                label="photo"
                                valuePropName="fileList"
                                customRequest={this.dummyRequest}
                                onChange={this.fileHandleChange}
                                beforeUpload={this.beforeUpload}
                                onRemove={this.onRemove}
                                accept=".jpg,.png,.jpeg"
                            >
                                <Button type="button" icon={<UploadOutlined />}>Click to upload</Button>
                                <br />
                                <Text type="secondary">You can upload a proof to show details.</Text>
                            </Upload>
                        </Form>
                    </Modal>
                </Row>
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    request: state.request,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    users: state.user
});
export default connect(mapStateToProps,
    { addRequest, clearErrors })(RequestModal);