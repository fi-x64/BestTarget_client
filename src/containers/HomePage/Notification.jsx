import { Avatar, Badge, Button, Dropdown, Input, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import logo from '../../assets/img/logo.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { editReadThongBao, getAllThongBao } from '../../services/thongBao';
import moment from 'moment';
import socket from '../../utils/socketio';
import countTime from '../../utils/countTime';

function Notification() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [items, setItems] = useState();
    const [tinChuaDoc, setTinChuaDoc] = useState();

    const handleClickThongBao = async (thongBaoId) => {
        const res = await editReadThongBao(thongBaoId);
        setTinChuaDoc(res.tinChuaDoc)
        createItems(res);
    }

    function createItems(notiData) {
        const itemArr = [];
        const header = {
            key: 0,
            label: (
                <h1 className='text-base cursor-default font-bold'>Thông báo hệ thống</h1>
            )
        }
        itemArr.push(header);
        notiData && notiData.data.map((value, index) => {
            const item = {
                key: value.chiTiet._id,
                label: (
                    <div onClick={() => handleClickThongBao(value.chiTiet._id)}>
                        {value.chiTiet.loai == 'khuyenMai' || value.chiTiet.loai == 'khac' ?
                            <Link to={value.chiTiet.loai == 'khuyenMai' ? '/walletDashboard' : null} >
                                <div className={!value.chiTiet.daDoc ? 'grid grid-cols-7 max-w-[485px] max-h-[400px] bg-[#e5e7eb]' : 'grid grid-cols-7 max-w-[485px] max-h-[400px]'}  >
                                    <Avatar src={logo} className='w-[60px] h-[60px]' />
                                    <div className='col-span-6 ml-2'>
                                        <h1> Khuyến mãi mới: {value.chiTiet.noiDung}</h1>
                                        <p className='text-gray-500 text-xs'>{countTime(value.chiTiet.thoiGianThongBao)}</p>
                                    </div>
                                </div>
                            </Link> :
                            <Link to={value.chiTiet.loai == 'tinDuocDuyet' ? { pathname: '/postDetail', search: `?id=${value.tinDang[0]._id}` } : value.chiTiet.loai == 'tinBiTuChoi' ? '/managePost/3' : value.chiTiet.loai == 'khuyenMai' ? '/walletDashboard' : null} >
                                <div className={!value.chiTiet.daDoc ? 'grid grid-cols-7 max-w-[485px] max-h-[400px] bg-[#e5e7eb]' : 'grid grid-cols-7 max-w-[485px] max-h-[400px]'}  >
                                    <Avatar src={value?.tinDang[0]?.hinhAnh[0]?.url ? value?.tinDang[0].hinhAnh[0]?.url : avatar} className='w-[60px] h-[60px]' />
                                    <div className='col-span-6 ml-2'>
                                        <h1> {value.chiTiet.noiDung + ": " + value.tinDang[0].tieuDe}</h1>
                                        <p className='text-gray-500 text-xs'>{countTime(value.chiTiet.thoiGianThongBao)}</p>
                                    </div>
                                </div>
                            </Link>
                        }
                    </div>
                )
            }
            itemArr.push(item);
        })
        setItems(itemArr);
    }

    useEffect(() => {
        async function fetchData() {
            if (isLoggedIn) {
                const notiData = await getAllThongBao(user.data._id);

                if (notiData) {
                    setTinChuaDoc(notiData.tinChuaDoc)
                    createItems(notiData);
                }
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (isLoggedIn) {
                socket.on(`thongbao_updated_${user.data._id}`, (data) => {
                    console.log("Check thongbao_updated: ", data);
                    setTinChuaDoc(data.tinChuaDoc)
                    createItems(data);
                })

                let checkKhuyenMai = false;
                socket.on('khuyenmai_updated', async (data) => {
                    // if (data.status == 'success' && user && user.data) {
                    //     socket.emit('khuyenmai_userid', user.data._id);
                    // }
                    // console.log("Check data: ", data);
                    // if (data.status == 'success') {
                    //     checkKhuyenMai = true;
                    // }
                    if (data.status == 'success') {
                        const notiData = await getAllThongBao(user.data._id);
                        console.log("Check checkKhuyenMai: ", checkKhuyenMai);
                        if (notiData) {
                            setTinChuaDoc(notiData.tinChuaDoc)
                            createItems(notiData);
                        }
                    }
                })

            }
            // socket.on(`khuyenmai_updated_data_${user.data._id}`, (data) => {
            //     console.log("Check khuyenmai_updated_data_${user.data._id}: ", data);
            //     setTinChuaDoc(data.tinChuaDoc)
            //     createItems(data);
            // })
        }
        fetchData();
    })

    return (
        <div>
            {isLoggedIn && user && user.data ?
                <div>
                    <Dropdown menu={{ items }} trigger={['click']} className="cursor-pointer max-w-[485px] max-h-[400px]" placement='bottomRight'>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Badge count={tinChuaDoc} size='small'>
                                    <i className="fa-solid fa-bell text-base"></i>
                                </Badge>
                                Thông báo
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                :
                <Link to="/login"><i className="fa-solid fa-bell text-base"></i> Thông báo</Link>
            }

        </div >

    )
}

export default Notification
