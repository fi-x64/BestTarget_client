import { Button, List } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getListTinYeuThich, themTinYeuThich, xoaTinYeuThich } from '../../services/tinYeuThich';
import { toast } from 'react-toastify';

function WishList() {
    const [listTinYeuThich, setListTinYeuThich] = useState();

    useEffect(() => {
        async function fetchData() {
            const listTinYeuThichData = await getListTinYeuThich();

            if (listTinYeuThichData) {
                listTinYeuThichData.data.map((value, index) => {
                    value.tinYeuThich[0].status = true;
                })
                setListTinYeuThich(listTinYeuThichData);
            }
        }
        fetchData()
    }, [])

    const handleXoaTinYeuThich = async (e, tinDangId) => {
        e.preventDefault();
        const res = await xoaTinYeuThich(tinDangId);
        console.log("Check res: ", res);
        if (res) {
            const listTinDangData = { ...listTinYeuThich }
            listTinDangData.data.map((value, index) => {
                if (value.tinYeuThich[0]._id == tinDangId)
                    value.tinYeuThich[0].status = false;
            })
            toast.success(res.message);
            setListTinYeuThich(listTinDangData)
        } else
            toast.error('Huỷ theo dõi không thành công');
    }

    const handleThemTinYeuThich = async (e, tinDangId) => {
        e.preventDefault();

        const res = await themTinYeuThich(tinDangId);

        if (res) {
            const listTinDangData = { ...listTinYeuThich }
            listTinDangData.data.map((value, index) => {
                if (value.tinYeuThich[0]._id == tinDangId)
                    value.tinYeuThich[0].status = true;
            })
            toast.success(res.message);
            setListTinYeuThich(listTinDangData)
        } else
            toast.error('Huỷ theo dõi không thành công');
    }

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
                {listTinYeuThich ?
                    <List
                        pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                        itemLayout="horizontal"
                        dataSource={listTinYeuThich.data}
                        renderItem={(item, index) => (
                            <div className='hover:border-grey-400 hover:border-2'>
                                <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item.tinYeuThich[0]._id}` }}>
                                    <List.Item
                                        actions={[item.tinYeuThich[0].status == true ? <i className="fa-solid fa-heart text-red-600" onClick={(e) => handleXoaTinYeuThich(e, item.tinYeuThich[0]._id)}></i> : <i className="fa-regular fa-heart" onClick={(e) => handleThemTinYeuThich(e, item.tinYeuThich[0]._id)}></i>]}
                                    >
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
