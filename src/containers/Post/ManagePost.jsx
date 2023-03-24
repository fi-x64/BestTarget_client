import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, List, Popover, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { countTrangThaiTin, getTinDang } from '../../services/tinDang';

function ManagePost() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [countTTTin, setCountTTTin] = useState();
    const [tinDangData, setTinDangData] = useState();

    useEffect(() => {
        async function fetchData() {
            setCountTTTin(await countTrangThaiTin());
        }
        fetchData();
    }, [])

    useEffect(() => {
        async function fetchData() {
            setTinDangData(await getTinDang(1));
        }
        fetchData();
    }, [])

    const onChange = async (key) => {
        var res = '';
        res = await getTinDang(key);
        if (res) {
            setTinDangData(res);
        }
    };

    const handleGetSoLuong = (data, key) => {
        if (data)
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == key) {
                    return data[i].soLuong
                }
            }
        return 0
    }

    const content = (id) => {
        return (
            <div>
                <Link to={{ pathname: '/postEdit', search: `?id=${id}` }} >Sửa tin</Link>
                <p>Đã bán/Ẩn tin</p>
            </div>
        )
    };

    const getListItem = (tinDangData, status) => {
        return (<List
            dataSource={tinDangData}
            renderItem={(item) => (
                <List.Item key={item._id}>
                    <List.Item.Meta
                        avatar={<img className='w-[120px] h-[70px]' src={item.hinhAnh[0].url} alt="" />}
                        title={status === 'Đang hiển thị' ? <Link to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</Link> : <p to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</p>}
                        description={<p className='text-sm text-red-600'>{item.gia} đ</p>}
                    />
                    {status === 'Đang hiển thị' ?
                        <Popover placement="bottomRight" content={content(item._id)} trigger="click">
                            <div className='cursor-pointer text-lg'><i className="fa-solid fa-ellipsis-vertical"></i></div>
                        </Popover>
                        : <Popover placement="bottomRight" trigger="click">
                            <Button disabled>Đang đợi duyệt</Button>
                        </Popover>}
                </List.Item >
            )
            }
        />)
    }

    const items = [
        {
            key: '1',
            label: 'Đang hiển thị (' + handleGetSoLuong(countTTTin, "Đang hiển thị") + ')',
            children: getListItem(tinDangData, "Đang hiển thị")
        },
        {
            key: '2',
            label: 'Hết hạn (' + handleGetSoLuong(countTTTin, "Hết hạn") + ')',
            children: getListItem(tinDangData, "Hết hạn"),
        },
        {
            key: '3',
            label: 'Bị từ chối (' + handleGetSoLuong(countTTTin, "Bị từ chối") + ')',
            children: getListItem(tinDangData, "Bị từ chối"),
        },
        {
            key: '4',
            label: 'Đang đợi duyệt (' + handleGetSoLuong(countTTTin, "Đang đợi duyệt") + ')',
            children: getListItem(tinDangData, "Đang đợi duyệt"),
        },
        {
            key: '5',
            label: 'Tin đã ẩn (' + handleGetSoLuong(countTTTin, "Tin đã ẩn") + ')',
            children: getListItem(tinDangData, "Tin đã ẩn"),
        },
    ];

    return (
        <div className="container bg-[#f4f4f4]">
            <div className="max-w-[712px] h-[700px] bg-[#fff]">
                <div>
                    <h1 className='p-4 font-semibold text-lg'>Quản lý tin đăng</h1>
                    <hr />
                </div>
                <div className="grid grid-cols-3 pl-[15px] pt-[15px] bg-white">
                    <div className='flex col-span-2'>
                        <img src={user.data.anhDaiDien.url ? user.data.anhDaiDien.url : avatar} alt="user's avatar" className='avatar w-[80px] h-[80px] rounded-[50%]' />
                        <div className="grid grid-rows-3 ml-4">
                            <div className="...">{user.data.hoTen}</div>
                            <div className='text-[13px] grid grid-cols-2 border-blue-500 border-solid gap-2'>
                                <Button><Link to="/users/profile">Trang cá nhân</Link></Button>
                                <Button>Liên kết ví bán hàng</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='pl-[15px]'>
                    <Tabs defaultActiveKey="1" items={items} tabBarGutter={50} onChange={onChange} />
                </div>
            </div>
        </div>
    );
};

export default ManagePost