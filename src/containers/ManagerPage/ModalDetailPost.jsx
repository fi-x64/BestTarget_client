import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Button, Divider, Image, Rate } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getTinDangIdRestrict } from '../../services/tinDang';
import Slider from 'react-slick';
import ReactPlayer from 'react-player'
import { NumericFormat } from 'react-number-format';
import { getOneDiaChi } from '../../services/diaChi';

function ModalDetailPost({ postId }) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    let navigate = useNavigate();

    const [currentPostData, setCurrentPostData] = useState();
    const [fullDiaChiTin, setFullDiaChiTin] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await getTinDangIdRestrict(postId);

            if (res) {
                const diaChiData = await getOneDiaChi(res.diaChiTinDang.tinhTPCode, res.diaChiTinDang.quanHuyenCode, res.diaChiTinDang.phuongXaCode);

                if (diaChiData) {
                    setFullDiaChiTin(diaChiData);
                }

                setCurrentPostData(res);
            } else {
                navigate('/managerPage')
                window.location.reload()
            }
        }
        fetchData();
    }, [postId])

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
                <div className='bg-[#fff] mb-5'>
                    <div>
                        <Slider className="w-[606px] h-[455px]" {...settings}>
                            {currentPostData.video ? currentPostData.video.map((value, index) => {
                                return (
                                    <ReactPlayer key={value.public_id} url={value.url} controls width={606} height={455} />
                                )
                            })
                                : null}
                            {currentPostData.hinhAnh.map((value, index) => {
                                return (
                                    <Image key={value.public_id} src={value.url} alt="" height={455} width={606} className='object-contain bg-gray-200' />
                                )
                            })
                            }
                        </Slider>
                        <div className='p-3'>
                            <h1 className='font-bold'>{currentPostData.tieuDe}</h1>
                            <div className='flex justify-between'>
                                <NumericFormat className='text-red-600 py-2' value={currentPostData.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
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
                        </div>
                    </div>
                    <div>
                        <h1 className='text-lg font-semibold p-[15px]'>Người đăng tin</h1>
                        <Link to={{ pathname: '/users/profile', search: `?userId=${currentPostData.nguoiDungId._id}` }} className='flex gap-3 p-[15px] text-center justify-center'>
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
                        <div className='flex justify-center'>
                            <Button className='flex justify-between  w-[50%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                <div className='flex gap-1'>
                                    <i className="fa-solid fa-phone-volume mt-[4px]"></i>
                                    <p>{currentPostData.nguoiDungId.sdt}</p>
                                </div>
                            </Button>
                            <Button className='flex justify-between w-[50%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                <i className="fa-solid fa-message mt-[4px]"></i>
                                <p>CHAT VỚI NGƯỜI BÁN</p>
                            </Button>
                        </div>
                    </div>
                </div>
                : null}
        </div >
    );
};

export default ModalDetailPost