import { useQuery } from '@tanstack/react-query';
import { Button, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDanhMuc, getAllDanhMucPhu } from '../../../services/danhMuc';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretDownOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getAllTinhThanh, getOneTinhTP, getQuanHuyen } from '../../../services/diaChi';

function SelectAddress() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [tinhTPData, setTinhTPData] = useState();
    const [quanHuyenData, setQuanHuyenData] = useState();
    const [tinhTPName, setTinhTPName] = useState();
    const [quanHuyenName, setQuanHuyenName] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const tinhTPParam = searchParams.get("tinhTPCode")
            if (tinhTPParam) {
                const res = await getOneTinhTP(tinhTPParam);

                if (res) {
                    setTinhTPName(res.ten);
                }
            } else {
                const quanHuyenParam = searchParams.get('quanHuyenCode');
                if (quanHuyenParam) {
                    const res = await getOneQuanHuyen(quanHuyenParam);

                    if (res) {
                        setQuanHuyenName(res.ten);
                    }
                }
            }
        }
        fetchData()
    }, []);

    const showModal = async () => {
        const allTinhThanh = await getAllTinhThanh();

        if (allTinhThanh) {
            setTinhTPData(allTinhThanh);
        }

        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleItemModalClick = async (values) => {
        const res = await getQuanHuyen(values._id);

        if (res) {
            setQuanHuyenData(res);
            setIsSubModalOpen(true);
            setTinhTPName(values.ten);

            return navigate({
                pathname: `/postList`,
                search: `?tinhTPCode=${values._id}`,
            })
        }
    }

    const showSubModal = async () => {
        setIsSubModalOpen(true);
    };

    const handleSubCancel = () => {
        setIsSubModalOpen(false);
    };

    const handleItemSubModalClick = (values) => {
        setIsModalOpen(false);
        setIsSubModalOpen(false);
        setTinhTPName('');
        setQuanHuyenName(values.ten);

        return navigate({
            pathname: `/postList`,
            search: `?phuongXaCode=${values._id}`,
        })
    }

    return (
        <div>
            <Button onClick={() => showModal()}><EnvironmentOutlined style={{ verticalAlign: 'middle' }} />{tinhTPName ? tinhTPName : quanHuyenName ? quanHuyenName : 'Toàn quốc'}<CaretDownOutlined style={{
                verticalAlign: 'middle',
            }} /></Button>
            <Modal title="Chọn tỉnh/thành phố" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='menu-category p-4'>
                    <ul>
                        {tinhTPData && tinhTPData.map((values, index) => {
                            return (
                                <li key={values._id} onClick={() => handleItemModalClick(values)} className="hover:bg-[#f5f5f5] text-base p-1">{values.ten} <i className="float-right text-lg fa-solid fa-chevron-right"></i></li>
                            )
                        })}
                    </ul>
                </div>
            </Modal>
            {showSubModal ?
                <Modal title="Chọn quận/huyện" open={isSubModalOpen} onCancel={handleSubCancel} footer={null}>
                    <div className='menu-category p-4 '>
                        <ul>
                            {quanHuyenData && quanHuyenData.map((values, index) => {
                                return (
                                    <li key={values._id} onClick={() => handleItemSubModalClick(values)} className="hover:bg-[#f5f5f5] text-base p-1">{values.ten}<i className="float-right fa-solid fa-chevron-right"></i></li>
                                )
                            })}
                        </ul>
                    </div>
                </Modal>
                : null}
        </div>
    );
};

export default SelectAddress