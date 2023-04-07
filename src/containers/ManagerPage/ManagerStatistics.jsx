import React, { useEffect, useState } from 'react';
import { getStatisticsUserInWeek } from '../../services/nguoiDung';
import { getStatisticsPostInProvince, getStatisticsPostInWeek } from '../../services/tinDang';
import { getAllTinhThanh } from '../../services/diaChi';
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

    const handleRefetchData = async (userInWeek, userInProvince, postInWeek) => {
        const dataUserInWeek = {
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

        const dataUserInProvince = {
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

        const dataPostInWeek = {
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
        setDataUserInWeek(dataUserInWeek);
        setDataUserInProvince(dataUserInProvince);
        setDataPostInWeek(dataPostInWeek);
    }

    useEffect(() => {
        async function fetchData() {
            const userInWeek = await getStatisticsUserInWeek();
            const postInWeek = await getStatisticsPostInWeek();
            const postInProvince = await getStatisticsPostInProvince();

            handleRefetchData(userInWeek, postInProvince, postInWeek);
        }
        fetchData();
    }, [])

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

    return (
        <>
            <div className='grid grid-cols-2 m-4'>
                {dataUserInWeek ?
                    <div className='w-[400px] h-[400px]'>
                        <Pie options={userInWeekOptions} data={dataUserInWeek} />
                    </div>
                    : null
                }
                {dataPostInWeek ?
                    <div className='w-[400px] h-[400px]'>
                        <Bar options={postInWeekOptions} data={dataPostInWeek} />
                    </div>
                    : null
                }
                {dataUserInProvince ?
                    <div className='w-[500px] h-[500px] mt-7'>
                        <Line options={userInProvinceOptions} data={dataUserInProvince} />
                    </div>
                    : null
                }
            </div>
        </>
    );
};

export default ManagerStatistics;