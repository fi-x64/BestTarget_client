import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, InputNumber, List, Select, Table } from 'antd';
import { Input, Space, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getAllGoiDangKy } from '../../services/goiDangKy';
import * as Yup from 'yup'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import { ErrorMessage, FastField, Formik } from 'formik';
import { createKhuyenMai, deleteKhuyenMai, editKhuyenMai, getAllKhuyenMai } from '../../services/khuyenMai';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { createAllThongBao } from '../../services/thongBao';
import { getHoaDonByUserId } from '../../services/hoaDon';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;

function TransactionHistory() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [hoaDonUser, setHoaDonUser] = useState();

    useEffect(() => {
        if (isLoggedIn) {
            async function fetchData() {
                const hoaDonData = await getHoaDonByUserId();
                if (hoaDonData) {
                    setHoaDonUser(hoaDonData);
                }
            }
            fetchData();
        }
    }, [])

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
            title: 'Thời gian giao dịch',
            dataIndex: 'thoiGianTao',
            key: 'thoiGianTao',
            width: '25%',
            ...getColumnSearchProps('thoiGianTao'),
            sorter: (a, b) => a.thoiGianTao.length - b.thoiGianTao.length,
            render: (_, { thoiGianTao }) => (
                <>
                    {moment(thoiGianTao).format('DD/MM/YYYY HH:ss')}
                </>
            ),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Đơn vị thanh toán',
            dataIndex: 'donViThanhToan',
            key: 'donViThanhToan',
            width: '15%',
            ...getColumnSearchProps('donViThanhToan'),
            sorter: (a, b) => a.donViThanhToan.length - b.donViThanhToan.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Kết quả thanh toán',
            dataIndex: 'ketQuaThanhToan',
            key: 'ketQuaThanhToan',
            width: '15%',
            render: (_, { ketQuaThanhToan }) => (
                <>
                    {ketQuaThanhToan ? 'Thành công' : 'Thất bại'}
                </>
            ),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Số tiền',
            dataIndex: 'soTien',
            key: 'soTien',
            width: '15%',
            ...getColumnSearchProps('soTien'),
            sorter: (a, b) => a.soTien - b.soTien,
            render: (_, { soTien, hinhThuc }) => (
                <>
                    {hinhThuc == 'Chuyển tiền' ? <h1 className='text-red-600'>-{soTien}</h1> : <h1 className='text-green-600'>+{soTien}</h1>}
                </>
            ),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'donDatId',
            key: 'donDatId',
            width: '25%',
            ...getColumnSearchProps('donDatId'),
            sorter: (a, b) => a.donDatId.length - b.donDatId.length,
            sortDirections: ['descend', 'ascend'],
        },
    ].filter(item => item.title != 'id');;

    return (
        <>
            {hoaDonUser ?
                <div>
                    <Table columns={columns} dataSource={hoaDonUser} className='pt-5' rowKey='_id'
                        pagination={{ position: 'bottom', pageSize: 5 }}
                    />
                </div>

                : null}
        </>
    );
};

export default TransactionHistory;