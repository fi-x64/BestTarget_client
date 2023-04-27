import React, { useEffect, useState } from 'react'
import { getAllPostsNewest } from '../../../services/tinDang';
import { Button, List, Skeleton } from 'antd';
import countTime from '../../../utils/countTime';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { statisticsLuotXemTinInWeek } from '../../../services/luotXemTin';

function Interest() {
    var amount = 10;
    const [data, setData] = useState();
    const [end, setEnd] = useState(false);
    const [hotPost, setHotPost] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await getAllPostsNewest(amount);
            const hotPostData = await statisticsLuotXemTinInWeek();

            if (res) {
                setData(res);
            }
            if (hotPostData) {
                console.log("Check hotPostData: ", hotPostData);
                setHotPost(hotPostData);
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

            <div>
                <div className='wrapper-interest my-3 pb-3 bg-[#fff] h-auto'>
                    <div className='interest-title'>
                        <h1 className='p-4 font-semibold text-lg'>Tin đăng đang HOT trong 7 ngày</h1>
                        <hr />
                    </div>
                    <div>
                        {hotPost ?
                            <List
                                itemLayout="horizontal"
                                dataSource={hotPost}
                                renderItem={(item, index) => (
                                    <div className='hover:border-grey-400 hover:border-2'>
                                        <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item.tinDang[0]._id}` }}>
                                            <List.Item
                                                // actions={<i className="fa-solid fa-medal"></i>}
                                                actions={index == 0 ? [<i className="fa-solid fa-medal text-3xl text-[#fdca26]"></i>] : index == 1 ? [<i className="fa-solid fa-medal text-3xl text-[#e4e7e7]"></i>] : index == 2 ? [<i className="fa-solid fa-medal text-3xl text-[#ec9d5c]"></i>] : null}
                                            >
                                                <List.Item.Meta
                                                    avatar={<img className='w-[128px] h-[128px]' src={item.tinDang[0].hinhAnh[0].url} />}
                                                    title={
                                                        <>
                                                            <p>{item.tinDang[0].tieuDe}</p>
                                                            <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.tinDang[0].gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                                        </>

                                                    }
                                                    description={
                                                        <div>

                                                            <h1><p className='mt-10'>Lượt xem tin: {item.tongLuotXemTin}</p>{countTime(item.tinDang[0].thoiGianPush)}</h1>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        </Link>
                                    </div>
                                )}
                            />
                            : null}
                    </div>
                </div >
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
            </div>
        </>
    )
}

export default Interest
