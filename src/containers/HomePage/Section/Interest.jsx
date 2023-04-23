import React, { useEffect, useState } from 'react'
import { getAllPostsNewest } from '../../../services/tinDang';
import { Button, List, Skeleton } from 'antd';
import countTime from '../../../utils/countTime';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';

function Interest() {
    var amount = 10;
    const [data, setData] = useState();
    const [end, setEnd] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await getAllPostsNewest(amount);

            if (res) {
                setData(res);
            }
        }
        fetchData();
    }, [])

    const onLoadMore = async () => {
        amount = amount + 10;
        const res = await getAllPostsNewest(amount);

        if (res) {
            console.log("Check res: ", res);
            setData(res);
            window.dispatchEvent(new Event('resize'));
            if (res.length < amount) {
                setEnd(true);
            }
        }
    };

    return (
        <>
            {data ?
                <div className='wrapper-interest my-3 pb-3 bg-[#fff] h-auto'>
                    <div className='interest-title'>
                        <h1 className='p-4 font-semibold text-lg'>Tin đăng mới nhất</h1>
                        <hr />
                    </div>
                    <div className='grid gap-4 grid-cols-5 p-[16px]'>
                        {data.map((item, index) => {
                            return (
                                <Link key={item._id} to={{ pathname: '/postDetail', search: `?id=${item._id}` }} className="categories-item">
                                    <div className='interest-items block cursor-pointer hover:shadow-inner-lg hover:shadow-lg'>
                                        <img className="item-image w-[166px] p-[4px] h-[166px] object-cover" src={item.hinhAnh[0].url} alt="" />
                                        <div className="item-title my-2 text-[14px]">{item.tieuDe}</div>
                                        <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                        <div className="item-info flex">
                                            <img className='item-avatar w-[19px] h-[16px] mt-[7px]' src="https://static.chotot.com/storage/chotot-icons/svg/user.svg" alt="" />
                                            <div className='common-style m-[2px] after:content-["·"]'></div>
                                            <div className="item-time my-2 text-[10px] font-extralight">{countTime(item.thoiGianPush)}</div>
                                            <div className='common-style m-[2px] after:content-["·"]'></div>
                                            <div className="item-place my-2 text-[10px] font-extralight">{item.tinhThanhPho[0].ten}</div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                        }
                    </div>
                    {amount <= 50 ? <div
                        style={{
                            textAlign: 'center',
                            marginTop: 12,
                            height: 32,
                            lineHeight: '32px',
                        }}
                    >
                        {!end ? <Button onClick={onLoadMore}>Xem thêm</Button> : <Button disabled>Đã tải hết</Button>}
                    </div> : null}
                </div >
                : null}
        </>
    )
}

export default Interest
