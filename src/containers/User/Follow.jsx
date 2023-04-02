import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, List, Popover, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { countTrangThaiTin, editPost, getTinDang, updateTinHetHan } from '../../services/tinDang';
import moment from 'moment';
import { getListFollower, getListFollowing } from '../../services/theoDoi';

function Follow() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [countTTTin, setCountTTTin] = useState();
    const [tinDangData, setTinDangData] = useState();
    const [listFollower, setListFollower] = useState();
    const [listFollowing, setListFollowing] = useState();

    useEffect(() => {
        async function fetchData() {
            const listFollower = await getListFollower();
            const listFollowing = await getListFollowing();

            if (listFollower) {
                setListFollower(listFollower)
            }
            if (listFollowing) {
                setListFollowing(listFollowing)
            }
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

    const content = (id) => {
        return (
            <div>
                <Link to={{ pathname: '/postEdit', search: `?id=${id}` }} >Sửa tin</Link>
                <p onClick={() => handleAnTin(id)} className='cursor-pointer'>Đã bán/Ẩn tin</p>
            </div>
        )
    };

    const getListItem = (tinDangData, status) => {
        return (
            <List
                dataSource={tinDangData}
                renderItem={(item) => (
                    <List.Item key={item._id}>
                        <List.Item.Meta
                            avatar={<img className='w-[120px] h-[70px]' src={item.hinhAnh[0].url} alt="" />}
                            title={status === 'Đang hiển thị' ? <Link to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</Link> : <p to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</p>}
                            description={
                                <>
                                    <p className='text-sm text-red-600'>{item.gia} đ</p>
                                    {
                                        status === 'Đang hiển thị' || status === 'Tin đã ẩn' ?
                                            <p className='text-xs'>Tin đăng còn {60 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ hết hạn</p>
                                            : status === 'Bị từ chối' ?
                                                <p className='text-xs'>Tin đăng còn {5 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ bị xoá vĩnh viễn</p>
                                                : status === 'Hết hạn' ?
                                                    <p className='text-xs'>Tin đăng còn {75 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ bị xoá vĩnh viễn</p>
                                                    : null
                                    }
                                </>}
                        />
                    </List.Item >
                )
                }
            />)
    }

    const items = [
        {
            key: '1',
            label: 'Được theo dõi (' + listFollower.count + ')',
            children: getListItem(tinDangData, "Đang hiển thị")
        },
        {
            key: '2',
            label: 'Đang theo dõi (' + listFollowing.count + ')',
            children: getListItem(tinDangData, "Hết hạn"),
        },
    ];

    return (
        <div className="container bg-[#f4f4f4]">
            <div className="max-w-[712px] h-[700px] bg-[#fff]">
                <div>
                    <h1 className='p-4 font-semibold text-lg'>Quản lý theo dõi</h1>
                    <hr />
                </div>
                <div className="grid grid-cols-3 pl-[15px] pt-[15px] bg-white">
                    <div className='flex col-span-2'>

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

export default Follow