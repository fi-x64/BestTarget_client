import { Avatar, Button, Dropdown, Space } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import avatar from '../../assets/img/avatar.svg'
import { logout } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function HomeHeader() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        window.location.reload();
    }

    const items = [
        isLoggedIn && user.data.quyen.ten === 'Admin' ? {
            key: '1',
            label: (
                <Link to="/managerPage">
                    Chuyển đến trang quản lý
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
        <header className='bg-[#ffba00] relative pb-3'>
            <div className="max-w-[936px] mx-auto">
                <div className='flex justify-between'>
                    <Link to="/" className='logo'>
                        <img src={logo} alt="" className='h-14' />
                    </Link>
                    <li className='button flex [&>*]:mr-8 mt-5'>
                        <ul><Link to='/'><i className="fa-solid fa-house"></i> Trang chủ</Link></ul>
                        <ul><Link to="/managePost" ><i className="fa-solid fa-list-check"></i> Quản lý tin</Link></ul>
                        <ul><a href=""><i className="fa-solid fa-box"></i> Đơn hàng</a></ul>
                        <ul><a href=""><i className="fa-solid fa-comments"></i> Chat</a></ul>
                        <ul><a href=""><i className="fa-solid fa-bell"></i> Thông báo</a></ul>
                        {isLoggedIn && user ?
                            <Dropdown menu={{ items }} trigger={['click']} className="cursor-pointer" placement='bottomRight'>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar src={user.data.anhDaiDien ? user.data.anhDaiDien.url : avatar} />
                                        {user.data.hoTen}<i className="fa-solid fa-chevron-down"></i>
                                    </Space>
                                </a>
                            </Dropdown>
                            :
                            <ul><a href="/login"><i className="fa-solid fa-circle-user"></i> Đăng nhập/Đăng ký</a></ul>}

                    </li>
                </div>
                <div className='flex relative my-[12px] mx-auto px-2'>
                    {/* <SearchBar className="fle" /> */}
                    <div className="relative w-full">
                        <input type="search" className="block h-full w-full z-20 text-sm rounded-lg text-left[10px] placeholder:pl-3" placeholder="Tìm mọi thứ trên Best Target" required />
                        <button type="submit" className="absolute top-0 right-0 h-full p-1 text-white bg-[#ff8800] rounded-lg border ">
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                    <Button className='bg-[#FF8800] ml-2 flex-4'><Link to="/newPost"><i className="fa-solid fa-pen-to-square"></i> Đăng tin</Link></Button>
                </div>

            </div>
        </header>
    )
}

export default HomeHeader
