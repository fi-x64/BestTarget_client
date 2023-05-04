import { Avatar, Button, Dropdown, Input, Space } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import avatar from '../../assets/img/avatar.svg'
import { logout } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/atom/SearchBar/SearchBar';
import Notification from './Notification';
import ChatNotification from './ChatNotification';
import { createPhongChat } from '../../services/phongChat';

function HomeHeader() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        window.location.reload();
    }

    const handleChat = async () => {
        const res = await createPhongChat({
            nguoiDungId1: user.data._id,
            nguoiDungId2: '64074e99002eba5a852968a0',
            loaiPhongChat: 'hoTro'
        })

        if (res) {
            return navigate({
                pathname: `/chat/hoTro`,
                search: `?phongChatId=${res._id}`,
            })
        }
    }

    const items = [
        isLoggedIn && user.data && user.data?.quyen?.ten === 'Admin' ? {
            key: '1',
            label: (
                <Link to="/managerPage">
                    <i className="fa-solid fa-bars-progress w-[14px] h-[14px] mr-2"></i>Chuyển đến trang quản lý
                </Link>
            ),
        } : null,
        {
            key: '2',
            label: (
                <Link to={{ pathname: '/users/profile', search: `?userId=${user?.data?._id}` }}>
                    <i className="fa-regular fa-id-card w-[14px] h-[14px] mr-2"></i>Trang cá nhân
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link to='/users/follow'>
                    <i className="fa-solid fa-user-plus w-[14px] h-[14px] mr-2"></i>Người theo dõi/Đang theo dõi
                </Link>
            ),
        },
        {
            key: '4',
            label: (
                <Link to='/users/wishList'>
                    <i className="fa-solid fa-bookmark w-[14px] h-[14px] mr-2"></i>Tin đăng đã lưu
                </Link>
            ),
        },
        {
            key: '5',
            label: (
                <Link to='/walletDashboard'>
                    <i className="fa-solid fa-wallet w-[14px] h-[14px] mr-2"></i>Quản lý số dư và gói tin
                </Link>
            ),
        },
        {
            key: '6',
            label: (
                <Link to='/subscription'>
                    <i className="fa-solid fa-circle-up w-[14px] h-[14px] mr-2"></i>Nâng cấp gói đăng tin
                </Link>
            ),
        },
        {
            key: '7',
            label: (
                <Link to='/users/statistics'>
                    <i className="fa-solid fa-chart-area w-[14px] h-[14px] mr-2"></i>Thống kê
                </Link>
            ),
        },
        {
            key: '8',
            label: (
                <Link to='/users/editProfile'>
                    <i className="fa-solid fa-gear w-[14px] h-[14px] mr-2"></i>Cài đặt tài khoản
                </Link>
            ),
        },
        {
            key: '9',
            label: (
                <Link to='/chat/hoTro' onClick={() => handleChat()}>
                    <i className="fa-solid fa-circle-question w-[14px] h-[14px] mr-2"></i>Liên hệ trợ giúp
                </Link>
            ),
        },
        {
            key: '10',
            label: (
                <a rel="noopener noreferrer" onClick={() => handleLogout()}>
                    <i className="fa-solid fa-arrow-right-from-bracket w-[14px] h-[14px] mr-2"></i>Đăng xuất
                </a>
            ),
        },
    ];
    return (
        <header className='bg-[#ffba00] sticky top-0 z-50 pb-3'>
            <div className="max-w-[960px] mx-auto">
                <div className='flex justify-between'>
                    <Link to="/" className='logo'>
                        <img src={logo} alt="" className='h-14' />
                    </Link>
                    <ul className='button flex [&>*]:mr-8 mt-5'>
                        <li><Link to='/'><i className="fa-solid fa-house"></i> Trang chủ</Link></li>
                        <li><Link to="/managePost" ><i className="fa-solid fa-list-check"></i> Quản lý tin</Link></li>
                        {/* <li><Link to="/chat"><i className="fa-solid fa-comments"></i> Chat</Link></li> */}
                        <li className='flex'><ChatNotification /></li>
                        <li><Notification /></li>
                        {isLoggedIn && user && user.data ?
                            <Dropdown menu={{ items }} trigger={['click']} className="cursor-pointer" placement='bottomRight'>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar src={user?.data?.anhDaiDien ? user.data.anhDaiDien.url : avatar} />
                                        {user.data.hoTen}<i className="fa-solid fa-chevron-down"></i>
                                    </Space>
                                </a>
                            </Dropdown>
                            :
                            <li><a href="/login"><i className="fa-solid fa-circle-user"></i> Đăng nhập/Đăng ký</a></li>}

                    </ul>
                </div>
                <div className='flex relative my-[12px] mx-auto px-2'>
                    {/* <SearchBar className="fle" /> */}
                    <div className="relative w-full">
                        {/* <Input type="search" className="block h-full w-full z-20 text-sm rounded-lg text-left[10px] placeholder:pl-3" placeholder="Tìm mọi thứ trên Best Target" required /> */}
                        <SearchBar />
                        {/* <button type="submit" className="absolute top-0 right-0 h-full p-1 text-white bg-[#ff8800] rounded-lg border ">
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span className="sr-only">Search</span>
                        </button> */}
                    </div>

                    <Button className='bg-[#FF8800] ml-2 flex-4'><Link to={isLoggedIn ? "/newPost" : "/login"}><i className="fa-solid fa-pen-to-square"></i> Đăng tin</Link></Button>
                </div>

            </div>
        </header>
    )
}

export default HomeHeader
