import { Button, Carousel, ConfigProvider } from 'antd'
import React from 'react'
import Slider from "react-slick"
import './Banner.scss'
import banner1 from '../../../assets/img/banner/banner1.jpg';
import banner2 from '../../../assets/img/banner/banner2.jpg';
import banner3 from '../../../assets/img/banner/banner3.jpg';
import banner4 from '../../../assets/img/banner/banner4.jpg';
import goiPro from '../../../assets/img/subBanner/goiPro.webp'
import dongTot from '../../../assets/img/subBanner/dongTot.webp'
import uuDai from '../../../assets/img/subBanner/uuDai.webp'
import thuMuaDT from '../../../assets/img/subBanner/thuMuaDT.webp'

var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    arrows: false
};

function Banner() {
    const onChange = (currentSlide) => {
        // console.log(currentSlide);
    };

    return (
        <div className='wrapper-banner my-3 pb-3 bg-[#fff]'>
            <div className="banner p-4">
                <Slider className="[&>div]:h-[234px] max-h-[500px]" {...settings}>
                    <div>
                        <img src={banner1} alt="" />
                    </div>
                    <div>
                        <img src={banner2} alt="" />
                    </div>
                    <div>
                        <img src={banner3} alt="" />
                    </div>
                    <div>
                        <img src={banner4} alt="" />
                    </div>
                </Slider>
            </div>
            <div className='subBanner flex justify-between px-4 [&>a>img]:h-[33px] [&>a>img]:w-[33px] [&>a>img]:m-auto [&>*]:text-[14px]'>
                <a href='#'><img src={goiPro} alt="" />Gói Pro</a>
                <a href='#'><img src={dongTot} alt="" />Nạp Đồng Tốt</a>
                <a href='#'><img src={uuDai} alt="" />Ưu Đãi</a>
                <a href='#'><img src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <a href='#'><img src={goiPro} alt="" />Gói Pro</a>
                <a href='#'><img src={dongTot} alt="" />Nạp Đồng Tốt</a>
                <a href='#'><img src={uuDai} alt="" />Ưu Đãi</a>
                <a href='#'><img src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
            </div>
        </div >
    )
}

export default Banner
