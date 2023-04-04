import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, Image, List, Popover, Tabs } from 'antd';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getTinDangByValue } from '../../services/tinDang';
import { FilterOutlined, EnvironmentOutlined, CaretDownOutlined } from '@ant-design/icons';
import { handleTimKiem } from '../../services/timKiem';
import SelectCategory from '../../components/atom/SelectCategory/SelectCategory';
import SelectAddress from '../../components/atom/SelectAddress/SelectAddress';
import Filter from '../../components/atom/Filter/Filter';

function PostWishlist() {
    const location = useLocation();
    const [listTinDang, setListTinDang] = useState();
    const [allParams, setAllParams] = useState({});

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const allParams = {};
        for (const [key, value] of queryParams.entries()) {
            allParams[key] = value;
        }
        setAllParams(allParams);
    }, [location]);

    useEffect(() => {
        async function fetchData() {
            if (allParams) {
                const res = await getTinDangByValue(allParams);

                if (res) {
                    setListTinDang(res);
                }
            }
        }
        fetchData()
    }, [allParams])

    return (
        <div className="container">
            <div className="bg-[#fff]">
                <div className='flex [&>*]:ml-2 py-2'>
                    <Filter />
                    <SelectAddress />
                    <SelectCategory />
                </div>
                <div className="pl-[15px] py-[15px] bg-white">
                    <div className='font-bold'>
                        Mua Bán Đồ Điện Tử Thông Minh, Chính Hãng, Giá Rẻ Tại Toàn quốc
                    </div>
                </div>
            </div>
            <div className='mt-[15px] bg-[#fff]'>
                <List
                    pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                    itemLayout="horizontal"
                    dataSource={listTinDang}
                    renderItem={(item, index) => (
                        <div className='hover:border-grey-400 hover:border-2'>
                            <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item._id}` }}>
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<img className='w-[128px] h-[128px]' src={item.hinhAnh[0].url} />}
                                        title={item.tieuDe}
                                        description={item.gia}
                                    />
                                </List.Item>
                            </Link>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default PostWishlist