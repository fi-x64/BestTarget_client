import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, Image, List, Popover, Tabs } from 'antd';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getTinDangByValue } from '../../services/tinDang';
import SelectCategory from '../../components/atom/SelectCategory/SelectCategory';
import SelectAddress from '../../components/atom/SelectAddress/SelectAddress';
import Filter from '../../components/atom/Filter/Filter';
import { toast } from 'react-toastify';
import { getListTinYeuThich, themTinYeuThich, xoaTinYeuThich } from '../../services/tinYeuThich';
import { NumericFormat } from 'react-number-format';
import countTime from '../../utils/countTime';

function PostList() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const location = useLocation();
    const [listTinDang, setListTinDang] = useState();
    const [allParams, setAllParams] = useState({});

    const navigate = useNavigate();

    async function fetchData() {
        if (allParams) {
            const res = await getTinDangByValue(allParams);

            if (res) {
                if (isLoggedIn) {
                    const tinYeuThichData = await getListTinYeuThich();

                    if (tinYeuThichData) {
                        res.map((value, index) => {
                            tinYeuThichData.data.map((tinValue) => {
                                if (value._id == tinValue.tinYeuThich[0]._id) {
                                    value.status = true;
                                }
                            }
                            )
                        })
                    }
                }
                setListTinDang(res);
            }
        }
    }

    // useEffect(() => {
    //     const queryParams = new URLSearchParams(location.search);

    //     const allParamsData = {};
    //     for (const [key, value] of queryParams.entries()) {
    //         allParamsData[key] = value;
    //     }
    //     if (allParamsData) {
    //         setAllParams(allParamsData);
    //         fetchData();
    //     }
    // }, [])

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const allParamsData = {};
        for (const [key, value] of queryParams.entries()) {
            allParamsData[key] = value;
        }
        setAllParams(allParamsData);
    }, [location]);

    useEffect(() => {
        fetchData()
    }, [allParams])

    const handleXoaTinYeuThich = async (e, tinDangId) => {
        e.preventDefault();
        const res = await xoaTinYeuThich(tinDangId);

        if (res) {
            const listTinDangData = [...listTinDang];

            listTinDangData.map((value, index) => {
                if (value._id == tinDangId)
                    value.status = false;
            })
            toast.success(res.message);
            setListTinDang(listTinDangData)
        } else
            toast.error('Huỷ theo dõi không thành công');
    }

    const handleThemTinYeuThich = async (e, tinDangId) => {
        e.preventDefault();

        if (isLoggedIn) {
            const res = await themTinYeuThich(tinDangId);

            if (res) {
                const listTinDangData = [...listTinDang]
                listTinDangData.map((value, index) => {
                    if (value._id == tinDangId)
                        value.status = true;
                })
                toast.success(res.message);
                setListTinDang(listTinDangData)
            } else
                toast.error('Huỷ theo dõi không thành công');
        } else {
            return navigate("/login");
        }
    }

    return (
        <div className="container min-h-[600px]">
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
                {listTinDang ?
                    <List
                        pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                        itemLayout="horizontal"
                        dataSource={listTinDang}
                        renderItem={(item, index) => (
                            <div className='hover:border-grey-400 hover:border-2'>
                                <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item._id}` }}>
                                    <List.Item
                                        actions={[item.status == true ? <i className="fa-solid fa-heart text-red-600" onClick={(e) => handleXoaTinYeuThich(e, item._id)}></i> : <i className="fa-regular fa-heart" onClick={(e) => handleThemTinYeuThich(e, item._id)}></i>]}
                                    >
                                        <List.Item.Meta
                                            avatar={<img className='w-[128px] h-[128px]' src={item.hinhAnh[0].url} />}
                                            title={
                                                <>
                                                    <p>{item.tieuDe}</p>
                                                    <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                                </>

                                            }
                                            description={
                                                <p className='mt-14'>{countTime(item.thoiGianPush)}</p>
                                            }
                                        />

                                    </List.Item>
                                </Link>
                            </div>
                        )}
                    />
                    : null}
            </div>
        </div>
    );
};

export default PostList