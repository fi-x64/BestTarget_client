import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LineChartOutlined,
    UserOutlined,
    FormOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import logo from '../../assets/img/logo.png';
import ManagerUsers from './ManagerUsers';
import ManagerPost from './ManagerPost';

const { Header, Sider, Content } = Layout;

function ManagerHomePage() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [key, setKey] = useState(1);

    const handleOnClickSider = (e) => {
        setKey(e.key)
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <img src={logo} alt="" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(e) => handleOnClickSider(e)}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Quản lý người dùng',
                        },
                        {
                            key: '2',
                            icon: <FormOutlined />,
                            label: 'Quản lý tin đăng',
                        },
                        {
                            key: '3',
                            icon: <LineChartOutlined />,
                            label: 'Thống kê',
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    {key == 1 ? <ManagerUsers /> : null}
                    {key == 2 ? <ManagerPost /> : null}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManagerHomePage;