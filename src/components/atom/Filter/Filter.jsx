import { useQuery } from '@tanstack/react-query';
import { Button, Modal, Radio, Select, Slider, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDanhMuc, getAllDanhMucPhu } from '../../../services/danhMuc';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FilterOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getAllTinhThanh, getOneTinhTP, getQuanHuyen } from '../../../services/diaChi';
import { NumericFormat } from 'react-number-format';
import { getGoiY } from '../../../services/tinDang';

function Filter() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [rangeSlider, setRangeSlider] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [danhMucPhuId, setDanhMucPhuId] = useState();
    const [goiY, setGoiY] = useState();
    // const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const danhMucPhuParam = searchParams.get("danhMucPhuId")

            if (danhMucPhuParam) {
                setDanhMucPhuId(danhMucPhuParam);
                if (danhMucPhuParam == 1 || danhMucPhuParam == 2 || danhMucPhuParam == 3 || danhMucPhuParam == 5 || danhMucPhuParam == 6 || danhMucPhuParam == 7) {
                    const goiYData = await getGoiY(danhMucPhuParam);

                    if (goiYData) {
                        console.log("Check goiYData: ", goiYData);
                        setGoiY(goiYData);
                    }
                }
            }
        }
        fetchData()
    }, []);

    const [value, setValue] = useState(1);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const onSliderChange = (value) => {
        console.log('onChange: ', value[0]);
        setRangeSlider(value);
    };

    const onAfterChange = (value) => {
        console.log('onAfterChange: ', value);
    };

    const showModal = async () => {
        setIsModalOpen(true);
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
        setIsSubModalOpen(false);

        return navigate({
            pathname: `/postList`,
            search: `?hangSX=${values.value}`,
        })
    }

    return (
        <div>
            <Button onClick={() => showModal()}><FilterOutlined style={{
                verticalAlign: 'middle',
            }} /> Lọc</Button>
            <Modal title={
                <div className='flex justify-between'>
                    <h1 className='text-lg'>Lọc kết quả</h1>
                    <h1 className='text-[#ffba00] mr-5 cursor-pointer'>Bỏ lọc</h1>
                </div>
            } open={isModalOpen} onCancel={handleCancel} footer={<Button className='w-[100%] bg-[#ffba00]'>Áp dụng</Button>}>
                <div className=''>
                    <h1 className='text-base font-semibold'>Sắp xếp theo</h1>
                    <div className='border-2 p-4'>
                        <Radio.Group onChange={onChange} value={value}>
                            <Space direction="vertical">
                                <Radio value={1}>Tin mới trước</Radio>
                                <Radio value={2}>Giá thấp trước</Radio>
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
                        onChange={onSliderChange}
                        onAfterChange={onAfterChange}
                        tooltip={{ formatter: null }}
                    />
                </div>
                {danhMucPhuId && (
                    danhMucPhuId == 1 || danhMucPhuId == 2 || danhMucPhuId == 3 || danhMucPhuId == 5 || danhMucPhuId == 6 || danhMucPhuId == 7) ?
                    <Button className='w-[100%]' onClick={() => showSubModal()}>{'Hãng sản xuất'}<CaretDownOutlined style={{
                        verticalAlign: 'middle',
                    }} /></Button> : null
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