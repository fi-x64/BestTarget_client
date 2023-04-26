import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Button, List, Tooltip } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getUser, getUserProfile } from '../../services/nguoiDung';
import { getListFollower, getListFollowing, themTheoDoi, xoaTheoDoi } from '../../services/theoDoi';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getTinDang } from '../../services/tinDang';
import { NumericFormat } from 'react-number-format';
import countTime from '../../utils/countTime';

function Profile() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState();
  const [countFollower, setCountFollower] = useState();
  const [countFollowing, setCountFollowing] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [postDangHienThi, setPostDangHienThi] = useState();
  const [postDaBan, setPostDaBan] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userId = searchParams.get("userId");

      const listFollower = await getListFollower(userId);
      const listFollowing = await getListFollowing(userId);

      if (listFollower) {
        setCountFollower(listFollower.count)
      }
      if (listFollowing) {
        setCountFollowing(listFollowing.count);
        if (isLoggedIn) {
          listFollowing.data.some((value, index) => {
            if (value.nguoiDung[0]._id == user.data._id) {
              setIsFollowing(true);
              return true;
            }
          })
        }
      }

      const userData = await getUserProfile(userId);
      if (userData) {
        const postDangHienThiData = await getTinDang(userId, 1);

        if (postDangHienThiData) {
          setPostDangHienThi(postDangHienThiData);
        }

        const postDaBanData = await getTinDang(userId, 6);
        if (postDaBanData) {
          setPostDaBan(postDaBanData);
        }
        setCurrentUser(userData.data[0]);
      }
    }
    fetchData()
  }, []);

  const handleXoaTheoDoi = async (userId) => {
    const res = await xoaTheoDoi(userId);
    if (res) {
      setIsFollowing(false);
      toast.success(res.message);
    } else
      toast.error('Huỷ theo dõi không thành công');
  }

  const handleThemTheoDoi = async (userId) => {
    if (isLoggedIn) {
      const res = await themTheoDoi(userId);

      if (res) {
        setIsFollowing(true);
        toast.success(res.message);
      } else
        toast.error('Huỷ theo dõi không thành công');
    } else {
      return navigate("/login");
    }
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
                {isLoggedIn && currentUser._id == user.data._id ?
                  <div className='flex'>
                    <Link to="/users/editProfile"><Button className='rounded-2xl'>Chỉnh sửa trang cá nhân</Button></Link>
                    <Button className='rounded-full ml-2'><i className="fa-solid fa-ellipsis"></i></Button>
                  </div>
                  : <div className='flex'>
                    {isFollowing ?
                      <Button className='rounded-2xl bg-[#ffba22]' onClick={() => handleXoaTheoDoi(currentUser._id)}><i className="fa-solid fa-check mr-1"></i>Đang theo dõi</Button>
                      : <Button className='rounded-2xl bg-[#ffba22]' onClick={() => handleThemTheoDoi(currentUser._id)}><i className="fa-solid fa-plus mr-1"></i>Theo dõi</Button>
                    }
                    <Button className='rounded-full ml-2'><i className="fa-solid fa-ellipsis"></i></Button>
                  </div>}
              </div>
            </div>
            <ul className='[&>li]:text-[#9b9b9b] text-[15px] [&>li>i]:mr-2 [&>li]:mb-2'>
              <li><i className="fa-regular fa-star"></i>Gói đăng ký: {currentUser?.goiTinDang[0].tenGoi}</li>
              <li><i className="fa-regular fa-calendar-days"></i>Ngày tham gia: {currentUser ? moment(currentUser.thoiGianTao).format('DD/MM/YYYY') : null}</li>
              <li><i className="fa-solid fa-location-dot"></i>Địa chỉ: {currentUser?.diaChi ? currentUser.diaChi.soNha + ' ' + currentUser.phuongXa[0].path_with_type : ''}</li>
              <li className='flex'>
                <i className="fa-regular fa-circle-check mt-1"></i>
                <h1>Đã cung cấp:</h1>
                <Tooltip title="Đã cung cấp email">
                  <i className="fa-solid fa-envelope text-green-700 mt-1 ml-2"></i>
                </Tooltip>
                {currentUser?.diaChi?.kinhDo && currentUser?.diaChi?.viDo ?
                  <Tooltip title="Đã cung cấp địa chỉ chính xác trên bản đồ">
                    <i className="fa-solid fa-location-dot text-green-700 mt-1 ml-2"></i>
                  </Tooltip> : null
                }
              </li>
            </ul>
          </div>

          <div className=" bg-[#fff] mb-[15px]">
            <div className=''>
              <h1 className='p-4 font-semibold text-lg'>Tin đang đăng - {postDangHienThi ? postDangHienThi.length : 0} tin</h1>
              <hr />
              {postDangHienThi ?
                <List
                  pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                  itemLayout="horizontal"
                  dataSource={postDangHienThi}
                  renderItem={(item, index) => (
                    <div className='hover:border-grey-400 hover:border-2'>
                      <Link id='RouterNavLink' to={{ pathname: '/postDetail', search: `?id=${item._id}` }}>
                        <List.Item>
                          <List.Item.Meta
                            avatar={<img className='w-[128px] h-[128px]' src={item.hinhAnh[0].url} />}
                            title={
                              <>
                                <p>{item.tieuDe}</p>
                                <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                              </>

                            }
                            description={
                              <p className='mt-14'>{countTime(item.thoiGianPush)}</p>
                            }
                          />

                        </List.Item>
                      </Link>
                    </div>
                  )}
                />
                : null}
            </div>
          </div>
          <div className="bg-[#fff]">
            <div className=''>
              <h1 className='p-4 font-semibold text-lg'>Đã bán thành công - {postDaBan ? postDaBan.length : 0} tin</h1>
              <hr />
              {postDaBan ?
                <List
                  pagination={{ position: 'bottom', align: 'center', pageSize: 4 }}
                  itemLayout="horizontal"
                  dataSource={postDaBan}
                  renderItem={(item, index) => (
                    <div className='hover:border-grey-400 hover:border-2'>
                      <List.Item>
                        <List.Item.Meta
                          avatar={<img className='w-[128px] h-[128px]' src={item.hinhAnh[0].url} />}
                          title={
                            <>
                              <p>{item.tieuDe}</p>
                              <NumericFormat className='item-price my-2 text-[15px] text-red-600 font-bold' value={item.gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                            </>

                          }
                          description={
                            <p className='mt-14'>{countTime(item.thoiGianPush)}</p>
                          }
                        />

                      </List.Item>
                    </div>
                  )}
                />
                : null}
            </div>
          </div>
        </div>
        : null}
    </>
  );
};

export default Profile