import { Layout, Menu, Breadcrumb, Space, Card, Row, Col } from "antd";
import React from "react";
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined
} from "@ant-design/icons";
import Type1MT from "./Type1MT";
import Type0MT from "./Type0MT";
import IntegerStep from "./slider4Type0MT";
import "./Main.css"

const { Header, Content, Footer, Sider } = Layout;

export default class Main extends React.Component {
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
                            <Card title={"Type0MT"} extra={<IntegerStep/>}>
                                <Type0MT
                                    svgID={"type0MT"}
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
