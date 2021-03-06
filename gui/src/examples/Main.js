import { Layout, Menu, Breadcrumb, Space, Card, Row, Col } from "antd";
import React from "react";
// import {
//     UserOutlined,
//     LaptopOutlined,
//     NotificationOutlined
// } from "@ant-design/icons";
// import Type1MT from "./Type1MT";
// import Type0MT from "./Type0MT";
import Type0MT_version from "./Type0MT_version";
import Type1MT_version from "./Type1MT_version";
import IntegerStep from "./slider4Type0MT";
import Legend from "./legend";
import ParallelCoordinates from "./ParallelCoordinates";
import VisTypeSelection from "./SelectVisType";
import MapView from "./MapView";
import "./Main.css"

const { Header, Content, Footer, Sider } = Layout;

export default class Main extends React.Component {
    render() {
        const { globalHeight } = this.props;
        // console.log(globalHeight);
        return (
            <Layout>
                <Header className="header">
                    Distribution of Category on Hotspots
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: 0,
                        minHeight: globalHeight * 0.9
                    }}
                >
                    <Row>
                        <Col span={"10"}>
                            <Card title={"MapView"}>
                                <MapView
                                    divID={"mapDiv"}
                                    canvasHeight={globalHeight * 0.5}
                                />
                            </Card>
                        </Col>
                        <Col span={"14"}>
                            <Row>
                                <Col span={"10"}>
                                    <Card title={"Type1MT"} extra={<VisTypeSelection />}>
                                        <Type1MT_version
                                            svgID={"type1MT_version"}
                                            canvasHeight={globalHeight * 0.5}
                                        />
                                    </Card>
                                </Col>
                                <Col span={"10"}>
                                    <Card title={"Type0MT"}>
                                        <Type0MT_version
                                            svgID={"type0MT_version"}
                                            canvasHeight={globalHeight * 0.5}
                                        />
                                    </Card>
                                </Col>
                                <Col span={"4"}>
                                    <Card style={{ height: globalHeight * 0.12 }}>
                                        <IntegerStep />
                                    </Card>
                                    <Card>
                                        <Legend
                                            svgID={"legendSvg"}
                                            canvasHeight={globalHeight * 0.41}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={"24"}>
                            <Card title={"Category Parallel Coordinates"}>
                                <ParallelCoordinates
                                    svgID={"PCSVG"}
                                    canvasHeight={globalHeight * 0.2}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={"24"}>
                            <Card title={"Ranking changes"}></Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
