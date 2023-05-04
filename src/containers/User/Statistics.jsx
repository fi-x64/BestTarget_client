import React, { useEffect, useState } from 'react';
import { getStatisticsPostInWeekByUserId } from '../../services/tinDang';
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
import dayjs from 'dayjs';
import { statisticsHoaDonByUserId } from '../../services/hoaDon';

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

function Statistics() {
    const [dataPostInWeek, setDataPostInWeek] = useState();
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

    const handleRefetchData = async (postInWeek, hoaDon) => {
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

        const hoaDonRefetch = handleHoaDonRefetch(hoaDon);

        setDataPostInWeek(dataPostInWeekRefetch);
        setHoaDonStatistics(hoaDonRefetch);
    }

    useEffect(() => {
        async function fetchData() {
            const postInWeek = await getStatisticsPostInWeekByUserId();

            const currentDate = moment().toISOString();
            const sevenDaysAgo = moment().subtract(7, 'days').toISOString();
            const hoaDon = await statisticsHoaDonByUserId({ startDate: sevenDaysAgo, endDate: currentDate });

            handleRefetchData(postInWeek, hoaDon);
        }
        fetchData();
    }, [])

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
        const hoaDon = await statisticsHoaDonByUserId({ startDate: dates[0]?.$d, endDate: dates[1]?.$d });

        if (hoaDon) {
            const hoaDonRefetch = handleHoaDonRefetch(hoaDon);

            setHoaDonStatistics(hoaDonRefetch);
        }
    }

    return (
        <>
            <div className="container bg-[#f4f4f4] min-h-[600px]">
                <div className="pb-2 bg-[#fff]">
                    <div>
                        <h1 className='p-4 font-semibold text-lg'>Thống kê</h1>
                        <hr />
                    </div>
                    <div className='m-4 gap-4 [&>div]:mr-2 [&>div]:pt-2 p-4'>
                        {hoaDonStatistics ?
                            <div>
                                <label htmlFor="ngayHieuLuc">
                                    Chọn khoảng thời gian:
                                </label>
                                <RangePicker
                                    className='w-[80%] ml-2'
                                    defaultValue={[dayjs(moment().subtract(7, 'days').toISOString()), dayjs(moment().toISOString())]}
                                    onCalendarChange={(dates) => handleCalendarChangeHoaDon(dates)}
                                />
                                <div className='w-[500px] h-[500px] mt-7 mx-auto'>
                                    <Pie options={hoaDonOptions} data={hoaDonStatistics} />
                                </div>
                            </div>
                            : <h1>Không có dữ liệu</h1>
                        }
                        {dataPostInWeek ?
                            <div className='h-[400px] mx-auto mt-5'>
                                <Bar options={postInWeekOptions} data={dataPostInWeek} />
                            </div>
                            : <h1>Không có dữ liệu</h1>
                        }
                        <div></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Statistics;