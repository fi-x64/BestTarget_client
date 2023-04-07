import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Avatar, Button, List, Modal, Popover, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { countTrangThaiTin, editPost, getTinDang, updateTinHetHan } from '../../services/tinDang';
import moment from 'moment';
import { editUser, getCurrentUser } from '../../services/nguoiDung';
import { updateUser } from '../../actions/auth';

function ManagePost() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [countTTTin, setCountTTTin] = useState();
    const [tinDangData, setTinDangData] = useState();
    const [isAbleRestore, setIsAbleRestore] = useState();
    const [isModalPaymentOpen, setIsModalPaymentOpen] = useState();
    const [currentPostId, setCurrentPostId] = useState();
    const [isModalReasonOpen, setIsModalReasonOpen] = useState(false);
    const [currentReason, setCurrentReason] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            await updateTinHetHan();
            setCountTTTin(await countTrangThaiTin());
        }
        fetchData();
    }, [])

    useEffect(() => {
        async function fetchData() {
            setTinDangData(await getTinDang(1));
        }
        fetchData();
    }, [])

    const onChange = async (key) => {
        var res = '';
        res = await getTinDang(key);
        if (res) {
            setTinDangData(res);
        }
    };

    const handleAnTin = async (id) => {
        const res = await editPost(id, { trangThaiTin: 'Tin đã ẩn' });
        if (res) {
            await updateTinHetHan();
            setCountTTTin(await countTrangThaiTin());
            setTinDangData(await getTinDang(1));
        }
    }

    const handleHienThiTin = async (id) => {
        const res = await editPost(id, { trangThaiTin: 'Đang hiển thị' });
        if (res) {
            await updateTinHetHan();
            setCountTTTin(await countTrangThaiTin());
            setTinDangData(await getTinDang(1));
            window.location.reload();
        }
    }

    const handleGetSoLuong = (data, key) => {
        if (data)
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == key) {
                    return data[i].soLuong
                }
            }
        return 0
    }

    const handleKhoiPhucTin = (postId) => {
        if (user.data.goiTinDang.soLuongTinDang <= 0) {
            setIsAbleRestore(false);
            setIsModalPaymentOpen(true);
        } else {
            setIsAbleRestore(true);
            setIsModalPaymentOpen(true);
            setCurrentPostId(postId);
        }
    }

    const handlePaymentOk = async () => {
        const soLuongTinDang = user.data.goiTinDang.soLuongTinDang - 1;
        const values = {
            "goiTinDang": {
                id: user.data.goiTinDang.id._id,
                soLuongTinDang: soLuongTinDang
            }
        }
        const newPostData = await editPost(currentPostId, { trangThaiTin: 'Đang hiển thị', thoiGianPush: Date.now() });

        if (newPostData) {
            const updateUserData = await editUser(values);
            if (updateUserData) {
                const newUserData = await getCurrentUser();
                const userData = { ...user };
                userData.data = newUserData.data;
                localStorage.setItem("user", JSON.stringify(userData));
                dispatch(updateUser(userData));
                window.location.reload();
            }
        }

    };

    const handlePaymentCancel = () => {
        setIsModalPaymentOpen(false);
    };

    const handleOpenModalReason = (reason) => {
        setIsModalReasonOpen(true);
        setCurrentReason(reason);
    }

    const handleReasonCancel = () => {
        setIsModalReasonOpen(false);
        setCurrentReason("");
    }

    const content = (id) => {
        return (
            <div>
                <Link to={{ pathname: '/postEdit', search: `?id=${id}` }} >Sửa tin</Link>
                <p onClick={() => handleAnTin(id)} className='cursor-pointer'>Đã bán/Ẩn tin</p>
            </div>
        )
    };

    const getListItem = (tinDangData, status) => {
        return (
            <>
                <List
                    pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                    dataSource={tinDangData}
                    renderItem={(item) => (
                        <List.Item key={item._id}>
                            <List.Item.Meta
                                avatar={<img className='w-[120px] h-[70px]' src={item.hinhAnh[0].url} alt="" />}
                                title={status === 'Đang hiển thị' ? <Link to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</Link> : <p to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className='text-base'>{item.tieuDe}</p>}
                                description={
                                    <>
                                        <p className='text-sm text-red-600'>{item.gia} đ</p>
                                        {
                                            status === 'Đang hiển thị' || status === 'Tin đã ẩn' ?
                                                <p className='text-xs'>Tin đăng còn {60 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ hết hạn</p>
                                                : status === 'Bị từ chối' ?
                                                    <>
                                                        {item?.lyDoTuChoi ? <h1 className='italic underline cursor-pointer text-red-600' onClick={() => handleOpenModalReason(item.lyDoTuChoi)}> Nhấn để xem lý do huỷ</h1> : null}
                                                        <p className='text-xs'>Tin đăng còn {5 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ bị xoá vĩnh viễn</p>
                                                    </>
                                                    : status === 'Hết hạn' ?
                                                        <p className='text-xs'>Tin đăng còn {75 - moment(Date.now()).diff(item.thoiGianPush, 'days')} ngày nữa sẽ bị xoá vĩnh viễn</p>
                                                        : null
                                        }
                                    </>}
                            />
                            {status === 'Đang hiển thị' ?
                                <Popover placement="bottomRight" content={content(item._id)} trigger="click">
                                    <div className='cursor-pointer text-lg'><i className="fa-solid fa-ellipsis-vertical"></i></div>
                                </Popover>
                                : status === 'Đang đợi duyệt' ?
                                    // <Popover placement="bottomRight" trigger="click">
                                    <Button disabled className='float-right'>Đang đợi duyệt</Button>
                                    // </Popover> 
                                    : status === 'Bị từ chối' ?
                                        <i className="fa-solid fa-circle-exclamation text-red-600 text-xl"></i>
                                        : status === 'Hết hạn' ?
                                            <Button onClick={() => handleKhoiPhucTin(item._id)}>Khôi phục tin</Button>
                                            :
                                            <Button onClick={() => handleHienThiTin(item._id)}>Hiển thị tin</Button>
                            }
                            {isAbleRestore ? <Modal title="Xác nhận khôi phục tin" open={isModalPaymentOpen} onCancel={handlePaymentCancel} onOk={() => handlePaymentOk(item._id)} footer={[
                                <Button key="back" onClick={handlePaymentCancel}>
                                    Thoát
                                </Button>,
                                <Button
                                    className='bg-[#ffba00]'
                                    key="ok"
                                    onClick={handlePaymentOk}
                                >
                                    Ok
                                </Button>,
                            ]}>
                                <div>
                                    <h1>Bạn sẽ bị trừ đi 1 lượt đăng tin nếu khôi phục tin thành công. Bạn có đồng ý không?</h1>
                                </div>
                            </Modal> :
                                <Modal title="Không đủ lượt đăng tin" open={isModalPaymentOpen} onCancel={handlePaymentCancel} footer={null}>
                                    <div className=''>
                                        <h1>Lượt đăng tin trong tài khoản của bạn đã hết. Vui lòng mua thêm lượt đăng tin tại <Link to="/walletDashboard" className='text-[#ffba22]'>đây</Link> </h1>
                                    </div>
                                </Modal>
                            }
                        </List.Item >
                    )
                    }
                />
                <Modal title="Lý do tin từ chối hiển thị" open={isModalReasonOpen} onCancel={handleReasonCancel} footer={[
                    <Button key="back" onClick={handleReasonCancel}>
                        Đóng
                    </Button>,
                ]}>
                    <div>
                        <h1>{currentReason}</h1>
                    </div>
                </Modal>
            </>
        )
    }

    const items = [
        {
            key: '1',
            label: 'Đang hiển thị (' + handleGetSoLuong(countTTTin, "Đang hiển thị") + ')',
            children: getListItem(tinDangData, "Đang hiển thị")
        },
        {
            key: '2',
            label: 'Hết hạn (' + handleGetSoLuong(countTTTin, "Hết hạn") + ')',
            children: getListItem(tinDangData, "Hết hạn"),
        },
        {
            key: '3',
            label: 'Bị từ chối (' + handleGetSoLuong(countTTTin, "Bị từ chối") + ')',
            children: getListItem(tinDangData, "Bị từ chối"),
        },
        {
            key: '4',
            label: 'Đang đợi duyệt (' + handleGetSoLuong(countTTTin, "Đang đợi duyệt") + ')',
            children: getListItem(tinDangData, "Đang đợi duyệt"),
        },
        {
            key: '5',
            label: 'Tin đã ẩn (' + handleGetSoLuong(countTTTin, "Tin đã ẩn") + ')',
            children: getListItem(tinDangData, "Tin đã ẩn"),
        },
    ];

    return (
        <div className="container bg-[#f4f4f4]">
            <div className="max-w-[712px] pb-2 bg-[#fff]">
                <div>
                    <h1 className='p-4 font-semibold text-lg'>Quản lý tin đăng</h1>
                    <hr />
                </div>
                <div className="grid grid-cols-3 pl-[15px] pt-[15px] bg-white">
                    <div className='flex col-span-2'>
                        <img src={user.data.anhDaiDien.url ? user.data.anhDaiDien.url : avatar} alt="user's avatar" className='avatar w-[80px] h-[80px] rounded-[50%]' />
                        <div className="grid grid-rows-3 ml-4">
                            <div className="...">{user.data.hoTen}</div>
                            <div className='text-[13px] grid grid-cols-2 border-blue-500 border-solid gap-2'>
                                <Button> <Link to={{ pathname: '/users/profile', search: `?userId=${user.data._id}` }}>Trang cá nhân</Link></Button>
                                <Button>Liên kết ví bán hàng</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='pl-[15px]'>
                    <Tabs defaultActiveKey="1" items={items} tabBarGutter={50} onChange={onChange} />
                </div>
            </div>
        </div>
    );
};

export default ManagePost