import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, Card, Col, Image, List, Popover, Row, Tabs } from 'antd';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getAllGoiDangKy } from '../../services/goiDangKy';
import { NumericFormat } from 'react-number-format';
import CheckOutCoin from '../Wallet/CheckoutCoin';

function Subscription() {
    const location = useLocation();
    const [listAllGoiDangKy, setListAllGoiDangKy] = useState();
    const [allParams, setAllParams] = useState({});

    useEffect(() => {
        async function fetchData() {
            const listGoiDangKyData = await getAllGoiDangKy();

            if (listGoiDangKyData) {
                setListAllGoiDangKy(listGoiDangKyData);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="container bg-[#f4f4f4] py-10">
            <div className=''>
                {listAllGoiDangKy ?
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title={<h1 className='text-2xl'>{listAllGoiDangKy[0].tenGoi}</h1>} bordered={false}>
                                <div className='flex'>
                                    <h1 className='text-4xl text-green-600'>{listAllGoiDangKy[0].giaTien}</h1>
                                    <p className='ml-2 mt-4 font-semibold text-gray-500'>VND/THÁNG</p>
                                </div>
                                <h1 className='my-5'>
                                    Giải pháp tiết kiệm cho các nhà bán hàng khởi sự kinh doanh
                                </h1>
                                <li className='pb-11'>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            10 tin đăng
                                        </h1>
                                    </ul>
                                </li>
                                <Button disabled className='w-[100%] bg-green-600'>Miễn phí - Đã áp dụng</Button>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<h1 className='text-2xl'>{listAllGoiDangKy[3].tenGoi}</h1>} bordered={false}>
                                <div className='flex'>
                                    <NumericFormat className='text-4xl text-green-600' value={listAllGoiDangKy[3].giaTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <p className='ml-2 mt-4 font-semibold text-gray-500'>VND/1 tin/1 tháng</p>
                                </div>
                                <h1 className='my-5'>
                                    Mua nhanh đăng nhanh giải pháp tiết kiệm và nhanh chóng
                                </h1>
                                <li className='pb-11'>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            +1 tin đăng/phục hồi
                                        </h1>
                                    </ul>
                                </li>
                                <Link to={{ pathname: '/checkoutCoin', search: `?goiId=${listAllGoiDangKy[3]._id}` }}><Button className='w-[100%] bg-green-600 text-white'>Mua ngay - {listAllGoiDangKy[3].giaTien / 1000}k</Button></Link>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<h1 className='text-2xl'>{listAllGoiDangKy[1].tenGoi}</h1>} bordered={false}>
                                <div className='flex'>
                                    <NumericFormat className='text-4xl text-green-600' value={listAllGoiDangKy[1].giaTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <p className='ml-2 mt-4 font-semibold text-gray-500'>VND/THÁNG</p>
                                </div>
                                <h1 className='my-5'>
                                    Giải pháp tiết kiệm cho các nhà bán hàng mở rộng kinh doanh
                                </h1>
                                <li>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            +50 tin đăng/phục hồi
                                        </h1>
                                    </ul>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            Tiết kiệm đến 100,000 VND
                                        </h1>
                                    </ul>
                                </li>
                                <Link to={{ pathname: '/checkoutCoin', search: `?goiId=${listAllGoiDangKy[1]._id}` }}><Button className='w-[100%] bg-green-600 text-white'>Mua ngay - {listAllGoiDangKy[1].giaTien / 1000}k</Button> </Link>
                            </Card>
                        </Col>
                        <Col span={8} className='mt-4'>
                            <Card title={<h1 className='text-2xl'>{listAllGoiDangKy[2].tenGoi}</h1>} bordered={false}>
                                <div className='flex'>
                                    <NumericFormat className='text-4xl text-green-600' value={listAllGoiDangKy[2].giaTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <p className='ml-2 mt-4 font-semibold text-gray-500'>VND/THÁNG</p>
                                </div>
                                <h1 className='my-5'>
                                    Giải pháp tiết kiệm cho các nhà bán hàng mở rộng kinh doanh
                                </h1>
                                <li>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            +100 tin đăng/phục hồi
                                        </h1>
                                    </ul>
                                    <ul className='my-5'>
                                        <h1 className='text-base font-bold'>
                                            <i className="fa-solid fa-check mr-3 text-green-600"></i>
                                            Tiết kiệm đến 250,000 VND
                                        </h1>
                                    </ul>
                                </li>
                                <Link to={{ pathname: '/checkoutCoin', search: `?goiId=${listAllGoiDangKy[2]._id}` }}><Button className='w-[100%] bg-green-600 text-white'>Mua ngay - {listAllGoiDangKy[2].giaTien / 1000}k</Button></Link>
                            </Card>
                        </Col>
                    </Row>
                    : null}
            </div>
        </div>
    );
};

export default Subscription