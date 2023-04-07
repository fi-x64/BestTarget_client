import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Image, Radio, Space } from 'antd';
import { Link, redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { getOneGoiDangKy } from '../../services/goiDangKy';
import { getViTien, thanhToanCoin } from '../../services/thanhToan';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../services/nguoiDung';
import { updateUser } from '../../actions/auth';

function CheckOutCoin() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const [viTien, setViTien] = useState();
    const [goiDangKy, setGoiDangKy] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const goiId = searchParams.get("goiId")

            const goiDangKyData = await getOneGoiDangKy(goiId);

            if (goiDangKyData) {
                setGoiDangKy(goiDangKyData);
            }

            const viTienData = await getViTien(user.data._id);

            if (viTienData) {
                console.log("Check viTienData:", viTienData);
                setViTien(viTienData);
            }
        }
        fetchData();
    }, [])

    const handleSubmit = async () => {
        let values;
        if (goiDangKy.goiId == 2) {
            values = {
                userId: user.data._id,
                soTien: goiDangKy.giaTien,
            }
        } else {
            if (user.data.goiTinDang.id.goiId >= goiDangKy.goiId) {
                values = {
                    userId: user.data._id,
                    soTien: goiDangKy.giaTien,
                    soLuongTinDang: goiDangKy.soLuongTin
                }
            } else {
                values = {
                    userId: user.data._id,
                    soTien: goiDangKy.giaTien,
                    goiId: goiDangKy._id,
                    soLuongTinDang: goiDangKy.soLuongTin
                }
            }
        }
        const res = await thanhToanCoin(values);

        if (res) {
            if (res.status === 'success') {
                toast.success('Thanh toán thành công, đã mua gói tin');
                const newUserData = await getCurrentUser();
                const userData = { ...user };
                userData.data = newUserData.data;
                localStorage.setItem("user", JSON.stringify(userData));
                dispatch(updateUser(userData));
                navigate(`/walletDashboard`)
            } else {
                toast.error('Đã xảy ra lỗi, thanh toán không thành công');
            }
        }
    }


    return (
        <div className="max-w-[936px]">
            {viTien && goiDangKy ?
                <div className="p-[15px] bg-white">
                    <h1 className='text-xl font-semibold'>Thanh toán Coin</h1>
                    <hr />
                    <div className='px-8 py-4'>
                        <div className='w-[480px] mx-auto [&>*]:mb-3'>
                            <h1 className='font-bold'>Dịch vụ thanh toán mua gói tin đăng</h1>
                            <hr />
                            <div>
                                <p>Gói chọn mua: {goiDangKy.tenGoi}</p>
                                <p>Coin đang có:
                                    <NumericFormat className='ml-2' value={viTien.tongSoDu} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <i className="fa-solid fa-coins ml-2"></i></p>
                                <p>Coin sẽ sử dụng:
                                    <NumericFormat className='ml-2' value={goiDangKy.giaTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <i className="fa-solid fa-coins ml-2"></i></p>
                                <p>Khuyến mãi:
                                    <NumericFormat className='ml-2' value={0} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                                    <i className="fa-solid fa-coins ml-2"></i>
                                </p>

                            </div>
                            <hr />
                            <h1>Thành tiền:
                                <NumericFormat className='ml-2 float-right text-red-600' value={goiDangKy.giaTien} displayType={'text'} suffix={' coin'} thousandSeparator={'.'} decimalSeparator={','} />
                            </h1>

                            <hr />
                            {(viTien.tongSoDu - goiDangKy.giaTien) >= 0 ?
                                <>
                                    <h1>Coin còn lại:
                                        <NumericFormat className='ml-2 float-right text-red-600' value={viTien.tongSoDu - goiDangKy.giaTien} displayType={'text'} suffix={' coin'} thousandSeparator={'.'} decimalSeparator={','} />
                                    </h1>
                                    <Button className='bg-[#5a9e3f] w-[480px] h-[40px] text-white' onClick={() => handleSubmit(goiDangKy.giaTien)}>
                                        <NumericFormat className='mr-1' value={goiDangKy.giaTien} displayType={'text'} suffix={' coin'} thousandSeparator={'.'} decimalSeparator={','} />
                                        - THANH TOÁN NGAY!
                                    </Button>
                                </>
                                :
                                <>
                                    <h1>Coin còn lại:
                                        <p className='ml-2 float-right text-red-600'>KHÔNG ĐỦ COIN ĐỂ THANH TOÁN</p>
                                    </h1>
                                    <Button className='bg-[#5a9e3f] w-[480px] h-[40px] text-white' disabled>
                                        KHÔNG ĐỦ COIN ĐỂ THANH TOÁN
                                    </Button>
                                </>
                            }
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
};

export default CheckOutCoin