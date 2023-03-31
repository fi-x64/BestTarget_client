import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MomoLogo from '../../assets/img/momo_logo.png'
import VNPayLogo from '../../assets/img/vnpay_logo.png'
import { Button, Image, Radio, Space } from 'antd';
import { Link, redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { getOneMenhGia } from '../../services/menhGia';
import { thanhToanMomo, thanhToanVNPay } from '../../services/thanhToan';

function CheckOut() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const [menhGia, setMenhGia] = useState();
    const [selectedPayment, setSelectedPayment] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const menhGiaId = searchParams.get("menhGiaId");

            if (menhGiaId) {
                const res = await getOneMenhGia(menhGiaId);

                if (res) {
                    setMenhGia(res);
                }
            }
        }
        fetchData();
    }, [])

    const onChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleSubmit = async (selectedPayment) => {
        if (selectedPayment === 'momo') {
            const res = await thanhToanMomo(user.data._id, menhGia.soTien);
            if (res) {
                return window.location.href = res.payUrl;
            }
        } else if (selectedPayment === 'vnpay') {
            const res = await thanhToanVNPay(menhGia.soTien);

            if (res) {
                return window.location.href = res;
            }
        }
    }

    return (
        <div className="max-w-[936px]">
            {menhGia ?
                <div className="p-[15px] bg-white">
                    <h1 className='text-xl font-semibold'>Thanh toán Coin</h1>
                    <hr />
                    <div className='px-8 py-4'>
                        <div className='w-[480px] mx-auto [&>*]:mb-3'>
                            <h1 className='font-bold'>Dịch vụ</h1>
                            <hr />
                            <div>
                                <h1>Thanh toán Coin</h1>
                                <p>Coin nạp thêm:
                                    <NumericFormat className='ml-2' value={menhGia.soTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <i className="fa-solid fa-coins ml-2"></i></p>
                                <p>Khuyến mãi:
                                    <NumericFormat className='ml-2' value={0} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <i className="fa-solid fa-coins ml-2"></i>
                                </p>
                                <p>Số tiền phải trả:
                                    <NumericFormat className='ml-2 float-right text-red-600' value={menhGia.soTien} displayType={'text'} suffix={' đ'} thousandSeparator={'.'} decimalSeparator={','} />
                                </p>
                            </div>
                            <hr />
                            <h1>Thành tiền:
                                <NumericFormat className='ml-2 float-right text-red-600' value={menhGia.soTien} displayType={'text'} suffix={' đ'} thousandSeparator={'.'} decimalSeparator={','} />
                            </h1>
                            <hr />
                            <div>
                                <h1>Chọn hình thức thanh toán</h1>
                                <Radio.Group onChange={onChange}>
                                    <Space direction="vertical">
                                        <div className='border-2 w-[480px] h-[75px] p-2'>
                                            <Radio value={'momo'} >Ví Momo</Radio>
                                            <i className="fa-solid fa-wallet float-right text-green-600 text-xl"></i>
                                            <img src={MomoLogo} alt="" className='w-[35px] h-[35px] ml-6' />
                                        </div>
                                        <div className='border-2 w-[480px] h-[75px] p-2'>
                                            <Radio value={'vnpay'}>Ví VNPay</Radio>
                                            <i className="fa-solid fa-wallet float-right text-green-600 text-xl"></i>
                                            <img src={VNPayLogo} alt="" className='w-[50px] h-[50px] ml-5 mt-[-9px]' />
                                        </div>
                                    </Space>
                                </Radio.Group>
                            </div>
                            <Button className='bg-[#5a9e3f] w-[480px] h-[40px] text-white' onClick={() => handleSubmit(selectedPayment)}>
                                <NumericFormat className='mr-1' value={menhGia.soTien} displayType={'text'} suffix={' đ'} thousandSeparator={'.'} decimalSeparator={','} />
                                - THANH TOÁN NGAY!
                            </Button>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
};

export default CheckOut