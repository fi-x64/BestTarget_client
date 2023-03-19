import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LineChartOutlined,
    UserOutlined,
    FormOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import logo from '../../assets/img/logo.png';
import ManagerUsers from './ManagerUsers';
import ManagerPosts from './ManagerPosts';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import avatar from '../../assets/img/avatar.svg'

const { Header, Sider, Content } = Layout;

function ManagerHomePage() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [key, setKey] = useState(1);

    const handleOnClickSider = (e) => {
        setKey(e.key)
    }

    const items = [
        user.data.quyen.ten === 'admin' ? {
            key: '1',
            label: (
                <Link to="/">
                    Chuyển đến trang chủ
                </Link>
            ),
        } : null,
        {
            key: '2',
            label: (
                <Link to="/users/profile">
                    Trang cá nhân
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link to='/users/editProfile'>
                    Cài đặt tài khoản
                </Link>
            ),
        },
        {
            key: '4',
            label: (
                <a rel="noopener noreferrer" onClick={() => handleLogout()}>
                    Đăng xuất
                </a>
            ),
        },
    ];

    return (
        <Layout className='min-h-[100vh]'>
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
                    <Dropdown menu={{ items }} trigger={['click']} className="cursor-pointer float-right mr-[20px]" placement='bottomRight'>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={user.data.anhDaiDien ? user.data.anhDaiDien.url : avatar} />
                                {user.data.hoTen}<i className="fa-solid fa-chevron-down"></i>
                            </Space>
                        </a>
                    </Dropdown>
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
                    {key == 2 ? <ManagerPosts /> : null}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManagerHomePage;