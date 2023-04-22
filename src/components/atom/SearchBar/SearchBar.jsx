import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind';
import { Input, List, Avatar } from 'antd';

const { Search } = Input;

import styles from './SearchBar.module.scss';
import { handleTimKiem } from '../../../services/timKiem';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createLichSuTimKiem, getLichSuTimKiemByUserId } from '../../../services/lichSuTimKiem';
import SearchHistory from './SearchHistory';
const cl = classNames.bind(styles);

function SearchBar() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [showResult, setShowResult] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const [showSearchHistory, setShowSearchHistory] = useState(false);

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    useEffect(() => {
        /**
         * Lắng nghe sự kiện click trên document
         * Nếu click ngoài dropdown, đóng dropdown
         */
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSearchHistory(false);
                setShowResult(false);
            }
        }

        // Đăng ký lắng nghe sự kiện click trên document
        document.addEventListener("mousedown", handleClickOutside);

        // Hủy đăng ký lắng nghe khi component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSearch = async (e) => {
        setValue(e.target.value);
        if (e.target.value != '') {
            let res = await handleTimKiem(e.target.value);

            if (res) {
                setShowResult(true);
                setData(res);
            } else {
                setShowResult(false)
                setData([])
            };
        } else {
            setShowResult(false)
            setData([])
        }
    }

    const handleClickResult = async (values) => {
        if (isLoggedIn) {
            const res = await createLichSuTimKiem({
                nguoiDungId: user.data._id,
                noiDung: values
            });
        };
        setShowResult(false);
        setShowSearchHistory(false);
        if (values.hangSX) {
            setValue(values.hangSX.label);
        } else {
            setValue(values.tieuDe);
        }
    };

    const handleKeyUp = async (event) => {
        if (event.keyCode === 13) {
            if (isLoggedIn) {
                const res = await createLichSuTimKiem({
                    nguoiDungId: user.data._id,
                    noiDung: {
                        tieuDe: value
                    }
                });
            };
            navigate(`/postList?&keyWord=${value}`)
            setShowResult(false);
        }
    }

    const handleClickSearchBar = async (e) => {
        if (e?.target?.value) {
            handleSearch(e);
        } else {
            if (isLoggedIn) {
                setShowSearchHistory(true);
            }
        }
    }

    return (
        <div ref={dropdownRef}>
            <Search className='z-[100] bg-[#FF8800] lg:rounded-lg' size='middle'
                placeholder="Tìm kiếm mọi thứ trên Best Target"
                onChange={handleSearch}
                allowClear={true}
                onClick={handleClickSearchBar}
                // onSearch={handleClick}
                value={value}
                onKeyUp={(e) => handleKeyUp(e)}
            />
            {showResult ?
                <div className='absolute w-[807px] z-50'>
                    {data.hangSX.length > 0 ?
                        <>
                            <List
                                itemLayout="horizontal"
                                dataSource={data.hangSX}
                                style={{ backgroundColor: '#fff' }}
                                header={<div className='ml-[8px] text-sm font-bold'>Danh mục</div>}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<Link to={{ pathname: '/postList', search: `?hangSX=${encodeURIComponent(item.hangSX.value)}&danhMucPhuId=${encodeURIComponent(item.danhMucPhu[0].danhMucPhuId)}` }} className='flex'
                                                onClick={() => handleClickResult({ hangSX: item.hangSX, danhMucPhuId: item.danhMucPhu[0].danhMucPhuId })}
                                            >{item.hangSX.label} <p className='ml-1' style={{ color: "#3a8ece" }}> trong {item.danhMucPhu[0].ten}</p></Link>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </>
                        : null}
                    {data.tinDang.length > 0 ?
                        <>
                            <List
                                itemLayout="horizontal"
                                dataSource={data.tinDang}
                                style={{ backgroundColor: '#fff' }}
                                header={<div className='ml-[8px] text-sm font-bold'>Tin đăng</div>}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<Link to={{ pathname: '/postList', search: `?keyWord=${encodeURIComponent(item.tieuDe)}&danhMucPhuId=${encodeURIComponent(item.danhMucPhu[0].danhMucPhuId)}` }} className='flex' onClick={() => {
                                                handleClickResult({ tieuDe: item.tieuDe, danhMucPhuId: item.danhMucPhu[0].danhMucPhuId })
                                            }}>{item.tieuDe} <p className='ml-1' style={{ color: "#3a8ece" }}> trong {item.danhMucPhu[0].ten}</p></Link>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </>
                        : null}
                </div>
                : null}
            {showSearchHistory ? <SearchHistory setShowSearchHistory={setShowSearchHistory} /> : null}
        </div>
    )
}

export default SearchBar
