import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MomoLogo from '../../assets/img/momo_logo.png'
import VNPayLogo from '../../assets/img/vnpay_logo.png'
import { Button, Image, Radio, Space } from 'antd';
import { Link, redirect, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { getOneMenhGia } from '../../services/menhGia';
import { saveMomoPayment, thanhToanMomo } from '../../services/thanhToan';
import Moment from 'moment';

function PaymentResult() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [listTinDang, setListTinDang] = useState();
    const [allParams, setAllParams] = useState({});

    useEffect(() => {
        async function fetchData() {
            const queryParams = new URLSearchParams(location.search);

            const allParamsData = {};
            for (const [key, value] of queryParams.entries()) {
                allParamsData[key] = value;
            }
            setAllParams(allParamsData);
        }
        fetchData();
    }, [location]);

    useEffect(() => {
        async function fetchData() {
            if (allParams.resultCode == 0) {
                const res = await saveMomoPayment(user.data._id, allParams);
            }
        }
        fetchData();
    }, [allParams]);

    return (
        <div className="max-w-[480px] mx-auto py-5">
            {allParams && allParams?.resultCode == 0 ?

                <div className="p-[15px] bg-white">
                    <div className='text-2xl text-center text-green-500 [&>*]:mb-3'>
                        <h1 className='font-semibsold'>Thanh toán thành công</h1>
                        <hr />
                        <i className="fa-regular fa-circle-check text-5xl"></i>
                    </div>
                    <div className='grid grid-cols-2 px-6 mx-auto py-4 gap-2 [&>p]:text-right'>
                        <h1>Đơn vị thanh toán</h1>
                        <p>{allParams.partnerCode}</p>
                        <h1>Hình thức thanh toán</h1>
                        <p>{allParams.payType}</p>
                        <h1>Mã giao dịch</h1>
                        <p>{allParams.transId}</p>
                        <h1>Số tiền thanh toán</h1>
                        <p>
                            <NumericFormat className='text-red-600 py-2' value={allParams.amount} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                        </p>
                        <h1>Thời gian thanh toán</h1>
                        <p>{Moment(parseInt(allParams.responseTime)).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <div className='flex justify-around'>
                        <Link to='/'><Button className='bg-[#ffba22]'>Trở về trang chủ</Button></Link>
                        <Link to='/walletDashboard'><Button className='bg-[#ffba22]'>Trở về trang quản lý số dư</Button></Link>
                    </div>
                </div>
                : allParams && allParams?.vnp_ResponseCode == 0 ?
                    <div className="p-[15px] bg-white">
                        <div className='text-2xl text-center text-green-500 [&>*]:mb-3'>
                            <h1 className='font-semibsold'>Thanh toán thành công</h1>
                            <hr />
                            <i className="fa-regular fa-circle-check text-5xl"></i>
                        </div>
                        <div className='grid grid-cols-2 px-6 mx-auto py-4 gap-2 [&>p]:text-right'>
                            <h1>Đơn vị thanh toán</h1>
                            <p>VNPay</p>
                            <h1>Hình thức thanh toán</h1>
                            <p>{allParams.vnp_CardType}</p>
                            <h1>Mã ngân hàng</h1>
                            <p>{allParams.vnp_BankCode}</p>
                            <h1>Mã giao dịch</h1>
                            <p>{allParams.vnp_TransactionNo}</p>
                            <h1>Số tiền thanh toán</h1>
                            <p>
                                <NumericFormat className='text-red-600 py-2' value={allParams.vnp_Amount / 100} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                            </p>
                            <h1>Thời gian thanh toán</h1>
                            <p>{Moment(allParams.vnp_PayDate, 'YYYYMMDDHHmmss').format('DD-MM-YYYY HH:mm:ss')}</p>
                        </div>
                        <div className='flex justify-around'>
                            <Link to='/'><Button className='bg-[#ffba22]'>Trở về trang chủ</Button></Link>
                            <Link to='/walletDashboard'><Button className='bg-[#ffba22]'>Trở về trang quản lý số dư</Button></Link>
                        </div>
                    </div> :
                    <div className="p-[15px] bg-white">
                        <div className='text-2xl text-center text-red-500 [&>*]:mb-3'>
                            <h1 className='font-semibsold'>Thanh toán thất bại</h1>
                            <hr />
                            <i className="fa-regular fa-circle-xmark text-5xl"></i>
                        </div>
                        <div className='px-6 mx-auto py-4 text-center'>
                            <h1>Thanh toán không thành công, vui lòng thử lại</h1>
                        </div>
                        <div className='flex justify-around'>
                            <Link to='/'><Button className='bg-[#ffba22]'>Trở về trang chủ</Button></Link>
                            <Link to='/walletDashboard'><Button className='bg-[#ffba22]'>Trở về trang quản lý số dư</Button></Link>
                        </div>
                    </div>
            }
        </div>
    );
};

export default PaymentResult