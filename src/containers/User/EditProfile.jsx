import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
// import AuthService from "../../services/auth.service";
import avatar from '../../assets/img/avatar.svg'
import { Button, Form, Input, Select } from 'antd';
import { Link, useHref } from 'react-router-dom';
import { CameraOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import { getAllTinhThanh, getPhuongXa, getQuanHuyen } from '../../services/diaChi';
import { ErrorMessage, FastField, Field, FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import "./EditProfile.scss";
import { editUser } from '../../services/nguoiDung';
import { getCurrentUser } from '../../services/nguoiDung';
import { toast } from 'react-toastify';
import { updateUser } from '../../actions/auth';
import axios from 'axios';

function EditProfile() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const [quanHuyen, setQuanHuyen] = useState([]);
    const [phuongXa, setPhuongXa] = useState([]);
    const [showPassForm, setShowPassForm] = useState(false);
    const [avatarFile, setAvatarFile] = useState();
    const tinhThanh = useQuery(['tinhThanh'], getAllTinhThanh);

    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            setQuanHuyen(await getQuanHuyen(user.data.diaChi.tinhTPCode));
            setPhuongXa(await getPhuongXa(user.data.diaChi.quanHuyenCode))
        }
        fetchData();
    }, []);

    const onChangeTinhTP = async (value) => {
        setQuanHuyen(await getQuanHuyen(value));
    };

    const onChangeQuanHuyen = async (value) => {
        setPhuongXa(await getPhuongXa(value));
    };

    const handleShowPassForm = () => {
        if (showPassForm === false)
            setShowPassForm(true);
        else setShowPassForm(false);
    }

    const sampleAddress = {
        kinhDo: null,
        viDo: null,
        soNha: '',
        phuongXaCode: {},
        quanHuyenCode: {},
        tinhTPCode: {},
    }

    const ProfileSchema = Yup.object().shape({
        hoTen: Yup.string().min(4).max(100).required('Vui l??ng nh???p h??? t??n!'),
        gioiTinh: Yup.string().required('Vui l??ng ch???n gi???i t??nh!'),
        diaChi:
            Yup.object().shape({
                kinhDo: Yup.number()
                    .min(-180)
                    .max(180)
                    .required('Kinh ????? ph???i t??? -180 ?????n 180!'),
                viDo: Yup.number()
                    .min(-90)
                    .max(90)
                    .required('V?? ????? ph???i t??? -90 ?????n 90!'),
                soNha: Yup.string().required(
                    'Vui l??ng nh???p s??? nh??, ???????ng!'
                ),
                tinhTPCode: Yup.string().required(
                    'Vui l??ng ch???n T???nh/Th??nh ph???!'
                ),
                quanHuyenCode: Yup.string().required(
                    'Vui l??ng ch???n Qu???n/Huy???n!'
                ),
                phuongXaCode: Yup.string().required(
                    'Vui l??ng ch???n Ph?????ng/X??!'
                )
            }),
        // currentPassword: Yup.string().required('Vui l??ng nh???p m???t kh???u hi???n t???i!'),
        // newPassword: Yup.string().required('Vui l??ng nh???p m???t kh???u m???i!'),
        // confirmPassword: Yup.string()
        //     .oneOf([Yup.ref('newPassword'), null], 'M???t kh???u m???i kh??ng kh???p!')
    })

    const handleChangeImage = async (file) => {
        const isJpgOrPng = file[0].type === 'image/jpeg' || file[0].type === 'image/png';
        if (!isJpgOrPng) {
            toast.error('Ch??? h??? tr??? ???nh ?????nh d???ng JPG/PNG!');
            return;
        }
        const isLt2M = file[0].size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast.error('Dungl?????ng ???nh ph???i nh??? h??n 2MB!');
            return
        }

        const data = new FormData();
        data.append('file', file[0]);
        data.append('upload_preset', 'auwulfph');

        const uploadRes = await axios.post(
            'https://api.cloudinary.com/v1_1/dcqllxxrk/image/upload',
            data,
            { withCredentials: false }
        )
        if (uploadRes.data) {
            toast.success('C???p nh???t ???nh ?????i di???n th??nh c??ng, vui l??ng ?????i trong ??t ph??t ????? h??? th???ng x??? l??!');
            const { url, public_id } = uploadRes.data;
            const values = {
                _id: user.data._id,
                anhDaiDien: { url, public_id }
            };
            const res = handleSubmit(values);
            if (res) {
                setImageUrl(url);
            }
        }
    };

    const handleSubmit = async (values, setFieldError) => {
        const res = await editUser(values);

        if (res) {
            toast.success("C???p nh???t th??ng tin th??nh c??ng");
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
                <h1 className='p-4 font-semibold text-lg'>Th??ng tin c?? nh??n</h1>
                <hr />
                <div className='flex'>
                    <img src={user.data.anhDaiDien.url ? user.data.anhDaiDien.url : avatar} alt="" className='avatar w-[110px] h-[110px] m-5 rounded-[50%]' />
                    <div className='image-upload absolute mt-[100px] ml-[100px] avatar-uploader'>
                        <label htmlFor="files" className="btn"><CameraOutlined className='bg-gray-300 cursor-pointer p-2 text-[30px] rounded-[50%]' /></label>
                        <input id="files" style={{ "visibility": "hidden" }} type="file" onChange={(e) => handleChangeImage(e.target.files)} />
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
                                // currentPassword: '',
                                // newPassword: '',
                                // confirmPassword: ''
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
                                        H??? t??n: <RequiredIcon />
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
                                        S??? ??i???n tho???i:
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
                                        name="hoTen"
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
                                        name="hoTen"
                                    ></ErrorMessage>
                                </div>
                                <div>
                                    <label htmlFor="">?????a ch???</label>
                                </div>
                                <div>
                                    <div className='ml-3 [&>*]:mb-4'>
                                        <div>
                                            <label
                                                htmlFor={`diaChi.kinhDo`}
                                            >
                                                Kinh ?????: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`diaChi.kinhDo`}
                                                id={`diaChi.kinhDo`}
                                                component={Input}
                                                value={values.diaChi.kinhDo}
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
                                                V?? ?????: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`diaChi.viDo`}
                                                id={`diaChi.viDo`}
                                                component={Input}
                                                value={values.diaChi.viDo}
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
                                                S??? nh??, ???????ng: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`diaChi.soNha`}
                                                id={`diaChi.soNha`}
                                                component={Input}
                                                value={values.diaChi.soNha}
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
                                                T???nh/Th??nh ph???: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.tinhTPCode`}
                                                id={`diaChi.tinhTPCode`}
                                                value={values.diaChi.tinhTPCode}
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
                                                placeholder="Ch???n T???nh/Th??nh ph???"
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
                                                Qu???n/Huy???n: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.quanHuyenCode`}
                                                id={`diaChi.quanHuyenCode`}
                                                value={values.diaChi.quanHuyenCode}
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
                                                placeholder="Ch???n Qu???n/Huy???n"
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
                                                Ph?????ng/X??: <RequiredIcon />
                                            </label>
                                            <Select
                                                style={{ width: '100%' }}
                                                name={`diaChi.phuongXaCode`}
                                                id={`diaChi.phuongXaCode`}
                                                value={values.diaChi.phuongXaCode}
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
                                                placeholder="Ch???n Ph?????ng/X??"
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
                                        Gi???i t??nh:
                                    </label>
                                    <Select
                                        style={{ width: '100%' }}
                                        name="gioiTinh"
                                        id="gioiTinh"
                                        value={values.gioiTinh === 'M' ? 'Nam' : values.gioiTinh === 'F' ? 'N???' : "Kh??c"}
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
                                        placeholder="Ch???n gi???i t??nh"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        fieldNames={{ label: 'ten', value: 'code' }}
                                        options={[
                                            { ten: "Nam", code: "M" },
                                            { ten: "N???", code: "F" },
                                            { ten: "Other", code: "Other" }
                                        ]}
                                    ></Select>
                                </div>
                                <div>
                                    <label htmlFor="">
                                        M???t kh???u:
                                    </label>
                                    <Input type='current-password'
                                        value={"******"}
                                        disabled suffix={
                                            <Button onClick={handleShowPassForm}>
                                                <Link to="/users/editPassword"><EditOutlined /></Link>
                                            </Button>
                                        } />
                                    {/* {showPassForm ?
                                        <>
                                            <div>
                                                <label>
                                                    M???t kh???u hi???n t???i: <RequiredIcon />
                                                </label>
                                                <Field
                                                    name={`currentPassword`}
                                                    id={`currentPassword`}
                                                    component={Input}
                                                    value={values.currentPassword}
                                                    status={
                                                        errors?.currentPassword &&
                                                            touched?.currentPassword
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                ></Field>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`currentPassword`}
                                                ></ErrorMessage>
                                            </div>
                                            <div>
                                                <label>
                                                    M???t kh???u m???i: <RequiredIcon />
                                                </label>
                                                <Field
                                                    name={`newPassword`}
                                                    id={`newPassword`}
                                                    component={Input}
                                                    value={values.newPassword}
                                                    status={
                                                        errors?.newPassword &&
                                                            touched?.newPassword
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                ></Field>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`newPassword`}
                                                ></ErrorMessage>
                                            </div>
                                            <div>
                                                <label>
                                                    X??c nh???n m???t kh???u m???i: <RequiredIcon />
                                                </label>
                                                <Field
                                                    name={`confirmPassword`}
                                                    id={`confirmPassword`}
                                                    component={Input}
                                                    value={values.confirmPassword}
                                                    status={
                                                        errors?.confirmPassword &&
                                                            touched?.confirmPassword
                                                            ? 'error'
                                                            : ''
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                ></Field>
                                                <ErrorMessage
                                                    className="field-error"
                                                    component="div"
                                                    name={`confirmPassword`}
                                                ></ErrorMessage>
                                            </div>
                                        </>
                                        : null
                                    } */}
                                </div>
                                <div>
                                    <Button
                                        onClick={handleSubmit}
                                        htmlType="submit"
                                        type='primary'
                                        className='bg-[#ffba00]'
                                    >
                                        L??u th??ng tin
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