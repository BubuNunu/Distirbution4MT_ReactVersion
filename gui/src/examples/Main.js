import { Layout, Menu, Breadcrumb, Space, Card, Row, Col } from "antd";
import React from "react";
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined
} from "@ant-design/icons";
import Histogram from "./Histogram";
import Type1MT from "./Type1MT";
import Type0MT from "./Type0MT";
import Type1MT2highlightTopN from "./Type1MT2highlightTopN";
import Type0MT2highlightTopN from "./Type0MT2highlightTopN";

const { Header, Content, Footer, Sider } = Layout;

export default class Main extends React.Component {
    handleClick = e => {
        console.log('click ', e);
    };

    render() {
        const { globalHeight } = this.props;
        // console.log(globalHeight);
        return (
            <Layout>
                <Header className="header">
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: 0,
                        minHeight: globalHeight * 0.9
                    }}
                >
                    <Row>
                        {/* <Col span={"8"}>
                            <Card title={"MapView"}></Card>
                        </Col> */}
                        <Col span={"12"}>
                            <Card title={"Type1MT"}>
                                <Type1MT
                                    svgID={"type1MT"}
                                    canvasHeight={globalHeight * 0.7}
                                />
                            </Card>
                        </Col>
                        <Col span={"12"}>
                            <Card title={"Type0MT"}>
                                <Type0MT
                                    svgID={"type0MT"}
                                    canvasHeight={globalHeight * 0.7}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={"12"}>
                            <Card title={"Type1MT2highlightTopN"}>
                                <Type1MT2highlightTopN
                                    svgID={"type1MT2highlightTopN"}
                                    canvasHeight={globalHeight * 0.7}
                                />
                            </Card>
                        </Col>
                        <Col span={"12"}>
                            <Card title={"Type0MT2highlightTopN"}>
                                <Type0MT2highlightTopN
                                    svgID={"type0MT2highlightTopN"}
                                    canvasHeight={globalHeight * 0.7}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={"24"}>
                            <Card title={"Category Parallel corrdinates"}></Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={"24"}>
                            <Card title={"Rnaking changes"}></Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
