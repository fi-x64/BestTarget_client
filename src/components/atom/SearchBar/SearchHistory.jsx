import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind';
import { Input, List, Avatar } from 'antd';

const { Search } = Input;

import styles from './SearchHistory.module.scss';
import { handleTimKiem } from '../../../services/timKiem';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createLichSuTimKiem, deleteAllSearchHistory, getLichSuTimKiemByUserId } from '../../../services/lichSuTimKiem';
import { toast } from 'react-toastify';
const cl = classNames.bind(styles);

function SearchHistory({ setShowSearchHistory }) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const res = await getLichSuTimKiemByUserId(user.data._id);
            if (res) {
                setData(res);
            }
        }
        fetchData();
    }, []);

    const handleClickResult = () => {
        setShowSearchHistory(false);
    }

    const handleDeleteAll = async () => {
        const res = await deleteAllSearchHistory(user.data._id);

        if (res.status === 'success') {
            setShowSearchHistory(false);
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    return (
        <div >
            {data && data.length > 0 ?
                <div className='absolute w-[807px] z-50'>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        style={{ backgroundColor: '#fff' }}
                        header={
                            <div className='flex justify-between px-2'>
                                <div className='ml-[8px] text-sm font-bold'>Lịch sử tìm kiếm</div>
                                <div className='ml-[8px] text-sm font-bold cursor-pointer text-blue-600' onClick={() => handleDeleteAll()}>Xoá tất cả</div>
                            </div>
                        }
                        renderItem={(item) => (
                            <div>
                                {item?.noiDung?.hangSX ?
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<Link to={{ pathname: '/postList', search: `?hangSX=${encodeURIComponent(item.noiDung.hangSX.value)}&danhMucPhuId=${encodeURIComponent(item.noiDung.danhMucPhuId)}` }} className='flex'
                                                onClick={() => handleClickResult()} >{item.noiDung.hangSX.label} <p className='ml-1' style={{ color: "#3a8ece" }}> trong {item.noiDung.danhMucPhu[0].ten}</p></Link>}
                                        />

                                    </List.Item>
                                    : item?.noiDung?.danhMucPhuId ? <List.Item>
                                        <List.Item.Meta
                                            title={<Link to={{ pathname: '/postList', search: `?keyWord=${encodeURIComponent(item.noiDung.tieuDe)}&danhMucPhuId=${encodeURIComponent(item.noiDung.danhMucPhuId)}` }} className='flex'
                                                onClick={() => handleClickResult()}  >{item.noiDung.tieuDe} <p className='ml-1' style={{ color: "#3a8ece" }}> trong {item.noiDung?.danhMucPhu[0]?.ten}</p></Link>}
                                        />
                                    </List.Item> : item?.noiDung?.tieuDe ? <List.Item>
                                        <List.Item.Meta
                                            title={<Link to={{ pathname: '/postList', search: `?keyWord=${encodeURIComponent(item.noiDung.tieuDe)}` }} className='flex'
                                                onClick={() => handleClickResult()}  >{item.noiDung.tieuDe} <p className='ml-1' style={{ color: "#3a8ece" }}></p></Link>}
                                        />
                                    </List.Item> : null}
                            </div>
                        )}
                    />
                </div>
                : null}
        </div>
    )
}

export default SearchHistory
