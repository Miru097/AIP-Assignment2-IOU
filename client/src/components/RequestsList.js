import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {
    Card, Col, Row, Image, Button, Pagination, Popover, Dropdown,
    Modal, Form, Select, message, Typography, Space, Menu,
} from 'antd';
import { getRequests, acceptRequest, updateRequest, deleteRequest, checkRequest, clearCheckRequest } from '../actions/requestActions';
import { getUsers } from '../actions/userActions';
import { clearErrors } from '../actions/errorActions';
import { DownOutlined } from '@ant-design/icons';

class RequestsList extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        clearErrors: PropTypes.func.isRequired,
        acceptRequest: PropTypes.func.isRequired,
        updateRequest: PropTypes.func.isRequired,
        deleteRequest: PropTypes.func.isRequired,
        checkRequest: PropTypes.func.isRequired
    };

    state = {
        minValue: 0,
        maxValue: 12,
        numEachPage: 12,
        modalAcceptVisible: false,
        modalUpdateVisible: false,
        modalDeleteVisible: false,
        updateDisabled: true,
        searchKey: null,
        deleteId: null,
        msg: null
    }
    componentDidMount() {
        this.props.getRequests();
    }
    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CHECK_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }

    }
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
    pageHandleChange = (e) => {
        this.setState({
            minValue: (e - 1) * this.state.numEachPage,
            maxValue: e * this.state.numEachPage
        });
    }
    showUpdateModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.props.clearCheckRequest();
        this.setState({
            modalUpdateVisible: true,
            updateId: _id,
            updateFavor: null,
            updateDebtor: null,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
        });
    }
    handleUpdateCancel = e => {
        this.setState({
            modalUpdateVisible: false,
            favor: this.state.nowFavor,
            debtor: this.state.nowDebtor
        });
    };
    updateFavor = (e) => {
        this.setState({
            updateFavor: e,
            updateDebtor: this.props.user._id
        });
    }
    handleUpdateOk = () => {
        if (this.state.updateFavor === null || this.state.updateDebtor === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.props.checkRequest(this.state.updateId)
            this.setState({
                modalUpdateVisible: false,
            });
            setTimeout(() => {
                if (this.state.msg !== null || this.props.checkedRequest === null) {
                    message.error({
                        content: 'This request or authentication has content changed! This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                } else {
                    if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                        && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                        && this.props.checkedRequest.creditor === null) {
                        this.setState({
                            favor: [...this.state.nowFavor, this.state.updateFavor],
                            debtor: [...this.state.nowDebtor, this.state.updateDebtor],
                        })
                        setTimeout(() => {
                            const { favor, debtor } = this.state;
                            const updateRequest = { favor, debtor };
                            this.props.updateRequest(this.state.updateId, updateRequest)
                        }, 100)
                        setTimeout(() => {
                            window.location.reload()
                        }, 300);
                    } else {
                        message.error({
                            content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                        }, 3);
                        setTimeout(() => {
                            {
                                window.location.reload()
                            }
                        }, 3000)
                    }
                }
            }, 500)
        }
    }
    showDeleteModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.props.clearCheckRequest();
        this.setState({
            modalDeleteVisible: true,
            deleteId: _id,
            deleteFavor: null,
            deleteDebtor: null,
            deleteKey: null,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
        });
    }
    handleDeleteCancel = e => {
        this.setState({
            modalDeleteVisible: false,
            deleteId: null,
            favor: this.state.nowFavor,
            debtor: this.state.nowDebtor
        });
    };
    deleteFavor = (value, key) => {
        this.setState({
            deleteFavor: value,
            deleteDebtor: this.props.user._id,
            deleteKey: key.key
        })

    }
    handleDeleteOk = () => {
        if (this.state.deleteFavor === null || this.state.deleteDebtor === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            this.props.checkRequest(this.state.deleteId)
            this.setState({
                modalUpdateVisible: false,
            });
            setTimeout(() => {
                if (this.state.msg !== null || this.props.checkedRequest === null) {
                    message.error({
                        content: 'This request or authentication has content changed! This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                } else {
                    if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                        && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                        && this.props.checkedRequest.creditor === null) {
                        this.state.nowFavor.splice(this.state.deleteKey, 1)
                        this.state.nowDebtor.splice(this.state.deleteKey, 1)
                        this.setState({
                            favor: this.state.nowFavor,
                            debtor: this.state.nowDebtor,
                        })
                        setTimeout(() => {
                            if (this.state.favor.length > 0) {
                                const { favor, debtor } = this.state;
                                const updateRequest = { favor, debtor };
                                this.props.updateRequest(this.state.deleteId, updateRequest)
                            } else {
                                this.props.deleteRequest(this.state.deleteId);
                            }
                        }, 100)
                        setTimeout(() => {
                            window.location.reload()
                        }, 300);
                    } else {
                        message.error({
                            content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                        }, 3);
                        setTimeout(() => {
                            {
                                window.location.reload()
                            }
                        }, 3000)
                    }
                }
            }, 500)
        }
    }
    showAcceptModal = (_id, favor, debtor) => {
        this.props.clearErrors();
        this.props.clearCheckRequest();
        this.setState({
            modalAcceptVisible: true,
            creditor: null,
            acceptId: _id,
            acceptDebtor: debtor,
            nowFavor: favor,
            nowDebtor: debtor,
            msg: null
        });

    }
    handleAcceptCancel = e => {
        this.setState({
            modalAcceptVisible: false,
        });
    };
    handleAcceptOk = e => {
        for (let index = 0; index < this.state.acceptDebtor.length; index++) {
            if (this.state.acceptDebtor[index] === this.props.user._id) {
                message.error({
                    content: 'You cannot accept your request!'
                });
                return
            }
        }
        this.setState({
            modalAcceptVisible: false,
            creditor: this.props.user._id
        });
        this.props.checkRequest(this.state.acceptId)
        this.setState({
            modalUpdateVisible: false,
        });
        setTimeout(() => {
            if (this.state.msg !== null || this.props.checkedRequest === null) {
                message.error({
                    content: 'This request or authentication  has content changed! This page will refresh in 3 seconds!'
                }, 3);
                setTimeout(() => {
                    {
                        window.location.reload()
                    }
                }, 3000)
            } else {
                if (JSON.stringify(this.state.nowFavor) === JSON.stringify(this.props.checkedRequest.favor)
                    && JSON.stringify(this.state.nowDebtor) === JSON.stringify(this.props.checkedRequest.debtor)
                    && this.props.checkedRequest.creditor === null) {
                    setTimeout(() => {
                        const { creditor } = this.state;
                        const acceptRequest = { creditor };
                        this.props.acceptRequest(this.state.acceptId, acceptRequest)
                    }, 100)
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 300)
                } else {
                    message.error({
                        content: 'This request has content changed! Please refresh to check the latest content！This page will refresh in 3 seconds!'
                    }, 3);
                    setTimeout(() => {
                        {
                            window.location.reload()
                        }
                    }, 3000)
                }
            }
        }, 500)
    }
    onClick = ({ key }) => {
        if (key === "All") {
            this.setState({ searchKey: null })
        } else {
            this.setState({ searchKey: key })
        }
    }
    render() {
        const { Text, Paragraph } = Typography;
        const { Option } = Select;
        const { Meta } = Card;
        var { requests } = this.props.request;
        var { users } = this.props.users
        requests = requests.filter(requests => requests.creditor === null)
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
                        })
                    }
                }
            }
        }
        if (this.state.searchKey !== null) { requests = requests.filter(requests => requests.favor.includes(this.state.searchKey)) }
        const menu = (
            <Menu onClick={this.onClick}>
                <Menu.Item key="All">All</Menu.Item>
                <Menu.Item key="Coffee">Coffee</Menu.Item>
                <Menu.Item key="Chocolate">Chocolate</Menu.Item>
                <Menu.Item key="Mint">Mint</Menu.Item>
                <Menu.Item key="Pizza">Pizza</Menu.Item>
                <Menu.Item key="Cupcake">Cupcake</Menu.Item>
            </Menu >
        );

        return (
            <div className="container">
                <Space direction="vertical">
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link"
                            onClick={e => e.preventDefault()}
                        >
                            Search request by favor <DownOutlined />
                        </a>
                    </Dropdown>
                    <br />
                </Space>
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
                                            <Popover content="There are up to five favors for one request." placement="bottom" trigger="hover">
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    key="update"
                                                    disabled={this.props.isAuthenticated && favor.length < 5 ? false : true}
                                                    onClick={this.showUpdateModal.bind(this, _id, favor, debtor)}
                                                >
                                                    Add
                                                </Button>
                                            </Popover>,
                                            <Popover content="You can only delete favors you added." placement="bottom" trigger="hover">
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    key="delete"
                                                    disabled={this.props.isAuthenticated && debtor.includes(this.props.user._id) ? false : true}
                                                    onClick={this.showDeleteModal.bind(this, _id, favor, debtor)}
                                                >
                                                    Delete
                                            </Button>
                                            </Popover>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="accept"
                                                disabled={(this.props.isAuthenticated) ? false : true}
                                                onClick={this.showAcceptModal.bind(this, _id, favor, debtor)}
                                            >
                                                Accept
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
                            Add</Button>,
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
                    title="Update this request"
                    centered
                    visible={this.state.modalDeleteVisible}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleDeleteCancel}
                    destroyOnClose
                    footer={[
                        <Button key="back"
                            onClick={this.handleDeleteCancel}
                        >
                            Return</Button>,
                        <Button key="deleteFavor" type="default"
                            onClick={this.handleDeleteOk}
                        >
                            Delete</Button>
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="deleteRequest"
                    >

                        <Form.Item label="Which favor do you want to delete:">
                            {requests.filter(requests => requests._id == this.state.deleteId)
                                .map(({ favor, _id, debtor }) => (
                                    <Select
                                        placeholder="Select"
                                        onChange={this.deleteFavor}
                                        name="favorSelect"
                                        key={_id}
                                    //allowClear
                                    >
                                        {debtor[0] === this.props.user._id && favor[0] ? <Option value={favor[0]} key="0">{favor[0]}</Option> : null}
                                        {debtor[1] === this.props.user._id && favor[1] ? <Option value={favor[1]} key="1">{favor[1]}</Option> : null}
                                        {debtor[2] === this.props.user._id && favor[2] ? <Option value={favor[2]} key="2">{favor[2]}</Option> : null}
                                        {debtor[3] === this.props.user._id && favor[3] ? <Option value={favor[3]} key="3">{favor[3]}</Option> : null}
                                        {debtor[4] === this.props.user._id && favor[4] ? <Option value={favor[4]} key="4">{favor[4]}</Option> : null}
                                    </Select>
                                ))}
                            <Text type="secondary">You can only delete the favors you added, if there is no favor in the request, request will be deleted automatically</Text>
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
    request: state.request,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
    error: state.error,
    requestContent: state.request.requests,
    checkedRequest: state.request.checkRequest
});
export default connect(mapStateToProps,
    {
        getRequests, getUsers, clearErrors, acceptRequest,
        updateRequest, deleteRequest, checkRequest, clearCheckRequest
    })(RequestsList);