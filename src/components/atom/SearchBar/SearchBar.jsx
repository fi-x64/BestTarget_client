import React, { useState } from 'react'

import classNames from 'classnames/bind';
import { Input, List, Avatar } from 'antd';

const { Search } = Input;

import styles from './SearchBar.module.scss';
import { handleTimKiem } from '../../../services/timKiem';
import { Link, useNavigate } from 'react-router-dom';
// import { handleSearchAPI } from '../../../services/user';
const cl = classNames.bind(styles);

function SearchBar() {
    const [showResult, setShowResult] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const naviagte = useNavigate();

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

    const handleClickResult = (text) => {
        setShowResult(false);
        setValue(text);
    };

    const handleKeyUp = (event) => {
        if (event.keyCode === 13) {
            naviagte(`/postList?&keyWord=${value}`)
            setShowResult(false);
        }
    }

    const handleClick = () => {
        naviagte(`/postList?&keyWord=${value}`)
        setShowResult(false);
    }

    return (
        <div>
            <Search className='z-[100] bg-[#FF8800] lg:rounded-lg' size='middle'
                placeholder="Tìm kiếm mọi thứ trên Best Target"
                onChange={handleSearch}
                style={{ width: '' }}
                allowClear={true}
                // onClick={handleClick}
                onSearch={handleClick}
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
                                                onClick={() => handleClickResult(item.hangSX.label)}
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
                                                handleClickResult(item.tieuDe)
                                            }}>{item.tieuDe} <p className='ml-1' style={{ color: "#3a8ece" }}> trong {item.danhMucPhu[0].ten}</p></Link>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </>
                        : null}
                </div>
                : null}

        </div>
    )
}

export default SearchBar
