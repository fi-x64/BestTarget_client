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

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;

function ManagerPromotions() {
    const [allGoiDangKy, setAllGoiDangKy] = useState();
    const [allKhuyenMai, setAllKhuyenMai] = useState();
    const [khuyenMaiData, setKhuyenMaiData] = useState();
    const handleRefetchData = async (khuyenMaiData) => {
        const refetchData = [];
        for (var i = 0; i < khuyenMaiData.length; i++) {
            const currentDate = new Date();
            // Chuỗi ngày cần so sánh
            const dateString = khuyenMaiData[i].ngayKetThuc;
            // Chuyển chuỗi thành đối tượng Date
            const compareDate = new Date(dateString);
            if (currentDate > compareDate) {
                khuyenMaiData[i].tinhTrang = 'Hết hạn';
            } else {
                khuyenMaiData[i].tinhTrang = 'Còn hiệu lực';
            }

            khuyenMaiData[i].ngayBatDau = moment(khuyenMaiData[i].ngayBatDau).format('DD/MM/YYYY HH:mm')
            khuyenMaiData[i].ngayKetThuc = moment(khuyenMaiData[i].ngayKetThuc).format('DD/MM/YYYY HH:mm')

            var goiDangKyStr = '';
            for (var j = 0; j < khuyenMaiData[i].goiDangKyId.length; j++) {
                j == khuyenMaiData[i].goiDangKyId.length - 1 ? goiDangKyStr = goiDangKyStr + khuyenMaiData[i].goiDangKyId[j].tenGoi : goiDangKyStr = goiDangKyStr + khuyenMaiData[i].goiDangKyId[j].tenGoi + ', ';
            }
            khuyenMaiData[i].goiDangKyStr = goiDangKyStr;

            refetchData.push(khuyenMaiData[i]);
            setAllKhuyenMai(refetchData);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const goiDangKyData = await getAllGoiDangKy();
            if (goiDangKyData) {
                setAllGoiDangKy(goiDangKyData);
            }

            const khuyenMaiData = await getAllKhuyenMai();

            if (khuyenMaiData) {
                handleRefetchData(khuyenMaiData);
                setAllKhuyenMai(khuyenMaiData);
            }
        }
        fetchData();
    }, [])

    const handleSubmit = async (values) => {
        let res;
        if (khuyenMaiData && khuyenMaiData._id) {
            res = await editKhuyenMai(khuyenMaiData._id, values);
        } else {
            res = await createKhuyenMai(values);
        }

        if (res) {
            toast.success('Cập nhật khuyến mãi thành công');
            const khuyenMaiRes = await getAllKhuyenMai();

            if (khuyenMaiRes) {
                handleRefetchData(khuyenMaiRes);
                setAllKhuyenMai(khuyenMaiRes);
            }
            setKhuyenMaiData(null);
        }
    }

    const handleDelete = async (khuyenMaiId) => {
        const res = await deleteKhuyenMai(khuyenMaiId);

        if (res) {
            toast.success('Xoá khuyến mãi thành công');
            const khuyenMaiRes = await getAllKhuyenMai();

            if (khuyenMaiRes) {
                handleRefetchData(khuyenMaiRes);
                setAllKhuyenMai(khuyenMaiRes);
            }
            setKhuyenMaiData(null);
        }
    }


    const handleRefresh = () => {
        setKhuyenMaiData(null);
    }

    const handleEdit = async (record) => {
        console.log("Check record: ", record);
        const goiDangKyId = [];
        record.goiDangKyId.map((value) => {
            return goiDangKyId.push(value._id);
        })
        const khuyenMaiData = {
            _id: record._id,
            goiDangKyId: goiDangKyId,
            noiDung: record.noiDung,
            tiLeGiamGia: record.tiLeGiamGia,
            ngayBatDau: dayjs(record.ngayBatDau, 'DD/MM/YYYY HH:mm').format(),
            ngayKetThuc: dayjs(record.ngayKetThuc, 'DD/MM/YYYY HH:mm').format()
        }
        setKhuyenMaiData(khuyenMaiData);
    }

    const handleSendNoti = async (record) => {
        const values = {
            loai: 'khuyenMai',
            noiDung: record.noiDung,
        }
        const res = await createAllThongBao(values);

        if (res) {
            toast.success('Đã gửi thông báo cho tất cả người dùng thành công');
        }
    }

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
            title: 'Nội dung',
            dataIndex: 'noiDung',
            key: 'noiDung',
            width: '30%',
            ...getColumnSearchProps('noiDung'),
            sorter: (a, b) => a.noiDung.length - b.noiDung.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tỷ lệ giảm giá',
            dataIndex: 'tiLeGiamGia',
            key: 'tiLeGiamGia',
            width: '5%',
            ...getColumnSearchProps('tiLeGiamGia'),
            render: (_, { tiLeGiamGia }) => (
                <>
                    <h1>{tiLeGiamGia} %</h1>
                </>
            ),
            sorter: (a, b) => a.tiLeGiamGia - b.tiLeGiamGia,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'ngayBatDau',
            key: 'ngayBatDau',
            width: '15%',
            ...getColumnSearchProps('ngayBatDau'),
            sorter: (a, b) => a.ngayBatDau - b.ngayBatDau,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngayKetThuc',
            key: 'ngayKetThuc',
            width: '15%',
            ...getColumnSearchProps('ngayKetThuc'),
            sorter: (a, b) => moment(a.ngayKetThuc).format('DD/MM/YYYY HH:mm') - moment(b.ngayKetThuc).format('DD/MM/YYYY HH:mm'),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            width: '15%',
            ...getColumnSearchProps('tinhTrang'),
            sorter: (a, b) => a.tinhTrang.length - b.tinhTrang.length,
            render: (_, { tinhTrang }) => (
                <>
                    {tinhTrang == 'Hết hạn' ? <h1 className='text-red-600'>{tinhTrang}</h1> : <h1 className='text-green-600'>{tinhTrang}</h1>}
                </>
            ),
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'Gói áp dụng',
            dataIndex: 'goiDangKyStr',
            key: 'goiDangKyStr',
            width: '25%',
            ...getColumnSearchProps('goiDangKyStr'),
            sorter: (a, b) => a.goiDangKyStr.length - b.goiDangKyStr.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <div className='block [&>*]:w-[150px] [&>*]:mb-2'>
                        <Button className='bg-yellow-400' disabled={record.tinhTrang == 'Còn hiệu lực' ? false : true} onClick={() => handleSendNoti(record)}>Gửi thông báo</Button>
                        <Button className='bg-green-600' onClick={() => handleEdit(record)}>Sửa</Button>
                        <Button className='bg-red-500' onClick={() => handleDelete(record._id)}>Xoá</Button>
                    </div>
                </Space>
            ),
        },
    ].filter(item => item.title != 'id');;

    const PromotionSchema = Yup.object().shape({
        noiDung: Yup.string().min(5, "Nội dung khuyến mãi ít nhất 5 ký tự").required('Vui lòng nhập nội dung khuyến mãi'),
        tiLeGiamGia: Yup.number('Tỷ lệ % không hợp lệ').min(0).max(100).required('Vui lòng nhập % giảm giá'),
        ngayBatDau: Yup.date('Ngày bắt đầu không hợp lệ').required('Vui lòng nhập ngày bắt đầu khuyến mãi'),
        ngayKetThuc: Yup.date('Ngày kết thúc không hợp lệ').required('Vui lòng nhập ngày kết thúc khuyến mãi'),
        goiDangKyId: Yup.array().min(1, 'Vui lòng chọn ít nhất 1 gói đăng ký').required('Vui lòng chọn ít nhất 1 gói đăng ký'),
    })

    return (
        <>
            {allGoiDangKy ?
                <div className=''>
                    <Button className='float-right' onClick={() => { handleRefresh() }}>Tạo mới</Button>
                    <div className='flex justify-center [&>*]:mb-3'>
                        <Formik
                            initialValues={
                                khuyenMaiData ? khuyenMaiData : {
                                    noiDung: '',
                                    tiLeGiamGia: null,
                                    ngayBatDau: null,
                                    ngayKetThuc: null,
                                    goiDangKyId: [],
                                }
                            }
                            onSubmit={(values, { setFieldError }) => {
                                // console.log("Check values: ", values);
                                handleSubmit(values, setFieldError)
                            }
                            }
                            validationSchema={PromotionSchema}
                            enableReinitialize
                        >
                            {({
                                values,
                                errors,
                                touched,
                                setFieldValue,
                                handleChange,
                                handleBlur,
                                handleSubmit
                            }) => (
                                <Form className='w-[400px] mt-[15px] ml-[30px] [&>div]:mb-5'>
                                    <div>
                                        <label htmlFor="hoTen">
                                            Chọn gói đăng ký: <RequiredIcon />
                                        </label>
                                        <Select
                                            name="goiDangKyId"
                                            id="goiDangKyId"
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            status={errors?.goiDangKyId && touched?.goiDangKyId ? 'error' : ''}
                                            value={values.goiDangKyId}
                                            onChange={(value) => {
                                                setFieldValue(
                                                    `goiDangKyId`,
                                                    value
                                                )
                                            }}
                                            optionLabelProp="label"
                                            allowClear
                                        >
                                            {allGoiDangKy.map((value, index) => {
                                                return (<Option value={value._id} label={value.tenGoi} key={value._id}>
                                                    <Space>
                                                        {value.tenGoi}
                                                    </Space>
                                                </Option>)
                                            })}
                                        </Select>
                                        <ErrorMessage
                                            className="field-error"
                                            component="div"
                                            name="goiDangKyId"
                                        ></ErrorMessage>
                                    </div>
                                    <div>
                                        <label htmlFor="noiDung">
                                            Nội dung: <RequiredIcon />
                                        </label>
                                        <FastField
                                            name="noiDung"
                                            id="noiDung"
                                            value={values.noiDung}
                                            component={TextArea}
                                            status={errors?.noiDung && touched?.noiDung ? 'error' : ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></FastField>
                                        <ErrorMessage
                                            className="field-error"
                                            component="div"
                                            name="noiDung"
                                        ></ErrorMessage>
                                    </div>
                                    <div>
                                        <label htmlFor="tiLeGiamGia" className='mr-2'>
                                            Tỷ lệ giảm giá: <RequiredIcon />
                                        </label>
                                        <InputNumber
                                            className='w-[100%]'
                                            name="tiLeGiamGia"
                                            id="tiLeGiamGia"
                                            value={values.tiLeGiamGia}
                                            min={0}
                                            max={100}
                                            formatter={(value) => `${value}%`}
                                            parser={(value) => value.replace('%', '')}
                                            status={errors?.tiLeGiamGia && touched?.tiLeGiamGia ? 'error' : ''}
                                            onChange={(value) => {
                                                value = parseInt(value);
                                                setFieldValue(
                                                    `tiLeGiamGia`,
                                                    value
                                                )
                                            }}
                                        />
                                        <ErrorMessage
                                            className="field-error"
                                            component="div"
                                            name="tiLeGiamGia"
                                        ></ErrorMessage>
                                    </div>
                                    <div>
                                        <label htmlFor="ngayHieuLuc">
                                            Ngày bắt đầu/Ngày kết thúc khuyến mãi: <RequiredIcon />
                                        </label>
                                        <RangePicker
                                            className='w-[100%]'
                                            defaultValue={[dayjs(), dayjs()]}
                                            value={[
                                                values.ngayBatDau === null
                                                    ? null
                                                    : dayjs(values.ngayBatDau),
                                                values.ngayKetThuc === null
                                                    ? null
                                                    : dayjs(
                                                        values.ngayKetThuc
                                                    ),
                                            ]}
                                            status={
                                                (errors?.ngayBatDau &&
                                                    touched?.ngayBatDau) ||
                                                    (errors?.ngayKetThuc &&
                                                        touched?.ngayKetThuc)
                                                    ? 'error'
                                                    : ''
                                            }
                                            onCalendarChange={(dates, dateStrings) => {
                                                console.log("Check dates: ", dates);
                                                if (dates) {
                                                    setFieldValue(
                                                        `ngayBatDau`,
                                                        dates[0]?.$d
                                                    )
                                                    setFieldValue(
                                                        `ngayKetThuc`,
                                                        dates[1]?.$d
                                                    )
                                                }
                                            }}
                                        />
                                        <ErrorMessage
                                            className="field-error"
                                            component="div"
                                            name={`ngayBatDau`}
                                        ></ErrorMessage>
                                        <ErrorMessage
                                            className="field-error"
                                            component="div"
                                            name={`ngayKetThuc`}
                                        ></ErrorMessage>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={handleSubmit}
                                            htmlType="submit"
                                            type='primary'
                                            className='bg-[#ffba00] w-[100%]'
                                        >
                                            {khuyenMaiData ? 'Lưu thông tin khuyến mãi' : 'Tạo khuyến mãi'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div>
                        <Table columns={columns} dataSource={allKhuyenMai} className='mt-5' rowKey='_id'
                            pagination={{ position: 'bottom', pageSize: 4 }}
                        />
                    </div>

                </div>
                : null}
        </>
    );
};

export default ManagerPromotions;