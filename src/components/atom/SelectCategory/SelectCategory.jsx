import { Button, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { getAllDanhMuc, getAllDanhMucPhu } from '../../../services/danhMuc';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretDownOutlined } from '@ant-design/icons';
import queryString from 'query-string';

function SelectCategory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [danhMucPhuData, setDanhMucPhuData] = useState([]);
    // const danhMucData = useQuery(['getAllDanhMuc'], getAllDanhMuc);
    const [danhMucData, setDanhMucData] = useState();
    const [danhMucPhuName, setDanhMucPhuName] = useState();
    const [danhMucPhuId, setDanhMucPhuId] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        async function fetchData() {
            const allDanhMuc = await getAllDanhMuc();

            if (allDanhMuc) {
                allDanhMuc.unshift({
                    danhMucId: 0,
                    ten: "Tất cả",
                })
                setDanhMucData(allDanhMuc)
            }

            const allDanhMucPhu = await getAllDanhMucPhu(1);

            setDanhMucPhuData(allDanhMucPhu);
            const danhMucPhuParam = searchParams.get("danhMucPhuId")
            if (danhMucPhuParam && allDanhMucPhu) {
                setDanhMucPhuId(danhMucPhuParam);

                for (var i = 0; i < allDanhMucPhu.length; i++) {
                    if (allDanhMucPhu[i].danhMucPhuId == danhMucPhuParam) {
                        setDanhMucPhuName(allDanhMucPhu[i].ten);
                        break;
                    }
                }
            }
        }
        fetchData()
    }, []);


    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleItemModalClick = async (values) => {

        if (values.danhMucId != 0) {
            const res = await getAllDanhMucPhu(values.danhMucId);

            if (res) {
                res.unshift({
                    danhMucPhuId: 0,
                    ten: "Tất cả",
                    danhMucId: 1
                })
            }

            if (res) {
                setDanhMucPhuData(res);
                setIsSubModalOpen(true);
            }
        } else {
            setIsModalOpen(false);
            setDanhMucPhuId('');
            setDanhMucPhuName('');
            return navigate('/postList')
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

        const queryParams = queryString.parse(location.search);

        var mergeParams;

        if (values.danhMucPhuId != 0) {
            setDanhMucPhuId(values.danhMucPhuId);
            setDanhMucPhuName(values.ten);
            mergeParams = { ...queryParams, danhMucPhuId: values.danhMucPhuId };

        } else {
            delete queryParams.danhMucPhuId;
            mergeParams = { ...queryParams };
            setDanhMucPhuId('');
            setDanhMucPhuName('');
        }
        const queryStringify = '?' + new URLSearchParams(mergeParams).toString();

        return navigate({
            pathname: `/postList`,
            search: `${queryStringify}`,
        })

        // if (values.danhMucPhuId != 0) {
        //     setDanhMucPhuId(values.danhMucPhuId);
        //     setDanhMucPhuName(values.ten);

        //     return navigate({
        //         pathname: `/postList`,
        //         search: `?danhMucPhuId=${values.danhMucPhuId}`,
        //     })
        // } else {
        //     setDanhMucPhuId('');
        //     setDanhMucPhuName('');
        //     return navigate('/postList')
        // }
    }

    return (
        <div>
            <Button onClick={() => showModal()}>{danhMucPhuName ? danhMucPhuName : 'Tất cả danh mục'}<CaretDownOutlined style={{ verticalAlign: 'middle', }} />
            </Button>
            <Modal title="Chọn danh mục" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='menu-category p-4'>
                    <ul>
                        {danhMucData && danhMucData.map((values, index) => {
                            return (
                                <li key={values.danhMucId} onClick={() => handleItemModalClick(values)} className="hover:bg-[#f5f5f5] text-base p-1">{values.ten} <i className="float-right text-lg fa-solid fa-chevron-right"></i></li>
                            )
                        })}
                    </ul>
                </div>
            </Modal>
            {showSubModal ?
                <Modal title="Chọn danh mục phụ" open={isSubModalOpen} onCancel={handleSubCancel} footer={null}>
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
    );
};

export default SelectCategory