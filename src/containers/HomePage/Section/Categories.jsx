import React from 'react'
import Slider from "react-slick"
import { Button, Carousel, ConfigProvider } from 'antd'
import goiPro from '../../../assets/img/subBanner/goiPro.webp'
import dongTot from '../../../assets/img/subBanner/dongTot.webp'
import uuDai from '../../../assets/img/subBanner/uuDai.webp'
import thuMuaDT from '../../../assets/img/subBanner/thuMuaDT.webp'
import './Categories.scss';

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
    slidesToShow: 4,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
};

function Categories() {
    return (
        <div className='wrapper-categories bg-[#fff]'>
            <Slider {...settings} className="categories p-4 [&>*]:text-[14px] [&>*]:text-center">
                <a className="categories-item" href='#'><img className='categories-img' src={goiPro} alt="" />Gói Pro</a>
                <a className="categories-item" href='#'><img className='categories-img' src={dongTot} alt="" />Nạp Đồng Tốt</a>
                <a className="categories-item" href='#'><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</a>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <a className="categories-item" href='#'><img className='categories-img' src={goiPro} alt="" />Gói Pro</a>
                <a className="categories-item" href='#'><img className='categories-img' src={dongTot} alt="" />Nạp Đồng Tốt</a>
                <a className="categories-item" href='#'><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</a>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <a className="categories-item" href='#'><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</a>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <a className="categories-item" href='#'><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</a>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
                <a className="categories-item" href='#'><img className='categories-img' src={uuDai} alt="" />Ưu Đãi</a>
                <a className="categories-item" href='#'><img className='categories-img' src={thuMuaDT} alt="" />Thu Mua Điện Thoại</a>
            </Slider>
        </div >
    )
}

export default Categories
