import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Modal, Radio, Select, Slider, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDanhMuc, getAllDanhMucPhu } from '../../../services/danhMuc';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FilterOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getAllTinhThanh, getOneTinhTP, getQuanHuyen } from '../../../services/diaChi';
import { NumericFormat } from 'react-number-format';
import { getGoiY } from '../../../services/tinDang';
import queryString from 'query-string';

function Filter() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [rangeSlider, setRangeSlider] = useState([0, 30000001]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [danhMucPhuId, setDanhMucPhuId] = useState();
    const [goiY, setGoiY] = useState();
    const [hangSXName, setHangSXName] = useState('Tất cả');
    const [hangSXId, setHangSXId] = useState(-1);
    const [value, setValue] = useState('newPostPriority');
    const [countFilter, setCountFilter] = useState({ sapXep: 0, gia: 0, hangSX: 0 });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const danhMucPhuParam = parseInt(searchParams.get("danhMucPhuId"))

            if (danhMucPhuParam) {
                setDanhMucPhuId(parseInt(danhMucPhuParam));
                if (danhMucPhuParam == 1 || danhMucPhuParam == 2 || danhMucPhuParam == 3 || danhMucPhuParam == 5 || danhMucPhuParam == 6 || danhMucPhuParam == 7) {
                    const goiYData = await getGoiY(danhMucPhuParam);

                    if (goiYData) {
                        goiYData.hangSX.unshift({
                            label: "Tất cả",
                            value: -1
                        })
                        console.log("Check goiYData: ", goiYData);
                        setGoiY(goiYData);
                    }
                }
            }
        }
        fetchData()
    }, []);


    const onChange = (e) => {
        if (e.target.value != 'newPostPriority') {
            setCountFilter({ ...countFilter, sapXep: 1 })
        } else {
            setCountFilter({ ...countFilter, sapXep: 0 })
        }
        setValue(e.target.value);
    };

    const onSliderChange = (value) => {
        if (value[0] != 0 || value[1] != 30000001) {
            if (countFilter.gia == 0) {
                setCountFilter({ ...countFilter, gia: 1 })
            }
        } else {
            if (countFilter.gia != 0) {
                setCountFilter({ ...countFilter, gia: 0 })

            }
        }
        setRangeSlider(value);
    };

    const showModal = async () => {
        setIsModalOpen(true);
        const hangSXParam = parseInt(searchParams.get("hangSX"))

        if (hangSXParam && goiY) {
            for (var i = 0; i < goiY.hangSX.length; i++) {
                if (goiY.hangSX[i].value == hangSXParam) {
                    setHangSXName(goiY.hangSX[i].label);
                    setHangSXId(goiY.hangSX[i].value)
                    return;
                }
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showSubModal = async () => {
        setIsSubModalOpen(true);
    };

    const handleSubCancel = () => {
        setIsSubModalOpen(false);
    };

    const handleItemSubModalClick = (values) => {
        if (values.value != -1) {
            if (countFilter.hangSX == 0) {
                setCountFilter({ ...countFilter, hangSX: 1 })
            }
        } else {
            if (countFilter.hangSX != 0) {
                setCountFilter({ ...countFilter, hangSX: 0 })
            }
        }
        setIsSubModalOpen(false);
        setHangSXName(values.label);
        setHangSXId(values.value);
        // return navigate({
        //     pathname: `/postList`,
        //     search: `?hangSX=${values.value}`,
        // })
    }

    const handleApplyFilter = () => {
        setIsModalOpen(false);

        const filter = {
            sapXep: value,
            giaMin: rangeSlider[0],
            giaMax: rangeSlider[1],
        }

        if (hangSXId != -1) {
            filter.hangSX = hangSXId;
        }

        const queryParams = queryString.parse(location.search);
        const mergeParams = { ...queryParams, ...filter };
        const queryStringify = '?' + new URLSearchParams(mergeParams).toString();
        console.log("Check queryStringify: ", queryStringify);

        return navigate({
            pathname: `/postList`,
            search: `${queryStringify}`,
        })
    }

    const handleRemoveFilter = () => {
        setIsModalOpen(false);
        setValue('newPostPriority');
        setRangeSlider([0, 30000001]);
        setHangSXId(-1);
        setHangSXName('Tất cả');
        setCountFilter({ sapXep: 0, gia: 0, hangSX: 0 });
        const queryParams = queryString.parse(location.search);
        delete queryParams.sapXep;
        delete queryParams.giaMin;
        delete queryParams.giaMax;
        delete queryParams.hangSX;

        const queryStringify = '?' + new URLSearchParams(queryParams).toString();
        console.log("Check queryStringify: ", queryStringify);
        return navigate({
            pathname: `/postList`,
            search: `${queryStringify}`,
        })
    }

    return (
        <div>
            <Badge count={countFilter ? countFilter.sapXep + countFilter.gia + countFilter.hangSX : 0}><Button onClick={() => showModal()}><FilterOutlined style={{
                verticalAlign: 'middle',
            }} /> Lọc</Button> </Badge>
            <Modal title={
                <div className='flex justify-between'>
                    <h1 className='text-lg'>Lọc kết quả</h1>
                    <h1 className='text-[#ffba00] mr-5 cursor-pointer' onClick={() => { handleRemoveFilter() }}>Bỏ lọc</h1>
                </div>
            } open={isModalOpen} onCancel={handleCancel} footer={<Button onClick={() => handleApplyFilter()} className='w-[100%] bg-[#ffba00]'>Áp dụng</Button>}>
                <div className=''>
                    <h1 className='text-base font-semibold'>Sắp xếp theo</h1>
                    <div className='border-2 p-4'>
                        <Radio.Group onChange={onChange} value={value}>
                            <Space direction="vertical">
                                <Radio value={'newPostPriority'}>Tin mới trước</Radio>
                                <Radio value={'lowPricePriority'}>Giá thấp trước</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                <div>
                    <div className='flex'>
                        Giá từ <NumericFormat className='font-semibold mx-1' value={rangeSlider[0]} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                        đến
                        {rangeSlider[1] >= 30000001 ? <h1 className='font-semibold mx-1'> &gt; 30.000.000 đ</h1> : <NumericFormat className='font-semibold mx-1' value={rangeSlider[1]} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />}
                    </div>
                    <Slider
                        range
                        max={30000001}
                        min={0}
                        step={400000}
                        defaultValue={[0, 30000001]}
                        value={rangeSlider ? rangeSlider : null}
                        onChange={onSliderChange}
                        tooltip={{ formatter: null }}
                    />
                </div>
                {danhMucPhuId && (
                    danhMucPhuId == 1 || danhMucPhuId == 2 || danhMucPhuId == 3 || danhMucPhuId == 5 || danhMucPhuId == 6 || danhMucPhuId == 7) ?
                    <div>
                        <h1>Hãng sản xuất</h1>
                        <Button className='w-[100%]' onClick={() => showSubModal()}>{hangSXName ? hangSXName : 'Tất cả'}<CaretDownOutlined style={{
                            verticalAlign: 'middle',
                        }} /></Button>
                    </div>
                    : null
                }
            </Modal>
            {showSubModal ?
                <Modal title="Chọn hãng sản xuất" open={isSubModalOpen} onCancel={handleSubCancel} footer={null}>
                    <div className='menu-category p-4 '>
                        <ul>
                            {goiY?.hangSX && goiY?.hangSX.map((values, index) => {
                                return (
                                    <li key={values.value} onClick={() => handleItemSubModalClick(values)} className="hover:bg-[#f5f5f5] text-base p-1">{values.label}<i className="float-right fa-solid fa-chevron-right"></i></li>
                                )
                            })}
                        </ul>
                    </div>
                </Modal>
                : null}
        </div>
    );
};

export default Filter