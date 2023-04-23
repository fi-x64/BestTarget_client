import React, { useEffect, useState } from 'react'
import Slider from "react-slick"

import { Link, useNavigate } from 'react-router-dom';
import './SuggestPostsUser.module.scss';
import { getAllTinDangByUserId } from '../../../services/tinDang';
import { NumericFormat } from 'react-number-format';
import countTime from '../../../utils/countTime';

function SuggestPostsUser({ postUserId, postId, postHoTen }) {
    const [data, setData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await getAllTinDangByUserId(postUserId, postId);

            if (res) {
                setData(res);
            }
        }
        fetchData();
    }, []);

    const handleClickItem = (postId) => {
        navigate({
            pathname: `/postDetail`,
            search: `?id=${postId}`,
        })
        window.location.reload();
    }

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "red" }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "green" }}
                onClick={onClick}
            />
        );
    }

    var settings = {
        dots: false,
        infinite: false,
        slidesToShow: 5,
        speed: 500,
        rows: 1,
        slidesPerRow: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <div className="bg-[#fff] mb-5">
            {data && data.length > 0 ?
                <div>
                    <div className='flex justify-between p-4 font-bold text-lg'>
                        <h1>Tin đăng khác của {postHoTen}</h1>
                        <Link to={{ pathname: '/users/profile', search: `?userId=${postUserId}` }} className='text-blue-600'>Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
                    </div>
                    <hr />
                    <div className=''>
                        <Slider {...settings} className="categories p-4 [&>*]:text-[14px] [&>*]:text-center">
                            {data.map((item, index) => {
                                if (item._id != postId) {
                                    return (
                                        <div key={item._id} onClick={() => handleClickItem(item._id)} className="categories-item">
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
                                        </div>
                                    )
                                }
                            })
                            }
                        </Slider>
                    </div >
                </div>
                : null}
        </div>
    )
}

export default SuggestPostsUser
