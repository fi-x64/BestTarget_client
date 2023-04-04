import { List } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getListTinYeuThich } from '../../services/tinYeuThich';

function WishList() {
    const [listTinYeuThich, setListTinYeuThich] = useState();

    useEffect(() => {
        async function fetchData() {
            const data = await getListTinYeuThich();

            if (data) {
                setListTinYeuThich(data);
            }
        }
        fetchData()
    }, [])

    return (
        <div className="container">
            <div className="bg-[#fff]">
                <div className="pl-[15px] py-[15px] bg-white">
                    <div className='font-bold'>
                        Tin đăng đã lưu
                    </div>
                </div>
            </div>
            <div className='mt-[15px] bg-[#fff]'>
                {
                    console.log("Check listTinYeuThich: ", listTinYeuThich)

                }
                {listTinYeuThich ?
                    <List
                        pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                        itemLayout="horizontal"
                        dataSource={listTinYeuThich.data}
                        renderItem={(item, index) => (
                            <div className='hover:border-grey-400 hover:border-2'>
                                <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item.tinYeuThich[0]._id}` }}>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<img className='w-[128px] h-[128px]' src={item.tinYeuThich[0].hinhAnh[0].url} />}
                                            title={item.tinYeuThich[0].tieuDe}
                                            description={item.tinYeuThich[0].gia}
                                        />
                                    </List.Item>
                                </Link>
                            </div>
                        )}
                    />
                    : null}
            </div>
        </div>
    )
}

export default WishList
