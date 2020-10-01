import React, { Component } from 'react';
import { Container, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import {
    Card, Col, Row, Image, Button, Pagination,
    Modal, Form, Select, message, Typography, Space, Upload
} from 'antd';


class TasksLists extends Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool
    }
    componentDidMount() {
    }
    state = {
        visible: false,
        currentDebtor: null,
        currentOweId: null,
        imageUrl: null,
        fileList: [],
        file: null
    };
    // onDeleteClick = (id) => {
    //     this.props.deleteOwe(id);
    // }
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
    showModal = (id, debtor) => {
        this.setState({
            visible: true,
            currentDebtor: debtor,
            currentOweId: id,
            imageUrl: null,
            fileList: [],
            file: null
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
                                            //onClick={this.showCompeleteModal.bind(this, _id, favor, debtor)}
                                            >
                                                Complete
                                            </Button>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="cancel"
                                            //onClick={this.showCancelModal.bind(this, _id)}
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
                    title="Update this request"
                    centered
                    visible={this.state.modalUpdateVisible}
                    onOk={this.handleUpdateOk}
                    onCancel={this.handleUpdateCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back"
                            onClick={this.handleUpdateCancel}
                        >
                            Return</Button>,
                        <Button key="updateFavor" type="default"
                            onClick={this.handleUpdateOk}
                        >
                            Update</Button>,
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="updateRequest"
                    >
                        <Form.Item label="What favor do you want to add:">
                            <Select
                                placeholder="Select"
                                onChange={this.updateFavor}
                                name="favorSelect"
                            //allowClear
                            >
                                <Option value="Coffee">Coffee</Option>
                                <Option value="Chocolate">Chocolate</Option>
                                <Option value="Mint">Mint</Option>
                                <Option value="Pizza">Pizza</Option>
                                <Option value="Cupcake">Cupcake</Option>
                            </Select>
                            <Text type="secondary">There are up to five favors for one request.</Text>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Accept this request"
                    centered
                    visible={this.state.modalAcceptVisible}
                    onOk={this.handleAcceptOk}
                    onCancel={this.handleAcceptCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back" onClick={this.handleAcceptCancel}>
                            Return</Button>,
                        <Button key="acceptAgain" type="default" onClick={this.handleAcceptOk}>
                            Accept</Button>,
                    ]}
                >
                    <p>Are you sure to accept this request?</p>
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
    {}
)(TasksLists);