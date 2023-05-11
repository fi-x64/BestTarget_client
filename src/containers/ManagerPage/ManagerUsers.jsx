import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Button, Layout, List, Menu, message, Modal, Table, theme } from 'antd';
import { getAllNguoiDung, getUser, searchUser, updateUser } from '../../services/nguoiDung';
import { Input, Space } from 'antd';
import avatar from '../../assets/img/avatar.svg';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { getOnePhuongXa } from '../../services/diaChi';
import ModalEditUser from './ModalEditUser';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { Search } = Input;

function ManagerUsers() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [listUser, setListUser] = useState();
    const [data, setData] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    const showEditModal = async (id) => {
        const res = await getUser(id);
        if (res) {
            setSelectedUser(res);
            setIsEditModalOpen(true);
        } else message.error("Không thể truy xuất đến người dùng này");
    };

    const handleOk = () => {
        setIsEditModalOpen(false);
    };

    const handleRefetchData = async (res) => {
        const refetchData = [];
        for (var i = 0; i < res.length; i++) {
            if (res[i].trangThai === true)
                res[i].trangThai = 'Đang hoạt động'
            else if (res[i].trangThai === false) res[i].trangThai = 'Đã khoá'

            if (res[i].diaChi) {
                const phuongXaData = await getOnePhuongXa(res[i].diaChi.phuongXaCode)

                if (phuongXaData) {
                    res[i].fullDiaChi = res[i].diaChi.soNha + ' ' + phuongXaData.path_with_type;
                }
            }
            res[i].tenQuyen = res[i].quyen.ten;
            refetchData.push(res[i]);
        }

        setListUser(res);
        setData(refetchData);
    }

    const handleCancel = async () => {
        setIsEditModalOpen(false);
        const res = await getAllNguoiDung();

        if (res) {
            handleRefetchData(res)
        }
    };

    useEffect(() => {
        async function fetchData() {
            const res = await getAllNguoiDung();

            if (res) {
                handleRefetchData(res)
            }
        }
        fetchData()
    }, [])

    const onSearch = async (e) => {
        const res = await searchUser(e.target.value);

        if (res) {
            handleRefetchData(res);
        }
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

    const handleSubmit = async (userId, values) => {
        const res = await updateUser(userId, values);

        if (res) {
            const res = await getAllNguoiDung();

            if (res) {
                handleRefetchData(res)
            }
            toast.success("Cập nhật thông tin người dùng thành công");
        }
    }

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
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
            width: '15%',
            ...getColumnSearchProps('hoTen'),
            sorter: (a, b) => a.hoTen.length - b.hoTen.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'fullDiaChi',
            key: 'fullDiaChi',
            width: '40%',
            ...getColumnSearchProps('fullDiaChi'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: '15%',
            ...getColumnSearchProps('trangThai'),
            render: (_, { trangThai }) => (
                <>
                    {trangThai == 'Đang hoạt động' ? <div className='flex'>  <i className="fa-solid fa-circle text-green-600 mt-1 mr-2"></i> <h1>Đang hoạt động</h1></div>
                        : trangThai == 'Đã khoá' ? <div className='flex'>  <i className="fa-solid fa-circle mt-1 mr-2"></i>  <h1>Đã khoá</h1></div> : null
                    }
                </>
            ),
            sorter: (a, b) => a.trangThai.length - b.trangThai.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Quyền truy cập',
            dataIndex: 'tenQuyen',
            key: 'tenQuyen',
            width: '15%',
            ...getColumnSearchProps('tenQuyen'),
            render: (_, { quyen }) => (
                <>
                    {quyen.ten}
                </>
            ),
            sorter: (a, b) => a.tenQuyen.length - b.tenQuyen.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Thao tác',
            key: 'action',
            with: '30%',
            render: (_, record) => (
                <Space size="middle">
                    <Button className='bg-yellow-400' onClick={() => showEditModal(record._id)}>Xem chi tiết</Button>
                    {console.log("Check record: ", record)}
                    {record.trangThai == 'Đang hoạt động' ?
                        <Button className='bg-red-500' onClick={() => handleSubmit(record._id, { trangThai: false })} disabled={record._id != user.data._id ? false : true}>Khoá tài khoản</Button>
                        :
                        <Button className='bg-green-500' onClick={() => handleSubmit(record._id, { trangThai: true })}>Mở khoá tài khoản</Button>
                    }
                </Space>
            ),
        },
    ].filter(item => item.title != 'id');

    return (
        <>
            <Search placeholder="Tìm kiếm theo họ tên người dùng, email, sđt" onChange={(e) => onSearch(e)} style={{ width: '500px' }} />
            <Table columns={columns} dataSource={data} className='mt-5' rowKey='_id'
                pagination={{ position: 'bottom', pageSize: 4 }}
            />
            <Modal title="Thông tin cá nhân" open={isEditModalOpen} onCancel={handleCancel} width={790} footer={[
                <Button key="back" onClick={handleCancel} className='bg-red-500'>
                    Thoát
                </Button>
            ]}>
                {selectedUser ? <ModalEditUser user={selectedUser} /> : null}
            </Modal>
        </>
    );
};

export default ManagerUsers;