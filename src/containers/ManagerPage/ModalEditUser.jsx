import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Button, Form, Input, Select } from 'antd';
import { Link, useHref } from 'react-router-dom';
import { CameraOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import { getAllTinhThanh, getPhuongXa, getQuanHuyen } from '../../services/diaChi';
import { ErrorMessage, FastField, Field, FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import "./ModalEditUser.scss";
import { changeAvatar, editUser, updateUser } from '../../services/nguoiDung';
import { getCurrentUser } from '../../services/nguoiDung';
import { toast } from 'react-toastify';
import axios from 'axios';

function ModalEditUser({ user }) {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const [quanHuyen, setQuanHuyen] = useState([]);
    const [phuongXa, setPhuongXa] = useState([]);
    const tinhThanh = useQuery(['tinhThanh'], getAllTinhThanh);

    const dispatch = useDispatch();

    useEffect(() => {
        setImageUrl(user.data?.anhDaiDien?.url)
    }, [user])

    useEffect(() => {
        async function fetchData() {
            setQuanHuyen(await getQuanHuyen(user.data?.diaChi?.tinhTPCode));
            setPhuongXa(await getPhuongXa(user.data?.diaChi?.quanHuyenCode))
        }
        fetchData();
    }, []);

    const onChangeTinhTP = async (value) => {
        setQuanHuyen(await getQuanHuyen(value));
    };

    const onChangeQuanHuyen = async (value) => {
        setPhuongXa(await getPhuongXa(value));
    };

    const sampleAddress = {
        kinhDo: null,
        viDo: null,
        soNha: '',
        phuongXaCode: {},
        quanHuyenCode: {},
        tinhTPCode: {},
    }

    const ProfileSchema = Yup.object().shape({
        hoTen: Yup.string().min(5, "Tên ít nhất 5 ký tự").required('Vui lòng nhập họ tên'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        sdt: Yup.string().required('Vui lòng nhập số điện thoại').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ"),
        diaChi:
            Yup.object().shape({
                kinhDo: Yup.number()
                    .min(-180, "Kinh độ trong khoảng -180 đến 180")
                    .max(180, "Kinh độ trong khoảng -180 đến 180"),
                viDo: Yup.number()
                    .min(-90, 'Vĩ độ phải từ -90 đến 90!')
                    .max(90, 'Vĩ độ phải từ -90 đến 90!'),
            }),
    })

    const handleChangeImage = async (file) => {
        const isJpgOrPng = file[0].type === 'image/jpeg' || file[0].type === 'image/png';
        if (!isJpgOrPng) {
            toast.error('Chỉ hỗ trợ ảnh định dạng JPG/PNG!');
            return;
        }
        const isLt2M = file[0].size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast.error('Dunglượng ảnh phải nhỏ hơn 2MB!');
            return
        }

        const data = new FormData();
        data.append('file', file[0]);
        data.append('upload_preset', 'avatar');

        const uploadRes = await axios.post(
            'https://api.cloudinary.com/v1_1/dcqllxxrk/image/upload',
            data,
            { withCredentials: false }
        )
        if (uploadRes.data) {
            toast.success('Cập nhật ảnh đại diện thành công, vui lòng đợi trong ít phút để hệ thống xử lý!');
            const { url, public_id } = uploadRes.data;
            const values = {
                anhDaiDien: { url, public_id }
            };
            const res = await changeAvatar(user.data._id, values);
            if (res) {
                setImageUrl(url);
            }
        }
    };

    const handleSubmit = async (values, setFieldError) => {
        const res = await updateUser(user.data._id, values);

        if (res) {
            toast.success("Cập nhật thông tin thành công");
        }
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="container bg-[#f4f4f4]">
            <div className="max-w-[936px] bg-[#fff]">
                <hr />
                <div className='block'>
                    <div className='flex justify-center'>
                        <img src={imageUrl ? imageUrl : avatar} alt="user's avatar" className='avatar w-[110px] h-[110px] m-5 rounded-[50%]' />
                        <div className='image-upload absolute mt-[100px] ml-[380px] avatar-uploader'>
                            <label htmlFor="files" className="btn"><CameraOutlined className='bg-gray-300 cursor-pointer p-2 text-[30px] rounded-[50%]' /></label>
                            <input id="files" style={{ "visibility": "hidden" }} type="file" onChange={(e) => handleChangeImage(e.target.files)} />
                        </div>
                    </div>
                    <Formik
                        initialValues={
                            user.data ? user.data : {
                                hoTen: '',
                                gioiTinh: '',
                                ngaySinh: null,
                                diaChi: sampleAddress,
                                email: '',
                                sdt: '',
                                trangThai: true,
                                quyen: '',
                            }
                        }
                        onSubmit={(values, { setFieldError }) => {
                            handleSubmit(values, setFieldError)
                        }
                        }
                        validationSchema={ProfileSchema}
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
                            <Form className='w-[60%] m-auto [&>div]:mb-5'>
                                <div>
                                    <label htmlFor="hoTen">
                                        Họ tên: <RequiredIcon />
                                    </label>
                                    <FastField
                                        name="hoTen"
                                        id="hoTen"
                                        component={Input}
                                        status={errors?.name && touched?.name ? 'error' : ''}
                                        value={values.hoTen}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    ></FastField>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name="hoTen"
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="sdt">
                                        Số điện thoại: <RequiredIcon />
                                    </label>
                                    <FastField
                                        name="sdt"
                                        id="sdt"
                                        component={Input}
                                        status={errors?.sdt && touched?.sdt ? 'error' : ''}
                                        value={values.sdt}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    ></FastField>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name="sdt"
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="email">
                                        Email: <RequiredIcon />
                                    </label>
                                    <FastField
                                        name="email"
                                        id="email"
                                        component={Input}
                                        status={errors?.email && touched?.email ? 'error' : ''}
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    ></FastField>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name="email"
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label
                                        htmlFor={`diaChi.tinhTPCode`}
                                    >
                                        Quyền: <RequiredIcon />
                                    </label>
                                    <Select
                                        style={{ width: '100%' }}
                                        name={`quyen`}
                                        id={`quyen`}
                                        value={values.quyen?._id ? values.quyen._id : values.quyen}
                                        status={
                                            errors?.quyen &&
                                                touched?.quyen
                                                ? 'error'
                                                : ''
                                        }
                                        onChange={
                                            (value) => {
                                                setFieldValue(
                                                    `quyen`,
                                                    value
                                                )
                                            }
                                        }
                                        onBlur={handleBlur}
                                        placeholder="Chọn quyền"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={[
                                            { label: "Admin", value: '64074e397906c710710e01bf' },
                                            { label: "Người dùng", value: '64074e397906c710710e01c1' },
                                        ]}
                                    ></Select>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name={`quyen`}
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label
                                        htmlFor={`diaChi.tinhTPCode`}
                                    >
                                        Trạng thái: <RequiredIcon />
                                    </label>
                                    <Select
                                        style={{ width: '100%' }}
                                        name={`trangThai`}
                                        id={`trangThai`}
                                        value={values.trangThai == true ? 'Đang hoạt động' : 'Đã khoá'}
                                        status={
                                            errors?.trangThai &&
                                                touched?.trangThai
                                                ? 'error'
                                                : ''
                                        }
                                        onChange={
                                            (value) => {
                                                setFieldValue(
                                                    `trangThai`,
                                                    value
                                                )
                                            }
                                        }
                                        onBlur={handleBlur}
                                        placeholder="Chọn Tỉnh/Thành phố"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={[
                                            { label: "Đang hoạt động", value: true },
                                            { label: "Đã khoá", value: false },
                                        ]}
                                    ></Select>
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name={`trangThai`}
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="">Địa chỉ</label>
                                </div>
                                <div>
                                    <div className='ml-3 [&>*]:mb-4'>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.kinhDo`}
                                            >
                                                Kinh độ:
                                            </label>
                                            <Field
                                                name={`diaChi.kinhDo`}
                                                id={`diaChi.kinhDo`}
                                                component={Input}
                                                value={values?.diaChi?.kinhDo}
                                                status={
                                                    errors?.diaChi?.kinhDo &&
                                                        touched?.diaChi?.kinhDo
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            ></Field>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.kinhDo`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.viDo`}
                                            >
                                                Vĩ độ:
                                            </label>
                                            <Field
                                                name={`diaChi.viDo`}
                                                id={`diaChi.viDo`}
                                                component={Input}
                                                value={values?.diaChi?.viDo}
                                                status={
                                                    errors?.diaChi?.viDo &&
                                                        touched?.diaChi?.viDo
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            ></Field>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.viDo`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.soNha`}
                                            >
                                                Số nhà, đường:
                                            </label>
                                            <Field
                                                name={`diaChi.soNha`}
                                                id={`diaChi.soNha`}
                                                component={Input}
                                                value={values?.diaChi?.soNha}
                                                status={
                                                    errors?.diaChi?.soNha &&
                                                        touched?.diaChi?.soNha
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            ></Field>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.soNha`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.tinhTPCode`}
                                            >
                                                Tỉnh/Thành phố:
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.tinhTPCode`}
                                                id={`diaChi.tinhTPCode`}
                                                value={values?.diaChi?.tinhTPCode}
                                                status={
                                                    errors?.diaChi?.tinhTPCode &&
                                                        touched?.diaChi?.tinhTPCode
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={
                                                    (value) => {
                                                        setFieldValue(
                                                            `diaChi.tinhTPCode`,
                                                            value
                                                        )
                                                        onChangeTinhTP(value)
                                                    }
                                                }
                                                onBlur={handleBlur}
                                                placeholder="Chọn Tỉnh/Thành phố"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '')
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                fieldNames={{ label: 'ten', value: 'id' }}
                                                options={tinhThanh.data}
                                            ></Select>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.tinhTPCode`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.quanHuyenCode`}
                                            >
                                                Quận/Huyện:
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.quanHuyenCode`}
                                                id={`diaChi.quanHuyenCode`}
                                                value={values?.diaChi?.quanHuyenCode}
                                                status={
                                                    errors?.diaChi?.quanHuyenCode &&
                                                        touched?.diaChi?.quanHuyenCode
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={(value) => {
                                                    setFieldValue(
                                                        `diaChi.quanHuyenCode`,
                                                        value
                                                    );
                                                    onChangeQuanHuyen(value)
                                                }
                                                }
                                                onBlur={handleBlur}
                                                placeholder="Chọn Quận/Huyện"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '')
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                fieldNames={{ label: 'ten', value: 'id' }}
                                                options={quanHuyen}
                                            ></Select>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.tinhTPCode`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.phuongXaCode`}
                                            >
                                                Phường/Xã:
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.phuongXaCode`}
                                                id={`diaChi.phuongXaCode`}
                                                value={values?.diaChi?.phuongXaCode}
                                                status={
                                                    errors?.diaChi?.phuongXaCode &&
                                                        touched?.diaChi?.phuongXaCode
                                                        ? 'error'
                                                        : ''
                                                }
                                                onChange={(value) => {
                                                    setFieldValue(
                                                        `diaChi.phuongXaCode`,
                                                        value
                                                    );
                                                }
                                                }
                                                onBlur={handleBlur}
                                                placeholder="Chọn Phường/Xã"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '')
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                                fieldNames={{ label: 'ten', value: 'id' }}

                                                options={phuongXa}
                                            ></Select>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.phuongXaCode`}
                                            ></ErrorMessage>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="gioiTinh">
                                        Giới tính:
                                    </label>
                                    <Select
                                        style={{ width: '100%' }}
                                        name="gioiTinh"
                                        id="gioiTinh"
                                        value={values.gioiTinh === 'M' ? 'Nam' : values.gioiTinh === 'F' ? 'Nữ' : "Khác"}
                                        status={
                                            errors?.gioiTinh?.[index] &&
                                                touched?.gioiTinh
                                                ? 'error'
                                                : ''
                                        }
                                        onChange={(value) =>
                                            setFieldValue(
                                                `gioiTinh`,
                                                value
                                            )
                                        }
                                        onBlur={handleBlur}
                                        placeholder="Chọn giới tính"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        fieldNames={{ label: 'ten', value: 'code' }}
                                        options={[
                                            { ten: "Nam", code: "M" },
                                            { ten: "Nữ", code: "F" },
                                            { ten: "Other", code: "Other" }
                                        ]}
                                    ></Select>
                                </div>
                                <div className='flex justify-center'>
                                    <Button
                                        onClick={handleSubmit}
                                        htmlType="submit"
                                        type='primary'
                                        className='bg-[#ffba00]'
                                    >
                                        Lưu thông tin
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div >
    );
};

export default ModalEditUser