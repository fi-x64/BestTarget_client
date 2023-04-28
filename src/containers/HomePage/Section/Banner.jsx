import { Button, Carousel, ConfigProvider } from 'antd'
import React from 'react'
import Slider from "react-slick"
import './Banner.scss'
import banner1 from '../../../assets/img/banner/banner1.png';
import banner2 from '../../../assets/img/banner/banner2.png';
import banner3 from '../../../assets/img/banner/banner3.png';
import banner4 from '../../../assets/img/banner/banner4.png';
import goiPro from '../../../assets/img/subBanner/goiPro.webp'
import dongTot from '../../../assets/img/subBanner/dongTot.webp'
import uuDai from '../../../assets/img/subBanner/uuDai.webp'
import thuMuaDT from '../../../assets/img/subBanner/thuMuaDT.webp'
import tinDangDaLuu from '../../../assets/img/subBanner/tinDangDaLuu.webp'
import lichSuTimKiem from '../../../assets/img/subBanner/lichSuTimKiem.webp'
import dangTheoDoi from '../../../assets/img/subBanner/dangTheoDoi.png'
import { Link } from 'react-router-dom';

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
    return (
        <div className='wrapper-banner bg-[#fff]'>
            <div className="banner p-4">
                <Slider className="[&>div]:h-[300px] max-h-[500px]" {...settings}>
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
                <Link to='/subscription' className="categories-item" ><img className='categories-img' src={goiPro} alt="" />Gói Đăng Tin</Link>
                <Link to='/walletDashboard' className="categories-item" ><img className='categories-img' src={dongTot} alt="" />Nạp Coin</Link>
                <Link to='/walletDashboard' className="categories-item" ><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</Link>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <Link to='/users/wishList' className="categories-item"><img className='categories-img' src={tinDangDaLuu} alt="" />Tin đăng đã lưu</Link>
                <a className="categories-item" href='#'><img className='categories-img' src={lichSuTimKiem} alt="" />Lịch sử tìm kiếm</a>
                <Link to='/users/follow' className="categories-item"><img className='categories-img' src={dangTheoDoi} alt="" />Đang theo dõi</Link>
            </div>
        </div >
    )
}

export default Banner
