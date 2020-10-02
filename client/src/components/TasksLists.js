import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import {
    Card, Col, Row, Image, Button, Pagination,
    Modal, Form, Select, message, Typography, Space, Upload
} from 'antd';

import { acceptRequest } from '../actions/requestActions';
import { addOwe } from '../actions/oweActions';


class TasksLists extends Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        addOwe: PropTypes.func.isRequired
    }

    state = {
        modalCancelVisible: false,
        modalCompleteVisible: false
    };
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }

    showCompleteModal = (_id, favor, debtor) => {
        this.setState({
            modalCompleteVisible: true,
            CompleteId: _id,
            CompleteFavor: null,
            CompleteDebtor: null,
            nowFavor: favor,
            nowDebtor: debtor,
        });
    }
    handleCompleteCancel = e => {
        this.setState({
            modalCompleteVisible: false,
            favor: this.state.nowFavor,
            debtor: this.state.nowDebtor
        });
    };
    CompleteFavor = (e) => {
        this.setState({
            CompleteFavor: e,
            CompleteDebtor: this.props.user._id
        });
    }
    handleCompleteOk = () => {
        if (this.state.CompleteFavor === null || this.state.CompleteDebtor === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.setState({
                favor: [...this.state.nowFavor, this.state.CompleteFavor],
                debtor: [...this.state.nowDebtor, this.state.CompleteDebtor],
                modalCompleteVisible: false,
            })
            setTimeout(() => {
                const { favor, debtor } = this.state;
                const CompleteRequest = { favor, debtor };
                this.props.CompleteRequest(this.state.CompleteId, CompleteRequest)
            }, 100)
            setTimeout(() => {
                window.location.reload()
            }, 300);
        }
    }

    showCancelModal = (_id) => {
        this.setState({
            modalCancelVisible: true,
            creditor: null,
            cancelId: _id,
        });
    }
    handleCancelCancel = e => {
        this.setState({
            modalCancelVisible: false,
        });
    };
    handleCancelOk = e => {
        this.setState({
            modalCancelVisible: false
        });
        setTimeout(() => {
            const { creditor } = this.state;
            const cancelRequest = { creditor };
            this.props.acceptRequest(this.state.cancelId, cancelRequest)
        }, 100)
    }
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
        const { Text, Paragraph } = Typography;
        const { Option } = Select;
        const { Meta } = Card;
        var { requests } = this.props.request;
        var { users } = this.props.users
        if (users.length !== 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                requests = requests.filter(requests => requests.creditor === id)
            }
        }
        if (requests.length !== 0) {
            if (users.length !== 0) {
                for (let i = 0; i < requests.length; i++) {
                    var value1 = []
                    var value2 = []
                    for (let j = 0; j < requests[i].favor.length; j++) {
                        users.map(({ _id, name }) => {
                            if (_id === requests[i].debtor[j]) {
                                var key1 = "debtorName"
                                value1.push(name)
                                requests[i][key1] = value1
                                var key2 = "content"
                                value2.push(this.firstUpperCase(name) + " will give you a " + requests[i].favor[j])
                                requests[i][key2] = value2
                            }
                        });
                    }
                }

            }
        }

        return (
            <div className="container">
                <Row gutter={[16, 16]}>
                    {
                        requests &&
                        requests.length > 0 &&
                        requests.slice(this.state.minValue, this.state.maxValue)
                            .map(({ description, favor, _id, proof, debtor, debtorName, content }) => (
                                <Col
                                    xs={{ span: 16, offset: 1 }}
                                    sm={{ span: 12, offset: 1 }}
                                    lg={{ span: 8, offset: 1 }}
                                    xl={{ span: 6, offset: 1 }}
                                    xxl={{ span: 6, offset: 1 }}
                                    key={_id}
                                >
                                    <Card
                                        hoverable
                                        bordered
                                        key={_id}
                                        style={{ width: 300 }}
                                        cover={
                                            {
                                                ...proof === null ? <Image
                                                    alt="Proof"
                                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                                /> : <Image
                                                        //placeholder
                                                        width={300}
                                                        alt="Proof"
                                                        src={proof}
                                                    />
                                            }
                                        }
                                        actions={[
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="complete"
                                                onClick={this.showCompleteModal.bind(this, _id, favor, debtor)}
                                            >
                                                Complete
                                            </Button>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="cancel"
                                                onClick={this.showCancelModal.bind(this, _id)}
                                            >
                                                Cancel
                                        </Button>,
                                        ]}
                                    >
                                        <Meta
                                            title={this.firstUpperCase(description)}
                                        //description={"This is the description" + favor}
                                        />
                                        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'And more...' }}>
                                            <Space direction="vertical">
                                                {content}
                                            </Space>
                                        </Paragraph>
                                    </Card>
                                </Col>
                            ))}
                </Row>
                <Pagination
                    defaultCurrent={1}
                    defaultPageSize={this.state.numEachPage}
                    onChange={this.pageHandleChange}
                    total={requests.length}
                    showTotal={total => `Total ${total} requests`}
                />
                <Modal
                    title="Complete this request"
                    centered
                    visible={this.state.modalCompleteVisible}
                    onOk={this.handleCompleteOk}
                    onCancel={this.handleCompleteCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back"
                            onClick={this.handleCompleteCancel}
                        >
                            Return</Button>,
                        <Button key="completeFavor" type="default"
                            onClick={this.handleCompleteOk}
                        >
                            Complete</Button>,
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="completeRequest"
                    >

                    </Form>
                </Modal>
                <Modal
                    title="Cancel this request"
                    centered
                    visible={this.state.modalCancelVisible}
                    onOk={this.handleCancelOk}
                    onCancel={this.handleCancelCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back" onClick={this.handleCancelCancel}>
                            Return</Button>,
                        <Button key="acceptAgain" type="default" onClick={this.handleCancelOk}>
                            Cancel</Button>,
                    ]}
                >
                    <p>Are you sure to cancel this request?</p>
                </Modal>
            </div >
        )
    }
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
    request: state.request,
});

export default connect(
    mapStateToProps,
    { acceptRequest, addOwe }
)(TasksLists);