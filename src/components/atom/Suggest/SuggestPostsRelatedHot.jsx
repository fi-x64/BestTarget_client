import React, { useEffect, useState } from 'react'
import Slider from "react-slick"

import { Link, useNavigate } from 'react-router-dom';
import './Suggest.module.scss';
import { getAllTinDangByUserId, getAllTinDangRelated } from '../../../services/tinDang';
import { NumericFormat } from 'react-number-format';
import countTime from '../../../utils/countTime';
import { useSelector } from 'react-redux';
import { getAllTinDangRelatedHot } from '../../../services/luotXemTin';

function SuggestPostsRelatedHot({ currentPostData }) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [data, setData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentPostData) {
            async function fetchData() {
                const res = await getAllTinDangRelatedHot({
                    postId: currentPostData._id,
                    danhMucPhuId: currentPostData.danhMucPhuId
                });

                if (res) {
                    setData(res);
                }
            }

            fetchData();
        }
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
                        <h1>Những người khác cũng đều xem</h1>
                    </div>
                    <hr />
                    <div className=''>
                        <Slider {...settings} className="categories p-4 [&>*]:text-[14px] [&>*]:text-center">
                            {data.map((item, index) => {
                                // if (item._id != currentPostData._id) {
                                return (
                                    <div key={item._id} onClick={() => handleClickItem(item._id)} className="categories-item">
                                        <div className='interest-items block cursor-pointer hover:shadow-inner-lg hover:shadow-lg'>
                                            <img className="item-image w-[166px] p-[4px] h-[166px] object-cover" src={item.tinDang[0].hinhAnh[0].url} alt="" />
                                            <div className="item-title my-2 text-[14px]">{item.tinDang[0].tieuDe}</div>
                                            <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.tinDang[0].gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                                            <div className="item-info flex">
                                                <img className='item-avatar w-[19px] h-[16px] mt-[7px]' src="https://static.chotot.com/storage/chotot-icons/svg/user.svg" alt="" />
                                                <div className='common-style m-[2px] after:content-["·"]'></div>
                                                <div className="item-time my-2 text-[10px] font-extralight">{countTime(item.tinDang[0].thoiGianPush)}</div>
                                                <div className='common-style m-[2px] after:content-["·"]'></div>
                                                <div className="item-place my-2 text-[10px] font-extralight">{item.tinhThanhPho[0].ten}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                // }
                            })
                            }
                        </Slider>
                    </div >
                </div>
                : null}
        </div>
    )
}

export default SuggestPostsRelatedHot
