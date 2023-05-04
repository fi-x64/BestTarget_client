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
import { createPhongChat } from '../../services/phongChat';
import Map from '../../components/atom/Map/Map';
import Modal from 'react-modal';
import './PostDetail.scss';
import countTime from '../../utils/countTime';
import SuggestPostsUser from '../../components/atom/Suggest/SuggestPostsUser';
import SuggestPostsRelated from '../../components/atom/Suggest/SuggestPostsRelated';
import { createLuotXemTin } from '../../services/luotXemTin';
import postNotFond from '../../assets/img/post_not_found.png';
import SuggestPostsRelatedHot from '../../components/atom/Suggest/SuggestPostsRelatedHot';
import parse from 'html-react-parser';

function PostDetail() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    let navigate = useNavigate();

    const [currentPostData, setCurrentPostData] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [fullDiaChiTin, setFullDiaChiTin] = useState();
    const [isTinYeuThich, setIsTinYeuThich] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isHaveCoord, setIsHaveCoord] = useState(false);
    // const [map, setMap] = useState();

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

                if (isLoggedIn) {
                    await createLuotXemTin({
                        tinDangId: tinDangId,
                        noiDung: {
                            nguoiDungId: user.data._id
                        }
                    })

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

                // if (res.nguoiDungId.diaChi.kinhDo && res.nguoiDungId.diaChi.viDo) {

                //     setMap(<Map />);
                // }
            } else {
                navigate('/')
                window.location.reload()
            }
        }
        fetchData();
    }, [])

    const handleChatSupport = async () => {
        if (isLoggedIn) {
            const res = await createPhongChat({
                nguoiDungId1: user.data._id,
                nguoiDungId2: '64074e99002eba5a852968a0',
                loaiPhongChat: 'hoTro'
            })

            if (res) {
                return navigate('/chat/hoTro')
            }
        } else {
            return navigate('/login');
        }
    }

    const handleXoaTinYeuThich = async (tinDangId) => {
        const res = await xoaTinYeuThich(tinDangId);

        if (res) {
            setIsTinYeuThich(false);
            toast.success(res.message);
        } else
            toast.error('Xoá tin yêu thích không thành công');
    }

    const handleThemTinYeuThich = async (tinDangId) => {
        if (isLoggedIn) {
            const res = await themTinYeuThich(tinDangId);

            if (res) {
                setIsTinYeuThich(true);
                toast.success(res.message);
            } else
                toast.error('Xoá tin yêu thích không thành công');
        } else {
            return navigate('/login');
        }
    }

    const handleChat = async (postId, nguoiDungId2) => {
        if (isLoggedIn) {
            console.log("Check postId, nguoiDungId2: ", postId, nguoiDungId2);
            const res = await createPhongChat({
                nguoiDungId1: user.data._id,
                nguoiDungId2: nguoiDungId2,
                tinDangId: postId,
                loaiPhongChat: "troChuyen"
            })

            if (res) {
                console.log("Check res: ", res);
                return navigate({
                    pathname: `/chat`,
                    search: `?phongChatId=${res[0]._id}`,
                })
            }
        } else {
            return navigate('/login');
        }
    }

    const handleOpenMap = (longitude, latitude) => {
        if (longitude && latitude) {
            setIsHaveCoord(true);
            setIsMapOpen(true);
        }
    }

    const handleMapCancel = () => {
        setIsHaveCoord(false);
        setIsMapOpen(false);
    }

    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    var settingsMapOpen = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    return (
        <div className="container">
            {currentPostData ?
                <div>
                    <div className='flex bg-[#fff] mb-5'>
                        <div className="h-auto">
                            <Slider className="w-[606px] h-[455px] z-0"  {...settings}>
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
                            <div className='p-3 w-[606px]'>
                                <h1 className='float-right italic text-sm'>Tin đăng {currentPostData.khoangThoigian}</h1>
                                <h1 className='font-bold text-lg'>{currentPostData.tieuDe}</h1>
                                <div className='flex justify-between'>
                                    <NumericFormat className='text-red-600 py-2' value={currentPostData.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                    {isTinYeuThich && isLoggedIn ? <Button className='rounded-[20px] border-red-600 text-red-600' onClick={() => handleXoaTinYeuThich(currentPostData._id)}>Đã lưu<i className="fa-solid fa-heart ml-1"></i></Button>
                                        : <Button className='rounded-[20px] border-red-600 text-red-600' onClick={() => handleThemTinYeuThich(currentPostData._id)}>Lưu tin<i className="fa-regular fa-heart ml-2"></i></Button>}
                                </div>
                                {parse(parse(currentPostData.moTa.html))}
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
                                <Button className='mt-4 bg-[#fe991b]' onClick={() => handleChatSupport()}>Có điều gì đó không ổn về tin đăng này? Nhắn cho CSKH để được trợ giúp</Button>
                                <div className='flex mt-4'>
                                    <img src={shield} alt="" className='w-[35px] h-[35px]' />
                                    <p className='text-xs'><i>Tin đăng này đã được kiểm duyệt. Nếu gặp vấn đề, vui lòng báo cáo tin đăng hoặc liên hệ CSKH để được trợ giúp.</i></p>
                                </div>
                            </div>
                        </div>
                        <div className='pl-4'>
                            <Link to={{ pathname: '/users/profile', search: `?userId=${currentPostData.nguoiDungId._id}` }} className='flex gap-3 p-[15px]'>
                                <img className='w-[46px] h-[46px] rounded-[50%]' src={currentPostData?.nguoiDungId?.anhDaiDien?.url ? currentPostData.nguoiDungId.anhDaiDien.url : avatar} alt="" />
                                <div className='block text-sm'>
                                    <p>{currentPostData.nguoiDungId.hoTen}</p>
                                    <p><i className="fa-solid fa-circle text-green-600 text-[10px] mr-1"></i>Đang hoạt động</p>
                                </div>
                                <Button className='ml-8 rounded-[25px]' >Xem trang</Button>
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
                                <a href={`tel:+${currentPostData.nguoiDungId.sdt}`}>
                                    <Button className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                        <div className='flex gap-1'>
                                            <i className="fa-solid fa-phone-volume mt-[4px]"></i>
                                            <p className='ml-2'>{currentPostData.nguoiDungId.sdt}</p>
                                        </div>
                                    </Button>
                                </a>
                                {isLoggedIn && currentPostData.nguoiDungId._id === user.data._id ?
                                    <Link to={{ pathname: '/postEdit', search: `?id=${currentPostData._id}` }} >
                                        <Button className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                            <i className="fa-solid fa-pen-to-square mt-[4px]"></i>
                                            <p>CHỈNH SỬA TIN ĐĂNG</p>
                                        </Button>
                                    </Link> :
                                    <Button className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold' onClick={() => handleChat(currentPostData._id, currentPostData.nguoiDungId._id)}>
                                        <i className="fa-solid fa-message mt-[4px]"></i>
                                        <p>CHAT VỚI NGƯỜI BÁN</p>
                                    </Button>
                                }
                                <Button onClick={() => handleOpenMap(currentPostData?.nguoiDungId?.diaChi?.kinhDo, currentPostData?.nguoiDungId?.diaChi?.viDo)} className='flex justify-between w-[95%] h-[45px] text-base ml-[10px] gap-2 mt-[10px] pt-[10px] text-[#3c763d] font-bold'>
                                    <i className="fa-solid fa-map-location-dot mt-[4px]"></i>
                                    <p>XEM VỊ TRÍ NGƯỜI ĐĂNG</p>
                                </Button>
                                {isHaveCoord ?
                                    <Modal ariaHideApp={false}
                                        className={'map-component w-[850px] h-[400px]'}
                                        contentLabel="Bản đồ" isOpen={isMapOpen}
                                        onRequestClose={handleMapCancel}
                                    >
                                        <Button className='float-right bg-[#fff] mb-1' onClick={handleMapCancel}><i className="fa-solid fa-x mr-2"></i> Đóng</Button>
                                        <Map staticLongitude={currentPostData?.nguoiDungId?.diaChi?.kinhDo} staticLatitude={currentPostData?.nguoiDungId?.diaChi?.viDo} />
                                    </Modal> : null
                                }
                                {!isHaveCoord && isMapOpen ?
                                    <h1 className='text-red-700'>{currentPostData.nguoiDungId.hoTen} chưa lưu vị trí. Hãy nhắn tin cho người bán để biết trao đổi và yêu cầu họ cung cấp vị trí</h1>
                                    : null}
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
                    <SuggestPostsUser postUserId={currentPostData.nguoiDungId._id} postId={currentPostData._id} postHoTen={currentPostData.nguoiDungId.hoTen} />
                    <SuggestPostsRelated currentPostData={currentPostData} />
                    <SuggestPostsRelatedHot currentPostData={currentPostData} />
                </div>
                :
                <div className="container">
                    <div className='bg-[#fff] py-40'>
                        <div className="translate-x-[30%]">
                            <img src={postNotFond} alt="" />
                        </div>
                        <div className='block text-center'>
                            <h1 className='text-2xl font-bold'>Tin đăng không còn tồn tại</h1>
                            <p>Tin đăng này đã hết hạn hoặc đã ẩn/ đã bán. Hãy thử những tin đăng khác, bạn nhé.</p>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
};

export default PostDetail