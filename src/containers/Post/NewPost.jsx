import { useQuery } from '@tanstack/react-query';
import { Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import { getAllDanhMuc, getAllDanhMucPhu } from '../../services/danhMuc';
import CreateNewPost from './CreateNewPost';
import './NewPost.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { countSoLuongTinDang } from '../../services/nguoiDung';

function NewPost() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isModalPaymentOpen, setIsModalPaymentOpen] = useState(false);
    const [danhMucPhuData, setDanhMucPhuData] = useState([]);
    const danhMucData = useQuery(['getAllDanhMuc'], getAllDanhMuc);
    const [danhMucName, setDanhMucName] = useState();
    const [danhMucPhuName, setDanhMucPhuName] = useState();
    const [danhMucPhuId, setDanhMucPhuId] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAbleCreatePost, setIsAbleCreatePost] = useState(true);
    const [soLuongTinDang, setSoLuongTinDang] = useState();

    useEffect(() => {
        async function fetchData() {
            const soLuongTinDangData = await countSoLuongTinDang();

            if (soLuongTinDangData) {
                setSoLuongTinDang(soLuongTinDangData);
            }
            if (!soLuongTinDangData || soLuongTinDangData < 1) {
                setIsModalOpen(false);
                setIsAbleCreatePost(false);
                setIsModalPaymentOpen(true);
            }
        }
        fetchData();
    }, [])

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

    const handlePaymentCancel = () => {
        setIsModalPaymentOpen(false);
    };

    const handleItemModalClick = async (values) => {
        const res = await getAllDanhMucPhu(values.danhMucId);

        if (res) {
            setDanhMucPhuData(res);
            setIsSubModalOpen(true);
            setDanhMucName(values.ten);
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
        setDanhMucPhuId(values.danhMucPhuId);
        setDanhMucPhuName(values.ten);

        return navigate({
            pathname: `/newPost`,
            search: `?danhMucPhuId=${values.danhMucPhuId}`,
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
                        <button
                            disabled={isAbleCreatePost ? false : true}
                            className='flex justify-between'
                            style={{ width: '90%', height: '30px', border: '1px solid grey', borderRadius: '5px', paddingLeft: '8px', paddingTop: '2px' }}
                            onClick={showModal}>
                            {danhMucName && danhMucPhuName ? danhMucName + " - " + danhMucPhuName : 'Chọn danh mục tin đăng'} <i className="fa-solid fa-chevron-down p-1"></i>
                        </button>
                        <Modal title="Đăng tin" open={isModalOpen} onCancel={handleCancel} footer={null}>
                            <div className='menu-category p-4 hover:bg-[#f5f5f5]'>
                                <ul>
                                    {danhMucData.data && danhMucData.data.map((values, index) => {
                                        return (
                                            <li key={values.danhMucId} onClick={() => handleItemModalClick(values)} className=" text-base p-1"><i className="fa-solid fa-laptop"></i> {values.ten} <i className="float-right text-lg fa-solid fa-chevron-right"></i></li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </Modal>
                        {isAbleCreatePost ? null :
                            <Modal title="Không đủ lượt đăng tin" open={isModalPaymentOpen} onCancel={handlePaymentCancel} footer={null}>
                                <div className=''>
                                    <h1>Lượt đăng tin trong tài khoản của bạn đã hết. Vui lòng mua thêm lượt đăng tin tại <Link to="/walletDashboard" className='text-[#ffba22]'>đây</Link> </h1>
                                </div>
                            </Modal>
                        }
                        {showSubModal ?
                            <Modal title="Đăng tin" open={isSubModalOpen} onCancel={handleSubCancel} footer={null}>
                                <div className='menu-category p-4 '>
                                    <ul>
                                        {danhMucPhuData && danhMucPhuData.map((values, index) => {
                                            return (
                                                <li key={values.danhMucPhuId} onClick={() => handleItemSubModalClick(values)} className="hover:bg-[#f5f5f5] text-base p-1">{values.ten}<i className="float-right fa-solid fa-chevron-right"></i></li>
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