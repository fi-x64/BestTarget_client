import React, { useEffect, useState } from 'react';
import { Avatar, Button, Layout, List, Menu, theme } from 'antd';
import { getAllNguoiDung } from '../../services/nguoiDung';
import { Input, Space } from 'antd';
import avatar from '../../assets/img/avatar.svg'
const { Search } = Input;

function ManagerUsers() {
    const [listUser, setListUser] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await getAllNguoiDung();
            console.log("Check res: ", res);
            if (res) {
                setListUser(res);
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
                    dataSource={listUser}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[<Button className='bg-[#539165]'>Chỉnh sửa</Button>, <Button className='bg-[#F7C04A]'>Xem trang</Button>, <Button className='bg-red-500'>Xoá</Button>]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.anhDaiDien.url ? item.anhDaiDien.url : avatar} />}
                                title={<a href="https://ant.design">{item.hoTen}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

export default ManagerUsers;