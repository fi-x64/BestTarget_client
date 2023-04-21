import React from 'react'
import Slider from "react-slick"
import { Button, Carousel, ConfigProvider } from 'antd'
import goiPro from '../../../assets/img/subBanner/goiPro.webp'
import dongTot from '../../../assets/img/subBanner/dongTot.webp'
import uuDai from '../../../assets/img/subBanner/uuDai.webp'
import thuMuaDT from '../../../assets/img/subBanner/thuMuaDT.webp'
import tinDangDaLuu from '../../../assets/img/subBanner/tinDangDaLuu.webp'
import lichSuTimKiem from '../../../assets/img/subBanner/lichSuTimKiem.webp'
import dangTheoDoi from '../../../assets/img/subBanner/dangTheoDoi.png'

import dienThoai from '../../../assets/img/categories/dienThoai.jpg';
import laptop from '../../../assets/img/categories/laptop.jpg';
import linhKien from '../../../assets/img/categories/linhKien.jpg';
import mayAnh from '../../../assets/img/categories/mayAnh.jpg';
import mayTinhBang from '../../../assets/img/categories/mayTinhBang.jpg';
import mayTinhDeBan from '../../../assets/img/categories/mayTinhDeBan.jpg';
import phuKien from '../../../assets/img/categories/phuKien.jpg';
import thietBiDeoThongMinh from '../../../assets/img/categories/thietBiDeoThongMinh.webp';
import tvAmThanh from '../../../assets/img/categories/tvAmThanh.jpg';



import './Categories.scss';
import { Link } from 'react-router-dom'

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
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=1` }} className="categories-item"><img className='categories-img' src={dienThoai} alt="" />Điện thoại</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=2` }} className="categories-item"><img className='categories-img' src={mayTinhBang} alt="" />Máy tính bảng</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=3` }} className="categories-item"><img className='categories-img' src={laptop} alt="" />Laptop</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=4` }} className="categories-item"><img className='categories-img' src={mayTinhDeBan} alt="" />Máy tính để bàn</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=5` }} className="categories-item"><img className='categories-img' src={mayAnh} alt="" />Máy ảnh, máy quay</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=6` }} className="categories-item"><img className='categories-img' src={tvAmThanh} alt="" />Tivi, âm thanh</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=7` }} className="categories-item"><img className='categories-img' src={thietBiDeoThongMinh} alt="" />Thiết bị đeo thông minh</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=8` }} className="categories-item"><img className='categories-img' src={phuKien} alt="" />Phụ kiện</Link>
                <Link to={{ pathname: '/postList', search: `?danhMucPhuId=9` }} className="categories-item"><img className='categories-img' src={linhKien} alt="" />Linh kiện</Link>
            </Slider>
        </div >
    )
}

export default Categories
