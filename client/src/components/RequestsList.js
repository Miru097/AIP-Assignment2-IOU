import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Card, Col, Row, Image, Button, Pagination, Modal, Form, Select, message } from 'antd';
import { getRequests, acceptRequest, updateRequest } from '../actions/requestActions';
import { getUsers } from '../actions/userActions';
import { clearErrors } from '../actions/errorActions';


class RequestsList extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        clearErrors: PropTypes.func.isRequired,
        acceptRequest: PropTypes.func.isRequired
    };

    state = {
        minValue: 0,
        maxValue: 12,
        numEachPage: 12,
        modalAcceptVisible: false,
        modalUpdateVisible: false
    }
    componentDidMount() {
        this.props.getRequests();
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
        this.setState({
            modalUpdateVisible: true,
            updateId: _id,
            updateFavor: null,
            updateDebtor: null,
            nowFavor: favor,
            nowDebtor: debtor
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
            this.setState({
                favor: [...this.state.nowFavor, this.state.updateFavor],
                debtor: [...this.state.nowDebtor, this.state.updateDebtor],
                modalUpdateVisible: false,
            })
            setTimeout(() => {
                const { favor, debtor } = this.state;
                const updateRequest = { favor, debtor };
                this.props.updateRequest(this.state.updateId, updateRequest)
            }, 100)
        }
    }

    showAcceptModal = (_id) => {
        this.props.clearErrors();
        this.setState({
            modalAcceptVisible: true,
            creditor: null,
            acceptId: _id
        });
    }
    handleAcceptCancel = e => {
        this.setState({
            modalAcceptVisible: false,
        });
    };
    handleAcceptOk = e => {
        this.setState({
            modalAcceptVisible: false,
            creditor: this.props.user._id
        });
        setTimeout(() => {
            const { creditor } = this.state;
            const acceptRequest = { creditor };
            this.props.acceptRequest(this.state.acceptId, acceptRequest)
        }, 100)
    }

    render() {
        const { Option } = Select;
        const { Meta } = Card;
        var { requests } = this.props.request;
        var { users } = this.props.users
        requests = requests.filter(requests => requests.creditor === null)
        if (requests.length > 0) {
            if (users.length !== 0) {
                for (let i = 0; i < requests.length; i++) {
                    var value = []
                    for (let j = 0; j < requests[i].favor.length; j++) {
                        users.map(({ _id, name }) => {
                            if (_id === requests[i].debtor[j]) {
                                var key = "debtorName"
                                value.push(name)
                                requests[i][key] = value
                            }
                        });
                    }
                }
            }
            console.log(requests)
        }

        return (
            <div className="container">
                <Row gutter={[16, 16]}>
                    {
                        requests &&
                        requests.length > 0 &&
                        requests.slice(this.state.minValue, this.state.maxValue)
                            .map(({ description, favor, _id, proof, debtor, debtorName }) => (
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
                                                key="update"
                                                disabled={this.props.isAuthenticated ? false : true}
                                                onClick={this.showUpdateModal.bind(this, _id, favor, debtor)}
                                            >
                                                Update
                                        </Button>,
                                            <Button
                                                type="default"
                                                shape="round"
                                                key="accept"
                                                disabled={this.props.isAuthenticated ? false : true}
                                                onClick={this.showAcceptModal.bind(this, _id)}
                                            >
                                                Accept
                                        </Button>,
                                        ]}
                                    >
                                        <Meta
                                            title={this.firstUpperCase(description)}
                                            description={"This is the description" + favor}
                                        />
                                        {favor[0] === undefined ? null : <p>{debtorName[0]} will give you a {favor[0]}.</p>}
                                        {favor.length > 1 ? <p>And more...</p> : null}
                                        {favor[1] === undefined ? null : <p>{debtorName[1]} will give you a {favor[1]}.</p>}
                                        {favor[2] === undefined ? null : <p>{debtorName[2]} will give you a {favor[2]}.</p>}
                                        {favor[3] === undefined ? null : <p>{debtorName[3]} will give you a {favor[3]}.</p>}
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
});
export default connect(mapStateToProps, { getRequests, getUsers, clearErrors, acceptRequest, updateRequest })(RequestsList);