import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import {
    Card, Col, Row, Image, Button, Pagination,
    Modal, Form, message, Typography, Space, Upload
} from 'antd';

import { acceptRequest, deleteRequest } from '../actions/requestActions';
import { addOwe } from '../actions/oweActions';
import { FormGroup } from 'reactstrap';


class TasksLists extends Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        addOwe: PropTypes.func.isRequired,
        deleteRequest: PropTypes.func.isRequired,
    }

    state = {
        modalCancelVisible: false,
        modalCompleteVisible: false,
        CompleteFavor: [],
        CompleteDebtor: [],
        proof: null,
        imageUrl: null,
        fileList: [],
        CompleteCreditor: null
    };
    firstUpperCase = (str) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }

    showCompleteModal = (_id, favor, debtor) => {
        this.setState({
            modalCompleteVisible: true,
            CompleteId: _id,
            CompleteFavor: favor,
            CompleteDebtor: debtor,
            proof: null,
            imageUrl: null,
            fileList: [],
            CompleteCreditor: this.props.user._id
        });
    }
    handleCompleteCancel = e => {
        this.setState({
            modalCompleteVisible: false,
        });
    };

    handleCompleteOk = () => {
        if (this.state.proof === null) {
            message.error({
                content: 'Please enter all fields'
            });
            return
        } else {
            for (let index = 0; index < this.state.CompleteFavor.length; index++) {
                const favor = this.state.CompleteFavor[index]
                const debtor = this.state.CompleteDebtor[index]
                const creditor = this.state.CompleteCreditor
                const proof = this.state.proof
                const newOwe = {
                    favor,
                    debtor,
                    creditor,
                    proof
                };
                setTimeout(() => {
                    this.props.addOwe(newOwe);
                }, 500)
            }
            this.props.deleteRequest(this.state.CompleteId)
            this.setState({
                modalCompleteVisible: false,
            });
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
    handleCancelOk = async (e) => {
        const { creditor } = this.state;
        const cancelRequest = { creditor };

        try {
            await this.props.acceptRequest(this.state.cancelId, cancelRequest);
            this.setState({
                modalCancelVisible: false
            });
            window.location.reload()
        } catch (err) {
            return
        }
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
                            .map(({ description, favor, _id, proof, debtor, content }) => (
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
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAAB0CAIAAABYEHoOAAABS2lDQ1BERUxMIFU
                                                    yNzE3RAAAKJGVjr9LAnEchp9vGtoPyOESajqoJdDQa5C2TCMCB5GiU2g4z1+h2ZfzoNoaGvoLammLCqqhKdeG9oagpLmhXXA
                                                    puQYrlYboXT4PDy98XhhQDCkrbmCralup5UVVT2dUzyteFMbx4TLMmowmkwmA79uf1hMC4DFoSFkpP8Qugwvhq7ON6+hxWT34
                                                    3e/LcC5fM4EPoGBKywaRA6Z2bGmDOAQUS09nQJwASrHDN4CS7fA9oFirqRiIBuAzS0YOxBsQyPb4Yg9//QUYjS8lEuqaFglH
                                                    4n/M/X/s/K4NENuWe9ZmsWSrUSkreXWlas4GVC2khUBPZ9ROu9lAAMLv7Trph/k4uE67LjsJdRMmhrpu+gLGdLjdl4Zl/Aw
                                                    QLXetMKd1eKQOg0eO01wHzwy0nx3nve447XNwvcBd6xPrkl1A9iU1iwAAAAlwSFlzAAALEwAACxMBAJqcGAAABm1pVFh0WE1
                                                    MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+
                                                    IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5L
                                                    jE2NDM1MiwgMjAyMC8wMS8zMC0xNTo1MDozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9y
                                                    Zy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJod
                                                    HRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtb
                                                    G5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG
                                                    9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2V
                                                    FdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyM
                                                    C0xMC0yMFQxNDowNzozMCsxMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTAtMjBUMTQ6MTc6MDIrMTE6MDAiIHhtcDpNZXRhZGF
                                                    0YURhdGU9IjIwMjAtMTAtMjBUMTQ6MTc6MDIrMTE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlP
                                                    SIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iREVMTCBVMjcxN0QiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzlhNDMxN2UtOTUx
                                                    Zi02MTRjLWIxYWItYmE1OWEzNGRiNTM4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZTYwNWI4OGEtZTh
                                                    kZi01MjRjLTg3YmEtZWJjYmFiZjMxYzE2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGFiMzVlZGItYjU3MC1iMz
                                                    RiLThjNjUtMWMzMDE2ZDJhMDAwIj4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5Z
                                                    XJOYW1lPSJJT1UiIHBob3Rvc2hvcDpMYXllclRleHQ9IklPVSIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDx4
                                                    bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5
                                                    paWQ6ZGFiMzVlZGItYjU3MC1iMzRiLThjNjUtMWMzMDE2ZDJhMDAwIiBzdEV2dDp3aGVuPSIyMDIwLTEwLTIwVDE0OjA3OjMwKzExOjA
                                                    wIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb24
                                                    9InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc5YTQzMTdlLTk1MWYtNjE0Yy1iMWFiLWJhNTlhMzRkYjUzOCIgc3RFdnQ
                                                    6d2hlbj0iMjAyMC0xMC0yMFQxNDoxNzowMisxMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdp
                                                    bmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZG
                                                    Y6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpFjVI8AAAdiSURBVHic7Z3Pa9NuHMfz/fI9Tod4qYpChKAIIlRG0IMV
                                                    KSJZ2cWDNHEwPLgNJuxUhB11UHpyWOjiwYvNyg4ylNqDiBAPSpFFRPASsbIxDV7ENX/A91AYY3ueZ23y2dY8e7+Oz5N88kBfTZ5f+eSfdrut
                                                    ABCPf/e7AUAGoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBA
                                                    qARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQKgESAAGgECoBEgABoBAqARIAAaAQL+2+8G7BH1en19ff3du3eO4zAPsG1bUZSRkZGBgYG9b
                                                    ZoM/NM/KUQPHTrELI/TwiAIlpaWCoVC96cYhjE6OprL5aJdcWJigmmq67rpdDpazGKxODs7u6WwVqtFbiQ5Mj/UisWipmk9OaQoSqPRyOf
                                                    z2WzW87xdaph8yKmR7/vZbHb7P7h7ms1mJpOpVCqErZIYCTXyPC+dTjebzfihCoXCxMRE/DjSI5tGnudlMhnCgI7jwKQdkUoj3/fHxsbEx1i
                                                    WZdu27/vtdrvdbtdqtc4YTYDjOMVikayVMiKPRmEYTk5Otlot3gGGYXieNz8/b5pmKpXqFOZyOdM02+22WKbZ2dmFhQXiFkuEPBo9e/ZM0
                                                    B8qlUqLi4uapvEOME3T8zxd13kHFIvFIAjitlJSJNHI8zzBwN627cnJyR2DaJpWrVZ5JrVarbm5uehNlBpJNHry5AmvampqyjTNLuOkUqlqt
                                                    aqqKrO2XC5jMomJDBp5nsdb4tB1fWZmpqdoqVTq8ePHvFqBrwcZGTQS/LTT09MR1sgymYxlWcwqx3F83+81oPQkXqMgCHi3IsMwIq863
                                                    b17l1f15s2baDElJvEavX37llc1OjoaOWw6nebdkLBCsp3Ea/TixQtmuaqqMRfAeae3Wi0817aQbI3CMGw0Gsyq7kdnPK5evcqr+vjxY8zgkpFs
                                                    jZaXl3lVly5dihl8YGDAMAxm1ZcvX2IGl4xka7S2tsarunjxYvz4vBvSq1ev4geXiWRrtLKywizXdZ1kL+zJkyeZ5a1WKwzD+PGlIdka/
                                                    fjxg1k+NDREEv/48eO8ql+/fpFcQg6SrdG3b9+Y5adOnSKJL9Cof/aw9wPJ1uj379/M8sHBQZL4G/tJtvPz50+SS8hBsjXi7S46fPjwHrfkgJN
                                                    sjfYA3mo/2IycGgn6NGA3kFMjwv6vYFcu2AAaAQLk1Gh9fZ0kjmDzNe9V8YNJsjXi7Zv++/cvSXzBqB7dr80kW6OjR48yy3mLJL0i0OjYsWMkl5
                                                    CDZGt0+vRpZvn3799J4q+urjLLVVVF/prNJFuj8+fPM8sbjQbJ0unnz5+Z5ZcvX44fXCaSrdGJEyd4VYKtSF0ShuH79++ZVRcuXIgZXDKSrZFgU
                                                    9HXr19jBl9eXuZNGp07d67XaHHmIJgjhr4aKiZbI8EGxfgb7z98+MAsV1VVoO+RI0eY5XE0+vPnz/ZCaEQJb4Niq9Wq1+uRw4ZhyMv9MDw8LOhf8
                                                    zYXxJnKYj5boREl2WyWVxVHo5cvX/KeaDdu3BCcyNvqFHkOwvd9Zkv6asYh8RppmsZ7rjmOE82kMAx5CY10XRen4eLtUfn06VOEliict1D6bcYh8
                                                    RopwtcaHz16FGHkXy6XebeiO3fuiM89c+YMs7zRaETLa8N8EW94eDhCqN1DBo1yuRxvVaTZbPaaSNR1Xd4puq6PjIyIT9c0jbdFaWlpqaeWdBrDf
                                                    BGPN2G2X8igkaIo09PTvKpyudx9ojTf9+/duye4SjePEt6tolAo9JTXJgiCBw8eMKuo3lmgQhKNcrkc75V7RVHGx8e7Gf97nnfz5k3e48yyrC7f5h
                                                    b0wcfGxro0KQiC27dvM/PHWZYlSBu3L8iTpT8IguvXr4tzPz58+JD3A1QqFXEidt/3BTv8t5DNZgUZBGdmZqampgQ3toWFhfHxcV5tnIT/u4Q8Gim
                                                    K4rrujjcMy7KuXLly7dq1jhP1en11dXXHTP69flmhXq/n8/luWjI0NLRhdufhKxCoc9b8/Hz3LdkbpNJI2el/HA3btiMklrh16xYvTUVkdF2vVqvd3
                                                    xT3DEn6RhuYprljnuueKJVK0ZKTzM3NCfLaRkBV1Uql0ocOKfJppCiKaZpx5q8302UKWyadbKS8qdFeMQzj9evX/daz3kBCjRRFyWQynucJxm470snF
                                                    HjNJUiqVWlxc7DWH6XY6Sb378z7UQba+0RZc163VarzkkEwsy8rn87QfHvF9//nz5xG+qGTbdiK+FNhHGu0qnUHQ06dPmeNwVVXv37+v7P7XHV3XXV
                                                    tbW1lZEShVKpUGBwfPnj3bb6N6AQdFI7CryNk3AnsMNAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBEAjQ
                                                    AA0AgRAI0AANAIEQCNAADQCBEAjQAA0AgRAI0AANAIEQCNAADQCBPwP58aEurcQt2wAAAAASUVORK5CYII="
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
                        <Button key="complete" type="default"
                            onClick={this.handleCompleteOk}
                        >
                            Complete</Button>,
                    ]}
                >
                    <Form
                        layout="vertical"
                        name="completeRequest"
                    >
                        <p>Please upload proof of completion:</p>
                        <FormGroup>
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
                                <Text type="secondary">The file should be a image and less than 2MB.</Text>
                            </Upload>
                        </FormGroup>


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
    { acceptRequest, addOwe, deleteRequest }
)(TasksLists);