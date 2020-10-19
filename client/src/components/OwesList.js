import React, { Component } from 'react';
import { Container, Button, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { getOwes, deleteOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';
import { getUsers } from '../actions/userActions';
import { Image, Modal, List, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { clearErrors } from '../actions/errorActions';


class OwesList extends Component {

    static propTypes = {
        getOwes: PropTypes.func.isRequired,
        owe: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
    }
    componentDidMount() {
        this.props.getOwes();
        this.props.getUsers();
    }
    state = {
        visible: false,
        currentDebtor: null,
        currentOweId: null,
        imageUrl: null,
        fileList: [],
        file: null,
        msg: null
    };
    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'DELETE_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }

    }
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
    showModal = (id, debtor) => {
        this.props.clearErrors();
        this.setState({
            visible: true,
            currentDebtor: debtor,
            currentOweId: id,
            imageUrl: null,
            fileList: [],
            file: null,
            msg: null
        });
    };
    handleOk = e => {
        if (this.state.currentDebtor === this.props.user._id && this.state.imageUrl === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.props.deleteOwe(this.state.currentOweId);
            this.setState({
                visible: false,
            });
            setTimeout(() => {
                if (this.state.msg !== null) {
                    message.error({
                        content: 'This owe is not exist! This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                }
            }, 500)
        }

    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    dummyRequest({ file, onSuccess }) {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
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
    onRemove = (e) => {
        this.setState({
            proof: null,
            imageUrl: null
        })
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        const { Text } = Typography;
        var { owes } = this.props.owe;
        var { users } = this.props.users
        if (users.length !== 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                owes = owes.filter(owes => owes.creditor === id || owes.debtor === id)
                for (let i = 0; i < owes.length; i++) {
                    if (owes[i].creditor === id) {
                        var key1 = "creditorName"
                        var value1 = "you"
                        owes[i][key1] = value1
                        users.map(({ _id, name }) => {
                            if (_id === owes[i].debtor) {
                                var key2 = "debtorName"
                                var value2 = name
                                owes[i][key2] = value2
                            }
                        });
                    } else if (owes[i].debtor === id) {
                        var key4 = "debtorName"
                        var value4 = "you"
                        owes[i][key4] = value4

                        users.map(({ _id, name }) => {
                            if (_id === owes[i].creditor) {
                                var key5 = "creditorName"
                                var value5 = name
                                owes[i][key5] = value5
                            }
                        });
                    }
                    var key3 = "oweDate"
                    var value3 = owes[i].date.toString()
                    value3 = value3.substring(0, 10)
                    owes[i][key3] = value3
                }
            }
        }

        return (
            <Container>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        pageSize: 5,
                    }}
                    dataSource={owes}
                    renderItem={owes => (
                        <List.Item
                            key={owes._id}
                            extra={owes.proof === null ? undefined :
                                <Image
                                    width={200}
                                    alt="Proof"
                                    src={owes.proof}
                                />
                            }
                            actions={[<Button
                                className="remove-btn"
                                outline
                                color="secondary"
                                size="sm"
                                onClick={this.showModal.bind(this, owes._id, owes.debtor)}
                            >Delete this owe</Button>]}
                        >
                            <List.Item.Meta
                                // avatar={ }
                                title={owes.oweDate}
                            //description={owes.debtor}
                            />
                            {(isAuthenticated && owes.debtorName !== undefined && owes.creditorName !== undefined) ? (
                                <Text strong type="default">
                                    {this.firstUpperCase(owes.debtorName)} owes {owes.creditorName} a {owes.favor}
                                </Text>) : null}
                            <Modal
                                title="Delete Owe"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                centered
                                footer={[
                                    <Button key="back" onClick={this.handleCancel}>
                                        Return
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={this.handleOk}>
                                        Submit
                                    </Button>,
                                ]}
                            >
                                <p>Are you sure to delete this owe?</p>
                                {(isAuthenticated && this.props.user._id === this.state.currentDebtor) ?
                                    (<FormGroup><p>Proof: </p>
                                        <Upload
                                            listType="picture"
                                            fileList={this.state.fileList}
                                            name="proof"
                                            id="proof"
                                            label="Proof"
                                            valuePropName="fileList"
                                            customRequest={this.dummyRequest}
                                            onChange={this.fileHandleChange}
                                            beforeUpload={this.beforeUpload}
                                            onRemove={this.onRemove}
                                            accept=".jpg,.png,.jpeg"
                                        >
                                            <Button type="button" icon={<UploadOutlined />}>Click to upload</Button>
                                            <br />
                                            <Text type="secondary">As you are a debtor, you need to upload evidence.
                                         The file should be a image and less than 2MB.</Text>
                                        </Upload>
                                    </FormGroup>
                                    ) : null}
                            </Modal>
                        </List.Item>
                    )}
                />
            </Container>
        );
    }
}


const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
    error: state.error,
    msg: state.error.msg,
});

export default connect(
    mapStateToProps,
    { getOwes, deleteOwe, getUsers, clearErrors }
)(OwesList);