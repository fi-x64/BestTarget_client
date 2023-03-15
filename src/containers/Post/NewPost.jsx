import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import { getAllDanhMuc, getAllDanhMucPhu } from '../../services/danhMuc';
import CreateNewPost from './CreateNewPost';
import './NewPost.scss';
import { useNavigate, useSearchParams } from 'react-router-dom'

function NewPost() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [danhMucPhuData, setDanhMucPhuData] = useState([]);
    const danhMucData = useQuery(['getAllDanhMuc'], getAllDanhMuc);
    const [danhMucId, setDanhMucId] = useState();
    const [danhMucPhuId, setDanhMucPhuId] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setDanhMucPhuId(searchParams.get("danhMucPhuId"));
        if (danhMucPhuId)
            searchParams ? setIsModalOpen(false) : null;
    }, [danhMucPhuId]);

    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleItemModalClick = async (danhMucId) => {
        const res = await getAllDanhMucPhu(danhMucId);
        if (res) {
            setDanhMucPhuData(res);
            setIsSubModalOpen(true);
        }
    }

    const showSubModal = async () => {
        setIsSubModalOpen(true);
    };

    const handleSubCancel = () => {
        setIsSubModalOpen(false);
    };

    const handleItemSubModalClick = (danhMucPhuId) => {
        setIsModalOpen(false);
        setIsSubModalOpen(false);
        setDanhMucPhuId(danhMucPhuId);
        return navigate({
            pathname: `/newPost`,
            search: `?danhMucPhuId=${danhMucPhuId}`,
        })
    }

    return (
        <div>
            <div className="container bg-[#fff] grid grid-cols-3">
                <div className="mb-[15px]">
                    <div className=''>
                        <h1 className='p-4 font-semibold text-lg'>Ảnh/ video sản phẩm</h1>
                        <p className='pl-5 text-xs'>Xem thêm về <a href="" className='text-blue-700 underline'>Quy định đăng tin của BestTarget</a></p>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className='p-4'>
                        <h1 className='font-semibold text-lg mb-2'>Chọn danh mục tin đăng <RequiredIcon /></h1>
                        <select
                            style={{ width: '90%', height: '30px', border: '1px solid grey', borderRadius: '10px' }}
                            className=""
                            onClick={showModal}>
                            <option disabled hidden>Danh mục tin đăng</option>
                        </select>
                        <Modal title="Đăng tin" open={isModalOpen} onCancel={handleCancel} footer={null}>
                            <div className='menu-category p-4 hover:bg-[#f5f5f5]'>
                                <ul>
                                    {danhMucData.data && danhMucData.data.map((values, index) => {
                                        return (
                                            <li key={values.danhMucId} onClick={() => handleItemModalClick(values.danhMucId)} className=" text-base p-1"><i className="fa-solid fa-laptop"></i> {values.ten} <i className="float-right text-lg fa-solid fa-chevron-right"></i></li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </Modal>
                        {showSubModal ?
                            <Modal title="Đăng tin" open={isSubModalOpen} onCancel={handleSubCancel} footer={null}>
                                <div className='menu-category p-4 '>
                                    <ul>
                                        {danhMucPhuData && danhMucPhuData.map((values, index) => {
                                            return (
                                                <li key={values.danhMucPhuId} onClick={() => handleItemSubModalClick(values.danhMucPhuId)} className="hover:bg-[#f5f5f5] text-base p-1">{values.ten}<i className="float-right fa-solid fa-chevron-right"></i></li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </Modal>
                            : null}
                    </div>
                </div>
            </div>
            {
                danhMucPhuId ? <>
                    <CreateNewPost danhMucPhuId={danhMucPhuId} />
                </> : null
            }
        </div>
    );
};

export default NewPost