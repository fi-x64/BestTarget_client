import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LineChartOutlined,
    UserOutlined,
    FormOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import logo from '../../assets/img/logo.png';
import ManagerUsers from './ManagerUsers';
import ManagerPosts from './ManagerPosts';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import avatar from '../../assets/img/avatar.svg'
import { logout } from '../../actions/auth';
import ManagerStatistics from './ManagerStatistics';
import ManagerPromotions from './ManagerPromotions';
import ManagerChatSupport from './ManagerChatSupport';
import ChatNotification from '../HomePage/ChatNotification';
import ManagerDashboard from './ManagerDashboard';

const { Header, Sider, Content } = Layout;

function ManagerHomePage() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { countMessage } = useSelector((state) => state.chatNoti);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [key, setKey] = useState(1);

    const handleOnClickSider = (e) => {
        setKey(e.key);
        navigate(`/managerPage/${e.key}`);
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        window.location.reload();
    }

    useEffect(() => {
        if (isLoggedIn && user.data.quyen.ten == 'Admin') {
            const pathName = window.location.pathname;
            const params = pathName.split('/');
            const keyParam = params[params.length - 1];

            if (keyParam > 0 && keyParam < 7) {
                setKey(keyParam)
            } else {
                navigate(`/managerPage/1`);
            }
        } else navigate('/');
    }, [])

    const items = [
        {
            key: '1',
            label: (
                <Link to="/">
                    Chuyển đến trang chủ
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to={{ pathname: '/users/profile', search: `?userId=${user?.data?._id}` }}>
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

    const setNewKey = (newKey) => {
        setKey(newKey);
        navigate(`/managerPage/${newKey}`);
    }

    return (
        <Layout className='min-h-[100vh]'>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <img src={logo} alt="" />
                <Menu
                    theme="dark"
                    mode="inline"
                    // defaultSelectedKeys={key ? [`${key}`] : ['1']}
                    selectedKeys={key}
                    onClick={(e) => handleOnClickSider(e)}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: 'Trang chủ quản lý',
                        },
                        {
                            key: '2',
                            icon: <UserOutlined />,
                            label: 'Quản lý người dùng',
                        },
                        {
                            key: '3',
                            icon: <FormOutlined />,
                            label: 'Quản lý tin đăng',
                        },
                        {
                            key: '4',
                            icon: <LineChartOutlined />,
                            label: 'Thống kê',
                        },
                        {
                            key: '5',
                            icon: <ChatNotification type={'managerPage'} />,
                            label: 'Tin nhắn hỗ trợ',
                        },
                        {
                            key: '6',
                            icon: <i className="fa-solid fa-tags"></i>,
                            label: 'Tạo khuyến mãi',
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
                                <Avatar src={user?.data?.anhDaiDien ? user.data.anhDaiDien.url : avatar} />
                                {user?.data?.hoTen}<i className="fa-solid fa-chevron-down"></i>
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
                    {key == 1 ? <ManagerDashboard setNewKey={setNewKey} /> : null}
                    {key == 2 ? <ManagerUsers /> : null}
                    {key == 3 ? <ManagerPosts /> : null}
                    {key == 4 ? <ManagerStatistics /> : null}
                    {key == 5 ? <ManagerChatSupport /> : null}
                    {key == 6 ? <ManagerPromotions /> : null}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManagerHomePage;