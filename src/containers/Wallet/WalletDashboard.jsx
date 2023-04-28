import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import { NumericFormat } from 'react-number-format';
import { getAllMenhGia } from '../../services/menhGia';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getViTien } from '../../services/thanhToan';
import { getAppliedKhuyenMai } from '../../services/khuyenMai';
import moment from 'moment';

function WalletDashboard() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [priceList, setPriceList] = useState();
    const [viTien, setViTien] = useState(0);
    const [currentKhuyenMai, setCurrentKhuyenMai] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await getAllMenhGia();

            if (res) {
                setPriceList(res);
            }

            const viTien = await getViTien();

            if (viTien) {
                setViTien(viTien);
            }

            const khuyenMaiData = await getAppliedKhuyenMai();

            if (khuyenMaiData) {
                setCurrentKhuyenMai(khuyenMaiData);
            }
        }
        fetchData();
    }, [])

    const handleClickItem = (values) => {
        return navigate({
            pathname: `/checkout`,
            search: `?menhGiaId=${values._id}`,
        })
    }

    if (!isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="max-w-[936px]">
            <div className="p-[15px] bg-white mb-[15px]">
                <h1 className='text-xl font-semibold'><i className="fa-solid fa-wallet text-[#ffba00] mr-2"></i>Tổng số dư</h1>
                <div className='flex justify-between px-8 py-4'>
                    <div className='text-2xl'>
                        <NumericFormat className='text-green-600 py-2' value={viTien ? viTien.tongSoDu : 0} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} />
                        <i className="fa-solid fa-coins ml-2"></i>
                    </div>
                    <Link to='/transactionDashboard' className='float-right text-blue-500 cursor-pointer text-sm'>Xem lịch sử giao dịch <i className="fa-solid fa-chevron-right"></i></Link>
                </div>
            </div>

            <div className="p-[15px] bg-white mb-[15px]">
                <h1 className='text-xl font-semibold'><i className="fa-solid fa-cubes text-[#ffba00] mr-2"></i>Gói tin đăng</h1>
                <div className='flex justify-between px-8 py-4'>
                    <div className='text-base'>
                        <h1>Gói đang áp dụng: <b>{user.data.goiTinDang.id.tenGoi}</b></h1>
                        <h1>Số lượng tin đăng còn lại: {user.data.goiTinDang.soLuongTinDang}</h1>
                        <h1 className='italic text-sm'>*Thông tin gói và số lượng tin đăng sẽ được cập nhật lại tin khi qua tháng mới </h1>
                    </div>
                    <Link to="/subscription" className='float-right text-blue-500 cursor-pointer text-sm'>Xem các gói tin đăng hoặc mua lẻ lượt đăng tin<i className="fa-solid fa-chevron-right"></i></Link>
                </div>
            </div>

            <div className="bg-[#fff] mb-[15px]">
                <div className='pb-3'>
                    <h1 className='p-4 font-semibold text-xl'><i className="fa-solid fa-file-invoice text-[#ffba00] mr-2"></i>Nạp Coin</h1>
                    <ul className='max-w-[620px] [&>li]:h-[60px] mx-auto [&>li]:rounded-lg [&>li]:mb-3 cursor-pointer'>
                        {priceList && priceList.map((values, index) => {
                            return (
                                <li key={index} className="hover:bg-[#f5f5f5] text-base border-2 flex justify-between p-4" onClick={() => handleClickItem(values)}>
                                    <div className='flex'>
                                        <p>Nạp <NumericFormat value={values.soTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} /></p>
                                        <i className="fa-solid fa-coins ml-2 mt-1"></i>
                                        <p className='text-sm ml-2 italic mt-1'>Giá <NumericFormat value={values.soTien} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} /></p>
                                    </div>
                                    <i className="fa-solid fa-chevron-right mt-1"></i>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className="bg-[#fff]">
                <div className='pb-3'>
                    <h1 className='p-4 font-semibold text-xl'><i className="fa-solid fa-percent text-[#ffba00] mr-2"></i>Khuyến mãi</h1>
                    {currentKhuyenMai ? <p className='px-7 font-semibold text-base'>{currentKhuyenMai.noiDung}. Từ ngày {moment(currentKhuyenMai.ngayBatDau).format('DD/MM/YYYY')} đến ngày {moment(currentKhuyenMai.ngayKetThuc).format('DD/MM/YYYY')}, BestTarget giảm {currentKhuyenMai.tiLeGiamGia}% cho các gói tin: {currentKhuyenMai.goiDangKyId.map((value) => (value.tenGoi + ', '))}
                        <Link to="/subscription" className='text-blue-600 cursor-pointer'>xem chi tiết giá các gói tin <i className="fa-solid fa-chevron-right"></i></Link></p> : null}
                </div>
            </div>
        </div>
    );
};

export default WalletDashboard