import React, { useEffect, useState } from 'react';
import { Avatar, Button, Layout, List, Menu, theme } from 'antd';
import { getAllNguoiDung } from '../../services/nguoiDung';
import { Input, Space } from 'antd';
import avatar from '../../assets/img/avatar.svg'
import { getAllPost } from '../../services/tinDang';
const { Search } = Input;

function ManagerPost() {
    const [listPost, setListPost] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await getAllPost();
            if (res) {
                setListPost(res);
            }
        }
        fetchData()
    }, [])

    const onSearch = (value) => console.log(value);

    return (
        <>
            <Search placeholder="input search text" onSearch={onSearch} style={{ width: '500px' }} />
            <div className='p-4'>
                <List
                    pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                    dataSource={listPost}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[<Button className='bg-[#539165]'>Chỉnh sửa</Button>, <Button className='bg-[#F7C04A]'>Xem trang</Button>, <Button className='bg-red-500'>Xoá</Button>]}
                        >
                            <List.Item.Meta
                                avatar={<img className='w-[46px] h-[46px]' src={item.hinhAnh ? item.hinhAnh[0].url : null} />}
                                title={<a href="https://ant.design">{item.tieuDe}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

export default ManagerPost;