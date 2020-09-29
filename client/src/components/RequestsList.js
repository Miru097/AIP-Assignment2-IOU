import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Card, Avatar, Col, Row } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { getOwes } from '../actions/oweActions';

class RequestsList extends Component {
    componentDidMount() {
        this.props.getOwes();
    }
    render() {
        const { Meta } = Card;
        var { owes } = this.props.owe;
        return (
            <div className="site-card-wrapper">
                <Row gutter={16}>
                    {owes.map(({ favor, _id }) => (
                        <Col span={8} key={_id}>
                            <Card
                                key={_id}
                                style={{ width: 300 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                }
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    //<EllipsisOutlined key="ellipsis" />,
                                ]}
                            >

                                <Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={favor}
                                    description="This is the description"
                                />
                            </Card>
                        </Col>
                    ))}

                </Row>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
    auth: state.auth,
});
export default connect(mapStateToProps, { getOwes })(RequestsList);