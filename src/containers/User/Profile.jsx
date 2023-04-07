import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Button } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { getUser } from '../../services/nguoiDung';
import { getListFollower, getListFollowing, themTheoDoi, xoaTheoDoi } from '../../services/theoDoi';
import { toast } from 'react-toastify';
import moment from 'moment';

function Profile() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState();
  const [countFollower, setCountFollower] = useState();
  const [countFollowing, setCountFollowing] = useState();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    console.log("Check user: ", user);
    async function fetchData() {
      const userId = searchParams.get("userId");

      const listFollower = await getListFollower(userId);
      const listFollowing = await getListFollowing(userId);

      if (listFollower) {
        setCountFollower(listFollower.count)
      }
      if (listFollowing) {
        setCountFollowing(listFollowing.count);
        listFollowing.data.map((value, index) => {
          if (value.nguoiDung[0]._id == user.data._id) {
            setIsFollowing(true);
            return;
          }
        })
      }

      if (userId != user.data._id) {
        const userData = await getUser(userId);
        if (userData) {
          setCurrentUser(userData.data);
        }
      } else {
        setCurrentUser(user.data);
      }
    }
    fetchData()
  }, []);

  const handleXoaTheoDoi = async (userId) => {
    const res = await xoaTheoDoi(userId);
    console.log("Check res: ", res);
    if (res) {
      setIsFollowing(false);
      toast.success(res.message);
    } else
      toast.error('Huỷ theo dõi không thành công');
  }

  const handleThemTheoDoi = async (userId) => {
    const res = await themTheoDoi(userId);

    if (res) {
      setIsFollowing(true);
      toast.success(res.message);
    } else
      toast.error('Huỷ theo dõi không thành công');
  }

  return (
    <>
      {currentUser ?
        <div className="container bg-[#f4f4f4]">
          <div className="grid grid-cols-2 p-[15px] bg-white mb-[15px]">
            <div className='flex'>
              <img src={currentUser?.anhDaiDien?.url ? currentUser.anhDaiDien.url : avatar} alt="" className='avatar w-[80px] h-[80px]' />
              <div className="grid grid-rows-3 ml-4">
                <h1 className="">{currentUser.hoTen}</h1>
                <div className='text-[13px] flex justify-between'>
                  <p>Người theo dõi: {countFollowing ? countFollowing : 0}</p>
                  <p className='ml-12'>Đang theo dõi: {countFollower ? countFollower : 0}</p>
                </div>
                {currentUser._id != user.data._id ?
                  <div className='flex'>
                    {isFollowing ?
                      <Button className='rounded-2xl bg-[#ffba22]' onClick={() => handleXoaTheoDoi(currentUser._id)}><i className="fa-solid fa-check mr-1"></i>Đang theo dõi</Button>
                      : <Button className='rounded-2xl bg-[#ffba22]' onClick={() => handleThemTheoDoi(currentUser._id)}><i className="fa-solid fa-plus mr-1"></i>Theo dõi</Button>
                    }
                    <Button className='rounded-full ml-2'><i className="fa-solid fa-ellipsis"></i></Button>
                  </div> : <div className='flex'>
                    <Link to="/users/editProfile"><Button className='rounded-2xl'>Chỉnh sửa trang cá nhân</Button></Link>
                    <Button className='rounded-full ml-2'><i className="fa-solid fa-ellipsis"></i></Button>
                  </div>}
              </div>
            </div>
            <ul className='[&>li]:text-[#9b9b9b] text-[14px] [&>li>i]:mr-2 [&>li]:mb-2'>
              <li><i className="fa-regular fa-star"></i>Đánh giá:</li>
              <li><i className="fa-regular fa-calendar-days"></i>Ngày tham gia: {currentUser ? moment(currentUser.thoiGianTao).format('DD/MM/YYYY') : null}</li>
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
        : null}
    </>
  );
};

export default Profile