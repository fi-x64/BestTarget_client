import React, { useEffect, useState } from 'react';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { countSoLuongNguoiDung, getStatisticsUserInWeek } from '../../services/nguoiDung';
import { countSoLuongTinDang, getStatisticsPostInWeek } from '../../services/tinDang';
import { getAppliedKhuyenMai } from '../../services/khuyenMai';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

function ManagerDashboard({ setNewKey }) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { countMessage } = useSelector((state) => state.chatNoti);

    const navigate = useNavigate();

    const [countNguoiDung, setCountNguoiDung] = useState();
    const [countTinDang, setCountTinDang] = useState();
    const [currentKhuyenMai, setCurrentKhuyenMai] = useState();
    const [dataUsersAndPosts, setDataUsersAndPosts] = useState();

    const handleRefetchData = (userInWeek, postInWeek) => {
        const dataUserInWeekRefetch = {
            label: 'Người dùng',
            data: userInWeek.map((data) => data.count),
            lineTension: 0,
            fill: false,
            borderColor: 'red'
        }

        const dataPostInWeekRefetch = {
            label: 'Tin đăng',
            data: postInWeek.map((data) => data.count),
            lineTension: 0,
            fill: false,
            borderColor: 'blue'
        }

        var dataUsersAndPosts = {
            labels: (postInWeek.length > userInWeek.length) ? postInWeek.map((data) => {
                var t = data.day + '/' + data.month + '/' + data.year;
                return t
            }) : userInWeek.map((data) => {
                var t = data.day + '/' + data.month + '/' + data.year;
                return t
            }),
            datasets: [dataUserInWeekRefetch, dataPostInWeekRefetch]
        };

        setDataUsersAndPosts(dataUsersAndPosts);
    }

    var chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            title: {
                display: true,
                text: 'Thống kê số lượng người dùng và tin đăng tạo mới trong 7 ngày',
                font: {
                    size: 20,
                }
            },
        },
    };

    useEffect(() => {
        async function fetchData() {
            const countNguoiDungData = await countSoLuongNguoiDung();
            const countTinDangData = await countSoLuongTinDang();

            if (countNguoiDungData) {
                setCountNguoiDung(countNguoiDungData);
            }

            if (countTinDangData) {
                setCountTinDang(countTinDangData);
            }

            const khuyenMaiData = await getAppliedKhuyenMai();

            if (khuyenMaiData) {
                setCurrentKhuyenMai(khuyenMaiData);
            }

            const userInWeek = await getStatisticsUserInWeek();
            const postInWeek = await getStatisticsPostInWeek();

            handleRefetchData(userInWeek, postInWeek);
        }
        fetchData();
    }, [])

    const handleChangePage = (key) => {
        setNewKey(key);
    }
    return (
        <div className="bg-[#fff] mb-5">
            <div>
                <div className='grid grid-cols-4 gap-4'>
                    <div className='w-[100%] h-[150px] border-2 rounded-lg cursor-pointer' onClick={() => { handleChangePage(2) }}>
                        <div className='grid grid-cols-2 p-4 justify-items-center'>
                            <h1 className='text-2xl'>Người dùng</h1>
                            <i className="fa-solid fa-users text-4xl ml-3 text-[#ef4444]"></i>
                            <div className='text-center'>
                                <h1 className='text-4xl '>{countNguoiDung ? countNguoiDung.totalUser : 0}</h1>
                                <h1> đang hoạt động</h1>
                            </div>
                            <div className='block'>
                                {countNguoiDung && countNguoiDung.percentage ?
                                    countNguoiDung.percentage > 0 ?
                                        <h1 className='text-xl  p-2 text-green-600'><i className="fa-solid fa-arrow-up mr-1"></i>{countNguoiDung ? countNguoiDung.percentage : 0}%</h1>
                                        : countNguoiDung.percentage < 0 ?
                                            <h1 className='text-xl  p-2 text-red-600'><i className="fa-solid fa-arrow-down mr-1"></i>{countNguoiDung ? countNguoiDung.percentage * -1 : 0}%</h1>
                                            : 0 : null
                                }
                                <p className='text-gray-400'>từ tháng trước</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-[100%] h-[150px] border-2 rounded-lg cursor-pointer' onClick={() => { handleChangePage(3) }}>
                        <div className='grid grid-cols-2 p-4 justify-items-center'>
                            <h1 className='text-2xl'>Tin đăng</h1>
                            <i className="fa-solid fa-newspaper text-4xl ml-3 text-[#f97316]"></i>
                            <div className='text-center'>
                                <h1 className='text-4xl'>{countTinDang ? countTinDang.total : 0}</h1>
                                <h1> đang hiển thị</h1>
                            </div>
                            <div className='block'>
                                {countTinDang && countTinDang.percentage ?
                                    countTinDang.percentage > 0 ?
                                        <h1 className='text-xl p-2 text-green-600'><i className="fa-solid fa-arrow-up mr-1"></i>{countTinDang ? countTinDang.percentage : 0}%</h1>
                                        : countTinDang.percentage < 0 ?
                                            <h1 className='text-xl p-2 text-red-600'><i className="fa-solid fa-arrow-down mr-1"></i>{countTinDang ? countTinDang.percentage * -1 : 0}%</h1>
                                            : 0 : null
                                }
                                <p className='text-gray-400'>từ tháng trước</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-[100%] h-[150px] border-2 rounded-lg cursor-pointer' onClick={() => { handleChangePage(5) }}>
                        <div className='grid grid-cols-2 p-4 justify-items-center'>
                            <h1 className='text-2xl'>Tin nhắn</h1>
                            <i className="fa-solid fa-comments text-4xl ml-3 text-[#4c51bf]"></i>
                            <h1 className='text-4xl font-bold'>{countMessage}</h1>
                            <div></div>
                            <h1> tin nhắn chưa đọc</h1>
                        </div>
                    </div>
                    <div className='w-[100%] h-[150px] border-2 rounded-lg cursor-pointer' onClick={() => { handleChangePage(6) }}>
                        <div className='grid grid-cols-2 p-4 justify-items-center'>
                            <h1 className='text-2xl'>Khuyến mãi</h1>
                            <i className="fa-solid fa-percent text-4xl ml-3 text-[#0ea5e9]"></i>
                        </div>
                        <h1 className='text-base px-4'>{currentKhuyenMai ? 'Đang áp dụng: từ ' + moment(currentKhuyenMai.ngayBatDau).format('DD/MM/YYYY') + ' đến ' + moment(currentKhuyenMai.ngayKetThuc).format('DD/MM/YYYY') : 'Hiện không có khuyến mãi'}</h1>
                    </div>
                </div >
                <div className='w-[100%] border-2 rounded-lg mt-4 cursor-pointer' onClick={() => { handleChangePage(4) }}>
                    <div className='grid grid-cols-2 p-4 justify-items-center'>
                        <h1 className='text-4xl'>Thống kê</h1>
                        <i className="fa-solid fa-chart-line text-6xl ml-3 text-[#0ea5e9]"></i>
                        <h1 className='text-4xl'>5</h1>
                    </div>
                    {dataUsersAndPosts ?
                        <div className='mt-7 h-[400px] translate-x-[20%]'>
                            <Line options={chartOptions} data={dataUsersAndPosts} />
                        </div>
                        : null
                    }
                </div>
            </div>
        </div >
    );
};

export default ManagerDashboard;