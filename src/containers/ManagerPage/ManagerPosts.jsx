import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Layout, List, Menu, Modal, Table, theme } from 'antd';
import { editUser, getAllNguoiDung, getCurrentUser, getUser, updateUserRoute } from '../../services/nguoiDung';
import { Input, Space } from 'antd';
import { editPost, getAllPost } from '../../services/tinDang';
import { SearchOutlined } from '@ant-design/icons';
import Moment from 'moment';
import { NumericFormat } from 'react-number-format';
import Highlighter from 'react-highlight-words';
import ModalDetailPost from './ModalDetailPost';
import { toast } from 'react-toastify';
import { updateUser } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { createThongBao } from '../../services/thongBao';

const { Search } = Input;

function ManagerPosts() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [listPost, setListPost] = useState();
    const [data, setData] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [postId, setPostId] = useState();
    const [isOpenHuyModal, setIsOpenHuyModal] = useState(false);
    const [nguoiDangData, setNguoiDangData] = useState();

    const inputRef = useRef();
    const dispatch = useDispatch();

    const showDetailModal = (id) => {
        setIsDetailModalOpen(true);
        setPostId(id);
    };

    const fetchData = async () => {
        const postData = await getAllPost();

        handleRefetchData(postData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleRefetchData = async (postData) => {
        const refetchData = [];
        for (var i = 0; i < postData.length; i++) {
            postData[i].soNgayHetHan = 60 - Moment().diff(postData[i].thoiGianPush, 'day');
            postData[i].thoiGianTao = Moment(postData[i].thoiGianTao).format('DD/MM/YYYY HH:mm');
            postData[i].thoiGianPush = Moment(postData[i].thoiGianPush).format('DD/MM/YYYY HH:mm');
            postData[i].nguoiDangTen = postData[i].nguoiDungId.hoTen;
            refetchData.push(postData[i]);
        }
        setData(refetchData);
    }

    const hanldeDuyetTin = async (postId) => {
        const res = await editPost(postId, { trangThaiTin: 'Đang hiển thị', thoiGianPush: Date.now() });

        if (res) {
            console.log("Check res: ", res);
            const thongBaoData = {
                noiDung: "Tin đăng của bạn đã được duyệt",
                tinDangId: postId,
                loai: "tinDuocDuyet",
                daDoc: false,
            }

            const newThongBao = await createThongBao(res.nguoiDungId, thongBaoData);

            if (newThongBao)
                toast.success('Đã duyệt tin thành công');
            else toast.error('Đã xảy ra lỗi khi duyệt tin');

            fetchData();
        }
    }

    const hanldeTuChoiTin = async (postId, nguoiDang) => {
        setIsOpenHuyModal(true);
        setPostId(postId);
        setNguoiDangData(nguoiDang);
    }

    const handleCancelHuyModal = () => {
        setIsOpenHuyModal(false);
        inputRef.current.value = "";
    }

    const handleHuyOk = async () => {
        const value = inputRef.current.value;
        const res = await editPost(postId, { trangThaiTin: 'Bị từ chối', lyDoTuChoi: value, thoiGianPush: Date.now() });
        console.log("Check res: ", res);
        if (res) {
            setIsOpenHuyModal(false);
            const soLuongTinDang = nguoiDangData.goiTinDang.soLuongTinDang + 1;
            const values = {
                "goiTinDang": {
                    id: nguoiDangData.goiTinDang.id._id,
                    soLuongTinDang: soLuongTinDang
                }
            }
            const updateUserData = await updateUserRoute(nguoiDangData._id, values);
            if (updateUserData && user.data._id == nguoiDangData._id) {
                const newUserData = await getCurrentUser();
                const userData = { ...user };
                userData.data = newUserData.data;
                localStorage.setItem("user", JSON.stringify(userData));
                dispatch(updateUser(userData));
            }
            inputRef.current.value = "";

            const thongBaoData = {
                noiDung: "Tin đăng của bạn bị từ chối",
                tinDangId: postId,
                loai: "tinBiTuChoi",
                daDoc: false,
            }

            const newThongBao = await createThongBao(res.nguoiDungId, thongBaoData);

            if (newThongBao) {
                toast.success('Đã từ chối tin đăng');
            } else toast.error('Đã xảy ra lỗi khi từ chối tin đăng');

            fetchData();
        }
    }

    const handleCancel = async () => {
        setIsDetailModalOpen(false);
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (
        selectedKeys,
        confirm,
        dataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys)[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'id',
            dataIndex: '_id',
            key: '_id',
            width: '0%',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'tieuDe',
            key: 'tieuDe',
            width: '15%',
            ...getColumnSearchProps('tieuDe'),
            sorter: (a, b) => a.tieuDe.length - b.tieuDe.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Giá',
            dataIndex: 'gia',
            key: 'gia',
            width: '10%',
            ...getColumnSearchProps('gia'),
            render: (_, { gia }) => (
                <>
                    <NumericFormat className='text-red-600 py-2' value={gia} displayType={'text'} thousandSeparator={'.'} suffix={' đ'} decimalSeparator={','} />
                </>
            ),
            sorter: (a, b) => a.gia - b.gia,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'thoiGianTao',
            key: 'thoiGianTao',
            width: '15%',
            ...getColumnSearchProps('thoiGianTao'),
            sorter: (a, b) => a.thoiGianTao - b.thoiGianTao,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Thời gian đẩy tin',
            dataIndex: 'thoiGianPush',
            key: 'thoiGianPush',
            width: '15%',
            ...getColumnSearchProps('thoiGianPush'),
            sorter: (a, b) => a.thoiGianPush.length - b.thoiGianPush.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Số ngày tin hết hạn',
            dataIndex: 'soNgayHetHan',
            key: 'soNgayHetHan',
            width: '15%',
            ...getColumnSearchProps('soNgayHetHan'),
            sorter: (a, b) => a.soNgayHetHan - b.soNgayHetHan,
            sortDirections: ['descend', 'ascend'],
            render: (_, { soNgayHetHan }) => (
                <>
                    {soNgayHetHan > 0 ? soNgayHetHan : <p className='text-red-600'>Đã hết hạn</p>}
                </>
            ),
        },
        {
            title: 'Người đăng',
            dataIndex: 'nguoiDangTen',
            key: 'nguoiDangTen',
            width: '10%',
            ...getColumnSearchProps('nguoiDangTen'),
            sorter: (a, b) => a.nguoiDangTen.length - b.nguoiDangTen.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Trạng thái tin',
            dataIndex: 'trangThaiTin',
            key: 'trangThaiTin',
            width: '15%',
            ...getColumnSearchProps('trangThaiTin'),
            sorter: (a, b) => a.trangThaiTin.length - b.trangThaiTin.length,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button className='bg-yellow-400' onClick={() => showDetailModal(record._id)}>Xem chi tiết</Button>
                    <Button className='bg-green-500' onClick={() => hanldeDuyetTin(record._id)} disabled={record.trangThaiTin === 'Đang đợi duyệt' ? false : true}>Duyệt tin</Button>
                    <Button className='bg-red-500' onClick={() => hanldeTuChoiTin(record._id, record.nguoiDungId)} disabled={record.trangThaiTin === 'Bị từ chối' ? true : false}>Từ chối tin</Button>
                </Space>
            ),
        },
    ].filter(item => item.title != 'id');

    return (
        <>
            <Table columns={columns} dataSource={data} className='mt-5' rowKey='_id'
                pagination={{ position: 'bottom', pageSize: 4 }}
            />
            <Modal title="Thông tin tin đăng" open={isDetailModalOpen} onCancel={handleCancel} width={655} footer={[
                <Button key="back" onClick={handleCancel} className='bg-red-500'>
                    Thoát
                </Button>
            ]}>
                {
                    <ModalDetailPost postId={postId} />
                }
            </Modal>
            <Modal title="Nhập lý do từ chối tin" open={isOpenHuyModal} onCancel={handleCancelHuyModal} onOk={() => handleHuyOk(postId)} footer={[
                <Button key="back" onClick={handleCancelHuyModal}>
                    Thoát
                </Button>,
                <Button
                    className='bg-[#ffba00]'
                    key="ok"
                    onClick={() => handleHuyOk()}
                >
                    Lưu
                </Button>,
            ]}>
                <textarea type="text" ref={inputRef} className='border-gray-200 border-2 w-[100%] rounded-lg p-1' />
            </Modal>
        </>
    );
};

export default ManagerPosts;