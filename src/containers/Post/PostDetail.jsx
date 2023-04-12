import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, Carousel, Divider, Image, List, Popover, Rate, Tabs } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getTinDangId } from '../../services/tinDang';
import communitcate from '../../assets/img/communicate.png'
import shield from '../../assets/img/shield.png'
import Slider from 'react-slick';
import ReactPlayer from 'react-player'
import { NumericFormat } from 'react-number-format';
import { getOneDiaChi } from '../../services/diaChi';
import { getListTinYeuThich, themTinYeuThich, xoaTinYeuThich } from '../../services/tinYeuThich';
import { toast } from 'react-toastify';
import moment from 'moment';

function PostDetail() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    let navigate = useNavigate();

    const [currentPostData, setCurrentPostData] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [fullDiaChiTin, setFullDiaChiTin] = useState();
    const [isTinYeuThich, setIsTinYeuThich] = useState(false);

    const countTime = (thoiGianPush) => {
        const start = thoiGianPush;
        const end = moment();
        const duration = moment.duration(end.diff(start));

        // Lấy giá trị thời gian theo đơn vị phút
        const minutes = duration.asMinutes();
        // Kiểm tra và chuyển đổi sang tiếng hoặc ngày nếu lớn hơn 59 phút hoặc 23 tiếng
        let displayTime;
        var hours;
        if (minutes >= 60) {
            hours = duration.asHours();
            displayTime = `${hours.toFixed(0)} giờ`;
        } else {
            displayTime = `${minutes.toFixed(0)} phút`;
        }
        var days;
        if (hours >= 24) {
            days = duration.asDays();
            displayTime = `${days.toFixed(0)} ngày`;
        }

        return displayTime;
    }

    useEffect(() => {
        async function fetchData() {
            const tinDangId = searchParams.get('id')
            const res = await getTinDangId(tinDangId);

            if (res) {
                res.khoangThoigian = countTime(res.thoiGianPush);
                const diaChiData = await getOneDiaChi(res.diaChiTinDang.tinhTPCode, res.diaChiTinDang.quanHuyenCode, res.diaChiTinDang.phuongXaCode);

                if (diaChiData) {
                    setFullDiaChiTin(diaChiData);
                }

                setCurrentPostData(res);
            } else {
                navigate('/')
                window.location.reload()
            }

            const listTinYeuThich = await getListTinYeuThich();

            if (listTinYeuThich) {
                listTinYeuThich.data.map((value, index) => {
                    if (value.tinYeuThich[0]._id == tinDangId) {
                        setIsTinYeuThich(true);
                        return;
                    }
                })
            }
        }
        fetchData();
    }, [])

    const handleXoaTinYeuThich = async (tinDangId) => {
        const res = await xoaTinYeuThich(tinDangId);

        if (res) {
            setIsTinYeuThich(false);
            toast.success(res.message);
        } else
            toast.error('Xoá tin yêu thích không thành công');
    }

    const handleThemTinYeuThich = async (tinDangId) => {
        const res = await themTinYeuThich(tinDangId);

        if (res) {
            setIsTinYeuThich(true);
            toast.success(res.message);
        } else
            toast.error('Xoá tin yêu thích không thành công');
    }

    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    return (
        <div className="container">
            {currentPostData ?
                <div>
                    <div className='flex bg-[#fff] mb-5'>
                        <div className="h-[840px]">
                            <Slider className="w-[606px] h-[455px]" {...settings}>
                                {currentPostData.video ? currentPostData.video.map((value, index) => {
                                    return (
                                        <ReactPlayer key={value.public_id} url={value.url} controls width={606} height={455} />
                                    )
                                })
                                    : null}
                                {currentPostData.hinhAnh.map((value, index) => {
                                    return (
                                        <Image key={value.public_id} src={value.url} height={455} width={606} className='object-contain bg-gray-200' />
                                    )
                                })
                                }
                            </Slider>
                            <div className='p-3'>
                                <h1 className='float-right italic text-sm'>Tin đăng {currentPostData.khoangThoigian} trước</h1>
                                <h1 className='font-bold'>{currentPostData.tieuDe}</h1>
                                <div className='flex justify-between'>
                                    <NumericFormat className='text-red-600 py-2' value={currentPostData.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                    {isTinYeuThich ? <Button className='rounded-[20px] border-red-600 text-red-600' onClick={() => handleXoaTinYeuThich(currentPostData._id)}>Đã lưu<i className="fa-solid fa-heart ml-1"></i></Button> : <Button className='rounded-[20px] border-red-600 text-red-600' onClick={() => handleThemTinYeuThich(currentPostData._id)}>Lưu tin<i className="fa-regular fa-heart ml-2"></i></Button>}
                                </div>
                                <p>{currentPostData.moTa}</p>
                                <div className='grid grid-cols-2 mt-6 gap-2 text-sm font-light'>
                                    {currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7 ?
                                        <p><i className="fa-solid fa-fax"></i> Loại thiết bị: {currentPostData.thietBi}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 8 ?
                                        <p><i className="fa-solid fa-keyboard"></i> Loại phụ kiện: {currentPostData.phuKien}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 9 ?
                                        <p><i className="fa-solid fa-keyboard"></i> Loại linh kiện: {currentPostData.linhKien}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 5 || currentPostData.danhMucPhuId == 6 || currentPostData.danhMucPhuId == 7 ?
                                        <p><i className="fa-solid fa-tag"></i> Hãng: {currentPostData.hangSX}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 ?
                                        <p><i className="fa-solid fa-palette"></i> Màu sắc: {currentPostData.mauSac}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 ?
                                        <p><i className="fa-solid fa-hard-drive"></i> Bộ nhớ: {currentPostData.dungLuong}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 2 ?
                                        <p><i className="fa-solid fa-sim-card"></i> Sử dụng sim: {currentPostData.suDungSim}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                        <p><i className="fa-solid fa-microchip"></i> Bộ vi sử lý: {currentPostData.boViXuLy}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 1 || currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                        <p><i className="fa-solid fa-memory"></i> RAM: {currentPostData.ram}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 2 || currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                        <p><i className="fa-solid fa-display"></i> Kích cỡ màn hình: {currentPostData.kichCoManHinh}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                        <p><i className="fa-solid fa-hard-drive"></i> Dung lượng ổ cứng: {currentPostData.oCung}</p>
                                        : null}
                                    {currentPostData.danhMucPhuId == 3 || currentPostData.danhMucPhuId == 4 ?
                                        <p><i className="fa-solid fa-tachograph-digital"></i> Loại card màn hình: {currentPostData.cardManHinh}</p>
                                        : null}
                                </div>
                                <div className='mt-4'>
                                    Khu vực
                                    <hr />
                                    <h1 className='my-3 text-sm'><i className="fa-solid fa-location-dot"></i> {fullDiaChiTin ? fullDiaChiTin.path_with_type : null}</h1>
                                    <hr />
                                </div>
                                <div className='flex mt-4'>
                                    <img src={shield} alt="" className='w-[35px] h-[35px]' />
                                    <p className='text-xs'><i>Tin đăng này đã được kiểm duyệt. Nếu gặp vấn đề, vui lòng báo cáo tin đăng hoặc liên hệ CSKH để được trợ giúp.</i></p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Link to={{ pathname: '/users/profile', search: `?userId=${currentPostData.nguoiDungId._id}` }} className='flex gap-3 p-[15px]'>
                                <img className='w-[46px] h-[46px] rounded-[50%]' src={currentPostData?.nguoiDungId?.anhDaiDien?.url ? currentPostData.nguoiDungId.anhDaiDien.url : avatar} alt="" />
                                <div className='block text-sm'>
                                    <p>{currentPostData.nguoiDungId.hoTen}</p>
                                    <p>Đang hoạt động</p>
                                </div>
                                <Button className='ml-[20px] rounded-[25px]' ><Link to={{ pathname: '/users/profile', search: `?userId=${currentPostData.nguoiDungId._id}` }}>Xem trang</Link></Button>
                            </Link>
                            <div className='flex text-[14px] text-center justify-center'>
                                <div className='block'>
                                    <Link to='/users/profile'><u>Đánh giá</u></Link>
                                    <div>
                                        <Rate className='text-xs' allowHalf defaultValue={4.5} disabled />
                                    </div>
                                </div>
                                <Divider type="vertical" style={{ height: "50px" }} />
                                <div>
                                    <p>Phản hồi chat</p>
                                    <p>85%</p>
                                </div>
                            </div>
                            <div>
                                <Button className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                    <div className='flex gap-1'>
                                        <i className="fa-solid fa-phone-volume mt-[4px]"></i>
                                        <p>{currentPostData.nguoiDungId.sdt}</p>
                                    </div>
                                    {/* <p>BẤM ĐỂ HIỆN SỐ</p> */}
                                </Button>
                                <Button className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                    <i className="fa-solid fa-message mt-[4px]"></i>
                                    <p>CHAT VỚI NGƯỜI BÁN</p>
                                </Button>
                            </div>
                            <div className='flex m-4'>
                                <img className='w-[100px] h-[100px]' src={communitcate} alt="" />
                                <div className='block ml-2 text-sm'>
                                    <p><i>Hẹn gặp ở nơi công cộng và quen thuộc khi giao dịch.</i></p>
                                    <a className='text-[#fe9900]' href="">Tìm hiểu thêm »</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-[936px] h-[180px] bg-[#fff] mb-5">
                        <div className='flex justify-between p-4 font-semibold text-base'>
                            <h1>Tin rao khác của {currentPostData.nguoiDungId.hoTen}</h1>
                            <Link to='/' className='text-blue-600'>Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
                        </div>
                        <hr />
                    </div>
                    <div className="max-w-[936px] h-[180px] bg-[#fff]">
                        <div className='flex justify-between p-4 font-semibold text-base'>
                            <h1>Tin đăng tương tự</h1>
                            <Link to='/' className='text-blue-600'>Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
                        </div>
                        <hr />
                    </div>
                </div>
                : null}
        </div >
    );
};

export default PostDetail