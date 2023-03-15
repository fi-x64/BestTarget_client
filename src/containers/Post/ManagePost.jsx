import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Button, Tabs } from 'antd';
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

    const items = [
        {
            key: '1',
            label: 'Đang hiển thị (' + handleGetSoLuong(countTTTin, "Đang hiển thị") + ')',
            children:
                tinDangData ? tinDangData.map((value, index) => {
                    return (
                        <div key={value._id} className='flex'>
                            <img className='w-[120px] h-[70px]' src={value.hinhAnh[0].url} alt="" />
                            <div className='block pl-[10px]'>
                                <a href="">{value.tieuDe}</a>
                                <p className='text-red-700'>{value.gia}</p>
                            </div>
                        </div>)
                }) : <p>Bạn chưa có tin nào trong mục này</p>,
        },
        {
            key: '2',
            label: 'Hết hạn (' + handleGetSoLuong(countTTTin, "Hết hạn") + ')',
            children: `Content of Tab Pane 2`,
        },
        {
            key: '3',
            label: 'Bị từ chối (' + handleGetSoLuong(countTTTin, "Bị từ chối") + ')',
            children: `Content of Tab Pane 3`,
        },
        {
            key: '4',
            label: 'Đang đợi duyệt (' + handleGetSoLuong(countTTTin, "Đang đợi duyệt") + ')',
            children: `Content of Tab Pane 4`,
        },
        {
            key: '5',
            label: 'Tin đã ẩn (' + handleGetSoLuong(countTTTin, "Tin đã ẩn") + ')',
            children: `Content of Tab Pane 5`,
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