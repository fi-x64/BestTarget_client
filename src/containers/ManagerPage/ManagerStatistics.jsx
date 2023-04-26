import React, { useEffect, useState } from 'react';
import { getStatisticsUserInWeek } from '../../services/nguoiDung';
import { getStatisticsPostInProvince, getStatisticsPostInWeek } from '../../services/tinDang';
import { getAllTinhThanh } from '../../services/diaChi';
import { Input, Space, DatePicker } from 'antd';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

import { Line, Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import { statisticsLuotXemTinByCategory } from '../../services/luotXemTin';
import dayjs from 'dayjs';
import { statisticsHoaDon } from '../../services/hoaDon';

const { RangePicker } = DatePicker;

ChartJS.register(CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend);

function ManagerStatistics() {
    const [dataUserInWeek, setDataUserInWeek] = useState();
    const [dataUserInProvince, setDataUserInProvince] = useState();
    const [dataPostInWeek, setDataPostInWeek] = useState();
    const [dataCategory, setDataCategory] = useState();
    const [hoaDonStatistics, setHoaDonStatistics] = useState();

    function handleHoaDonRefetch(hoaDon) {
        const labels = hoaDon.map((data) => {
            var t = data._id + ' (Tổng số tiền: ' + data.tongSoTien + ')';
            return t
        });

        const hoaDonRefetch = {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: hoaDon.map((data) => data.count),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#f3ba2f",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }
        return hoaDonRefetch;
    }

    function handleCategoryRefetch(category) {
        const categoryRefetch = {
            labels: category.map((data) => {
                var t = data.danhMucPhu.ten;
                return t
            }),
            datasets: [
                {
                    label: '',
                    data: category.map((data) => data.count),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }
        return categoryRefetch;
    }

    const handleRefetchData = async (userInWeek, userInProvince, postInWeek, category, hoaDon) => {
        const dataUserInWeekRefetch = {
            labels: userInWeek.map((data) => {
                var t = data.day + '/' + data.month + '/' + data.year;
                return t
            }),
            datasets: [
                {
                    data: userInWeek.map((data) => data.count),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }
        const allTinhThanhData = await getAllTinhThanh();

        const dataUserInProvinceRefetch = {
            labels: userInProvince.map((userData) => {
                for (var i = 0; i < allTinhThanhData.length; i++) {
                    if (userData._id === allTinhThanhData[i]._id)
                        return allTinhThanhData[i].ten
                }
            }),
            datasets: [
                {
                    label: "",
                    data: userInProvince.map((data) => data.count),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#f3ba2f",
                        "#ecf0f1",
                        "#50AF95",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }

        const dataPostInWeekRefetch = {
            labels: postInWeek.map((data) => {
                var t = data.day + '/' + data.month + '/' + data.year;
                return t
            }),
            datasets: [
                {
                    label: '',
                    data: postInWeek.map((data) => data.count),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#f3ba2f",
                        "#ecf0f1",
                        "#50AF95",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }

        const categoryRefetch = handleCategoryRefetch(category);

        const hoaDonRefetch = handleHoaDonRefetch(hoaDon);

        setDataUserInWeek(dataUserInWeekRefetch);
        setDataUserInProvince(dataUserInProvinceRefetch);
        setDataPostInWeek(dataPostInWeekRefetch);
        setDataCategory(categoryRefetch);
        setHoaDonStatistics(hoaDonRefetch);
    }

    useEffect(() => {
        async function fetchData() {
            const userInWeek = await getStatisticsUserInWeek();
            const postInWeek = await getStatisticsPostInWeek();
            const postInProvince = await getStatisticsPostInProvince();

            const currentDate = moment().toISOString();
            const sevenDaysAgo = moment().subtract(7, 'days').toISOString();
            const category = await statisticsLuotXemTinByCategory({ startDate: sevenDaysAgo, endDate: currentDate });
            const hoaDon = await statisticsHoaDon({ startDate: sevenDaysAgo, endDate: currentDate });
            console.log("Check hoaDon: ", hoaDon);
            handleRefetchData(userInWeek, postInProvince, postInWeek, category, hoaDon);
        }
        fetchData();
    }, [])

    const categoryOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Thống kê số lượng danh mục được nhiều người xem nhất',
                font: {
                    size: 20,
                }
            },
        },
    };

    const userInWeekOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Thống kê số lượng tài khoản mới tạo trong 7 ngày',
                font: {
                    size: 20,
                }
            },
        },
    };

    const postInWeekOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Thống kê theo số lượng tin đăng trong 7 ngày',
                font: {
                    size: 20,
                }
            },
        },
    };

    const userInProvinceOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Thống kê theo 10 tỉnh thành có tin đăng nhiều nhất',
                font: {
                    size: 20,
                }
            },
        },
    };

    const hoaDonOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: 'Thống kê số lượng và tổng số tiền trên loại giao dịch',
                font: {
                    size: 20,
                }
            },
        },
    };

    const handleCalendarChangeHoaDon = async (dates, dateStrings) => {
        const hoaDon = await statisticsHoaDon({ startDate: dates[0]?.$d, endDate: dates[1]?.$d });

        if (hoaDon) {
            const hoaDonRefetch = handleHoaDonRefetch(hoaDon);

            setHoaDonStatistics(hoaDonRefetch);
        }
    }

    const handleCalendarChangeCategory = async (dates, dateStrings) => {
        const category = await statisticsLuotXemTinByCategory({ startDate: dates[0]?.$d, endDate: dates[1]?.$d });

        if (category) {
            const categoryRefetch = handleCategoryRefetch(category);

            setDataCategory(categoryRefetch);
        }
    }

    return (
        <>
            <div className='grid grid-cols-2 m-4 gap-4 [&>div]:mr-2 [&>div]:pt-2 p-4 [&>div]:w-[90%]'>
                {dataUserInWeek ?
                    <div className='w-[400px] h-[400px]'>
                        <Bar options={userInWeekOptions} data={dataUserInWeek} />
                    </div>
                    : null
                }
                {dataPostInWeek ?
                    <div className='h-[400px]'>
                        <Bar options={postInWeekOptions} data={dataPostInWeek} />
                    </div>
                    : null
                }
                {dataUserInProvince ?
                    <div className='h-[500px] mt-7'>
                        <Line options={userInProvinceOptions} data={dataUserInProvince} />
                    </div>
                    : null
                }
                <div></div>
                {dataCategory ?
                    <div>
                        <label htmlFor="ngayHieuLuc">
                            Chọn khoảng thời gian:
                        </label>
                        <RangePicker
                            className='w-[80%]'
                            defaultValue={[dayjs(moment().subtract(7, 'days').toISOString()), dayjs(moment().toISOString())]}
                            onCalendarChange={(dates) => handleCalendarChangeCategory(dates)}
                        />
                        <div className='h-[500px] mt-7'>
                            <Line options={categoryOptions} data={dataCategory} />
                        </div>
                    </div>
                    : null
                }
                {hoaDonStatistics ?
                    <div>
                        <label htmlFor="ngayHieuLuc">
                            Chọn khoảng thời gian:
                        </label>
                        <RangePicker
                            className='w-[80%]'
                            defaultValue={[dayjs(moment().subtract(7, 'days').toISOString()), dayjs(moment().toISOString())]}
                            onCalendarChange={(dates) => handleCalendarChangeHoaDon(dates)}
                        />
                        <div className='w-[500px] h-[500px] mt-7'>
                            <Pie options={hoaDonOptions} data={hoaDonStatistics} />
                        </div>
                    </div>
                    : null
                }
            </div>
        </>
    );
};

export default ManagerStatistics;