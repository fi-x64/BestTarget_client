import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Button, Form, Input, Select, Tooltip } from 'antd';
import { Link, useHref } from 'react-router-dom';
import { CameraOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import { getAllTinhThanh, getPhuongXa, getQuanHuyen } from '../../services/diaChi';
import { ErrorMessage, FastField, Field, FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import "./EditProfile.scss";
import { changeAvatar, editUser } from '../../services/nguoiDung';
import { getCurrentUser } from '../../services/nguoiDung';
import { toast } from 'react-toastify';
import { updateUser } from '../../actions/auth';
import axios from 'axios';

function EditProfile() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);
    // const [imageUrl, setImageUrl] = useState();
    const [quanHuyen, setQuanHuyen] = useState([]);
    const [phuongXa, setPhuongXa] = useState([]);
    const tinhThanh = useQuery(['tinhThanh'], getAllTinhThanh);

    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.data?.diaChi?.tinhTPCode && user?.data?.diaChi?.quanHuyenCode) {
            async function fetchData() {
                setQuanHuyen(await getQuanHuyen(user.data.diaChi.tinhTPCode));
                setPhuongXa(await getPhuongXa(user.data.diaChi.quanHuyenCode))
            }
            fetchData();
        }
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
        soNha: "",
        phuongXaCode: "",
        quanHuyenCode: "",
        tinhTPCode: "",
    }

    const ProfileSchema = Yup.object().shape({
        hoTen: Yup.string().min(5, "Tên ít nhất 5 ký tự").required('Vui lòng nhập họ tên'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        sdt: Yup.string().required('Vui lòng nhập số điện thoại').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ"),
        diaChi:
            Yup.object().shape({
                kinhDo: Yup.number()
                    .min(-180, 'Kinh độ phải từ -180 đến 180!')
                    .max(180, 'Kinh độ phải từ -180 đến 180!').typeError('Vui lòng nhập số'),
                viDo: Yup.number()
                    .min(-90, 'Vĩ độ phải từ -90 đến 90!')
                    .max(90, 'Vĩ độ phải từ -90 đến 90!').typeError('Vui lòng nhập số'),
                soNha: Yup.string().required(
                    'Vui lòng nhập số nhà, đường!'
                ),
                tinhTPCode: Yup.string().required(
                    'Vui lòng chọn Tỉnh/Thành phố!'
                ),
                quanHuyenCode: Yup.string().required(
                    'Vui lòng chọn Quận/Huyện!'
                ),
                phuongXaCode: Yup.string().required(
                    'Vui lòng chọn Phường/Xã!'
                )
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
                // setImageUrl(url);
                const newUserData = await getCurrentUser();
                var newUserInfo = { ...newUserData, status: 'success', token: user.token }
                localStorage.setItem("user", JSON.stringify(newUserInfo));
                dispatch(updateUser(newUserInfo))
            }
        }
    };

    const handleSubmit = async (values, setFieldError) => {
        const res = await editUser(values);

        if (res) {
            toast.success("Cập nhật thông tin thành công");
            const newUserData = await getCurrentUser();
            var newUserInfo = { ...newUserData, status: 'success', token: user.token }
            localStorage.setItem("user", JSON.stringify(newUserInfo));
            dispatch(updateUser(newUserInfo))
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
                <h1 className='p-4 font-semibold text-lg'>Thông tin cá nhân</h1>
                <hr />
                <div className='flex'>
                    <img src={user.data?.anhDaiDien?.url ? user.data?.anhDaiDien?.url : avatar} alt="user's avatar" className='avatar w-[110px] h-[110px] m-5 rounded-[50%]' />
                    <div className='image-upload absolute mt-[100px] ml-[100px] avatar-uploader'>
                        <label htmlFor="files" className="btn"><CameraOutlined className='bg-gray-300 cursor-pointer p-2 text-[30px] rounded-[50%]' /></label>
                        <input id="files" style={{ "visibility": "hidden" }} type="file" onChange={(e) => handleChangeImage(e.target.files)} />
                    </div>
                    <Formik
                        initialValues={
                            user.data ? user.data : {
                                hoTen: '',
                                gioiTinh: '',
                                diaChi: sampleAddress,
                                email: '',
                                sdt: '',
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
                            <Form className='w-[400px] mt-[15px] ml-[30px] [&>div]:mb-5'>
                                <div>
                                    <label htmlFor="hoTen">
                                        Họ tên: <RequiredIcon />
                                    </label>
                                    <FastField
                                        name="hoTen"
                                        id="hoTen"
                                        component={Input}
                                        status={errors?.hoTen && touched?.hoTen ? 'error' : ''}
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
                                        Số điện thoại:
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
                                        Email:
                                    </label>
                                    <FastField
                                        name="email"
                                        id="email"
                                        component={Input}
                                        status={errors?.email && touched?.email ? 'error' : ''}
                                        value={values.hoTen}
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
                                    <div>
                                        <label htmlFor="">Địa chỉ</label>
                                    </div>
                                    <div className='ml-3 [&>*]:mb-4'>
                                        <div className='flex'>
                                            <Tooltip title="Nhấn vào để lấy vị trí hiện tại" className='mt-4'>
                                                <Button
                                                    onClick={() => {
                                                        navigator.geolocation.getCurrentPosition(
                                                            (position) => {
                                                                const { latitude, longitude } = position.coords;
                                                                // setFieldValue({
                                                                //     "diaChi.kinhDo": longitude,
                                                                //     "diaChi.viDo": latitude,
                                                                // });
                                                                setFieldValue(
                                                                    `diaChi.kinhDo`,
                                                                    longitude
                                                                )
                                                                setFieldValue(
                                                                    `diaChi.viDo`,
                                                                    latitude
                                                                )
                                                            },
                                                            (error) => {
                                                                console.log(error);
                                                            },
                                                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                                                        );
                                                    }}
                                                    className='go-button bg-[#1677ff]'
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<i className="fa-solid fa-location-arrow"></i>}
                                                />
                                            </Tooltip>
                                            <div className='ml-4 w-[100%]'>
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
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.soNha`}
                                            >
                                                Số nhà, đường: <RequiredIcon />
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
                                                Tỉnh/Thành phố: <RequiredIcon />
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
                                                Quận/Huyện: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.quanHuyenCode`}
                                                id={`diaChi.quanHuyenCode`}
                                                value={values?.diaChi?.quanHuyenCode}
                                                options={quanHuyen}
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
                                            ></Select>
                                            <ErrorMessage
                                                className="field-error"
                                                component="div"
                                                name={`diaChi.quanHuyenCode`}
                                            ></ErrorMessage>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.phuongXaCode`}
                                            >
                                                Phường/Xã: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.phuongXaCode`}
                                                id={`diaChi.phuongXaCode`}
                                                options={phuongXa}
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
                                    <ErrorMessage
                                        className="field-error"
                                        component="div"
                                        name={`gioiTinh`}
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="">
                                        Mật khẩu:
                                    </label>
                                    <Input type='current-password'
                                        value={"******"}
                                        disabled suffix={

                                            <Link to="/users/editPassword"><EditOutlined className='text-[18px]' /></Link>

                                        } />
                                </div>
                                <div>
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

export default EditProfile