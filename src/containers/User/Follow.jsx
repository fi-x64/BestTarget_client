import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, List, Popover, Tabs } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { getListLoggedFollower, getListLoggedFollowing, themTheoDoi, xoaTheoDoi } from '../../services/theoDoi';
import { toast } from 'react-toastify';

function Follow() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [listFollower, setListFollower] = useState();
    const [listFollowing, setListFollowing] = useState();

    useEffect(() => {
        async function fetchData() {
            const listFollower = await getListLoggedFollower();
            const listFollowing = await getListLoggedFollowing();

            if (listFollower) {
                setListFollower(listFollower)
            }
            if (listFollowing) {
                listFollowing.data.map((value, index) => {
                    value.nguoiDung[0].status = true;
                })
                setListFollowing(listFollowing)
            }
        }
        fetchData();
    }, [])

    const handleXoaTheoDoi = async (userId) => {
        const res = await xoaTheoDoi(userId);
        if (res) {
            const listFollowingData = { ...listFollowing }
            listFollowingData.data.map((value, index) => {
                if (value.nguoiDung[0]._id == userId)
                    value.nguoiDung[0].status = false;
            })
            toast.success(res.message);
            setListFollowing(listFollowingData)
        } else
            toast.error('Huỷ theo dõi không thành công');
    }

    const handleThemTheoDoi = async (userId) => {
        const res = await themTheoDoi(userId);

        if (res) {
            const listFollowingData = { ...listFollowing }
            listFollowingData.data.map((value, index) => {
                if (value.nguoiDung[0]._id == userId)
                    value.nguoiDung[0].status = true;
            })
            toast.success(res.message);
            setListFollowing(listFollowingData)
        } else
            toast.error('Huỷ theo dõi không thành công');
    }

    const getListItem = (data, status) => {
        return (
            <List
                pagination={{ position: 'bottom', align: 'center', pageSize: 10 }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item key={item.nguoiDung[0]._id}>
                        <List.Item.Meta
                            avatar={<Avatar className='w-[50px] h-[50px]' src={item?.nguoiDung[0]?.anhDaiDien?.url ? item.nguoiDung[0].anhDaiDien.url : avatar} />}
                            title={<Link to={{ pathname: '/users/profile', search: `?userId=${item.nguoiDung[0]._id}` }} className='text-base'>{item.nguoiDung[0].hoTen}</Link>}
                        // description={}
                        />
                        {status === 'Đang theo dõi' && item.nguoiDung[0].status ?
                            <Button className='float-right'><i className="fa-solid fa-user-check text-[#ffba22]" onClick={() => handleXoaTheoDoi(item.nguoiDung[0]._id)}></i></Button>
                            : status === 'Đang theo dõi' && !item.nguoiDung[0].status ? <Button className='float-right bg-[#ffba22]' onClick={() => handleThemTheoDoi(item.nguoiDung[0]._id)}><i className="fa-solid fa-user-plus"></i></Button>
                                : null
                        }
                    </List.Item >
                )
                }
            />)
    }

    const items = [
        {
            key: '1',
            label: 'Đang theo dõi (' + listFollowing?.count + ')',
            children: getListItem(listFollowing?.data, 'Đang theo dõi'),
        },
        {
            key: '2',
            label: 'Người theo dõi (' + listFollower?.count + ')',
            children: getListItem(listFollower?.data, 'Người theo dõi')
        },
    ];

    return (
        <div className="container bg-[#f4f4f4]">
            {listFollower && listFollowing ?
                <div className="max-w-[712px] h-[700px] bg-[#fff]">
                    <div>
                        <h1 className='p-4 font-semibold text-lg'>Quản lý theo dõi</h1>
                        <hr />
                    </div>
                    <div className='pl-[15px]'>
                        <Tabs defaultActiveKey="1" items={items} tabBarGutter={50}
                        // onChange={onChange} 
                        />
                    </div>
                </div>
                : null}
        </div>
    );
};

export default Follow