import React, { useState } from 'react'

import classNames from 'classnames/bind';
import { Input, List, Avatar } from 'antd';

const { Search } = Input;

import styles from './SearchBar.module.scss';
// import { handleSearchAPI } from '../../../services/user';
const cl = classNames.bind(styles);

function SearchBar() {
    // const [showResult, setShowResult] = useState(false);
    // const [data, setData] = useState([]);

    const handleSearch = async (e) => {
        console.log("Check search: ", e.target.value);
        // let res = await handleSearchAPI({ data: e.target.value });
        // if (res.length > 0) {
        //     setShowResult(true);
        //     setData(res);
        // } else {
        //     setShowResult(false)
        //     setData([])
        // };
    }

    // const handleClickResult = (item) => {
    //     toggleAddPane(false);
    //     togglePane(true);
    //     setCurrentStation(item);
    //     setNewTemporaryMarker([
    //         item.latitude,
    //         item.longitude
    //     ])
    //     showPopUp(item.longitude, item.latitude);
    //     setShowResult(false);
    // }

    return (
        <div>
            <Search className='z-[100] bg-[#FF8800] lg:rounded-lg' size='middle'
                placeholder="Tìm kiếm mọi thứ trên Best Target"
                onChange={handleSearch}
                style={{ width: '' }}
                allowClear={true}
            // onClick={handleSearch}
            />
            {/* {showResult ?
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    style={{ backgroundColor: '#fff' }}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.images[0].url} />}
                            title={<a style={{ color: "#3a8ece" }} onClick={() => {
                                handleClickResult(item)
                            }}>{item.name}</a>}
                            description={<a style={{ color: "#000" }} onClick={() => {
                                handleClickResult(item)
                            }}>{item.address}</a>}
                        />
                    </List.Item>
                )}
                /> : null} */}

        </div>
    )
}

export default SearchBar
