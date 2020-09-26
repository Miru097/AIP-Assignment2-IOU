import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getOwes, deleteOwe } from '../actions/oweActions';
import PropTypes from 'prop-types';
import { getUsers } from '../actions/userActions';
import { Image } from 'antd';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';



class OwesList extends Component {

    static propTypes = {
        getOwes: PropTypes.func.isRequired,
        owe: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
    }

    componentDidMount() {
        this.props.getOwes();
        this.props.getUsers();
    }

    onDeleteClick = (id) => {
        this.props.deleteOwe(id);
    }

    render() {
        //const { owes } = this.props.owe;
        var { owes } = this.props.owe;
        var { users } = this.props.users
        if (users.length !== 0) {
            if (this.props.user != null) {
                const id = this.props.user._id
                owes = owes.filter(owes => owes.creditor === id)
            }
        }
        console.log(owes)
        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                href: 'https://ant.design',
                title: `ant design part ${i}`,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description:
                    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
                content:
                    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }
        return (
            <Container>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 5,
                    }}
                    dataSource={owes}
                    footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
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
                        >
                            <List.Item.Meta
                                avatar={<Button
                                    className="remove-btn"
                                    color="danger"
                                    size="sm"
                                    onClick={this.onDeleteClick.bind(this, owes._id)}
                                >&times;</Button>}
                                //title={<a href={item.href}>{item.title}</a>}
                                title={owes.favor}
                            //description={item.description}
                            />
                            {owes.favor}
                        </List.Item>
                    )}
                />





                {/* <ListGroup>
                    <TransitionGroup className="owe-List">
                        {owes.map(({ _id, favor, creditor, debtor, proof }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    {this.props.isAuthenticated ? <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                    >&times;</Button> : ''}
                                    {favor}{creditor}{debtor}
                                    <Image
                                        width={200}
                                        src={proof}
                                    />
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup> */}
            </Container>
        );
    }
}



const mapStateToProps = (state) => ({
    owe: state.owe,
    isAuthenticated: state.auth.isAuthenticated,
    users: state.user,
    user: state.auth.user,
});

export default connect(
    mapStateToProps,
    { getOwes, deleteOwe, getUsers }
)(OwesList);