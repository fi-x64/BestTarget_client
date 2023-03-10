import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function Profile() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <div className="container bg-[#f4f4f4]">
      <div className="grid grid-cols-2 p-[15px] bg-white mb-[15px]">
        <div className='flex'>
          <img src={avatar} alt="" className='avatar w-[80px] h-[80px]' />
          <div className="grid grid-rows-3 ml-4">
            <div className="...">{user.data.hoTen}</div>
            <div className='text-[13px] grid grid-cols-2'>
              <p>Người theo dõi</p>
              <p>Đang theo dõi</p>
            </div>
            <div className='flex'>
              <a href="/users/editProfile"><Button className='rounded-2xl'>Chỉnh sửa trang cá nhân</Button></a>
              <Button className='rounded-full ml-2'><i className="fa-solid fa-ellipsis"></i></Button>
            </div>
          </div>
        </div>
        <ul className='[&>li]:text-[#9b9b9b] text-[14px] [&>li>i]:mr-2 [&>li]:mb-2'>
          <li><i className="fa-regular fa-star"></i>Đánh giá:</li>
          <li><i className="fa-regular fa-calendar-days"></i>Ngày tham gia:</li>
          <li><i className="fa-solid fa-location-dot"></i>Địa chỉ:</li>
          <li><i className="fa-regular fa-message"></i>Phản hồi chat:</li>
          <li><i className="fa-regular fa-circle-check"></i>Đã cung cấp:</li>
        </ul>
      </div>

      <div className="max-w-[936px] h-[180px] bg-[#fff] mb-[15px]">
        <div className=''>
          <h1 className='p-4 font-semibold text-lg'>Tin đang đăng - 0 tin</h1>
          <hr />
        </div>
      </div>
      <div className="max-w-[936px] h-[180px] bg-[#fff]">
        <div className=''>
          <h1 className='p-4 font-semibold text-lg'>Đã bán thành công - 0 tin</h1>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Profile