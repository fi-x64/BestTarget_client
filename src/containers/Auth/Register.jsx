import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Register.module.scss'
import classNames from 'classnames/bind'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'
import { createOTP, register } from '../../services/auth.service'
import ActiveAccount from './ActiveAccount'
import { SET_MESSAGE } from '../../actions/types'

const RegisterSchema = Yup.object().shape({
    hoTen: Yup.string().min(5, "Tên ít nhất 5 ký tự").required('Vui lòng nhập họ tên'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    sdt: Yup.string().required('Vui lòng nhập số điện thoại').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ"),
    matKhau: Yup.string().required('Vui lòng nhập mật khẩu!').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Mật khẩu phải ít nhất 8 ký tự, gồm ít nhất 1 chữ in hoa, 1 ký tự đặc biệt và 1 số"),
    xacNhanMatKhau: Yup.string().oneOf([Yup.ref('matKhau'), null], 'Xác nhận mật khẩu không khớp!')
})

const cl = classNames.bind(styles)

function Register() {
    const { isLoggedIn } = useSelector((state) => state.auth)
    const { message } = useSelector((state) => state.message)
    const [moveNextPage, setMoveNextPage] = useState(false);
    let navigate = useNavigate()
    const ref = useRef();

    const dispatch = useDispatch()

    const handleSubmit = async (values) => {
        const res = await register(values);
        console.log("Check values: ", values);
        if (res.status === 'success') {
            const createOTPData = await createOTP(values.email);
            if (createOTPData) {
                setMoveNextPage(true);
                dispatch({
                    type: SET_MESSAGE,
                    payload: '',
                });
            }
        } else if (res.status === 'fail') {
            const message = res.message;

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
        }
    }

    function handleKeyUp(event, values) {
        // Enter
        if (event.keyCode === 13) {
            handleSubmit(values);
        }
    }

    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    sdt: '',
                    matKhau: '',
                    xacNhanMatKhau: '',
                }}
                onSubmit={(values, { setFieldError }) =>
                    handleSubmit(values, setFieldError)
                }
                validationSchema={RegisterSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <div className={cl('container')} id="container">
                        {!moveNextPage ? <div className={cl('form-container')}>
                            <Form onSubmit={handleSubmit} onKeyUp={(event) => handleKeyUp(event, values)}>
                                <h1 className={cl('form-title')}>Đăng ký vào hệ thống</h1>
                                <div className={cl('group')}>
                                    <div className={cl('row-group')}>
                                        <div className={cl('row-group')}>
                                            <label className={cl('label')} htmlFor="name">
                                                Nhập tên của bạn: <RequiredIcon />
                                            </label>
                                            <FastField
                                                name="hoTen"
                                                id="hoTen"
                                                component={Input}
                                                value={values.hoTen}
                                                status={errors?.hoTen && touched?.hoTen ? 'error' : ''}
                                                className={cl('input')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            ></FastField>
                                            <ErrorMessage
                                                className="field-error max-w-[321px] text-red-500"
                                                component="div"
                                                name="hoTen"
                                            ></ErrorMessage>
                                        </div>
                                        <label className={cl('label')} htmlFor="name">
                                            Email: <RequiredIcon />
                                        </label>
                                        <FastField
                                            name="email"
                                            id="email"
                                            component={Input}
                                            value={values.email}
                                            status={errors?.email && touched?.email ? 'error' : ''}
                                            className={cl('input')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></FastField>
                                        <ErrorMessage
                                            className="field-error max-w-[321px] text-red-500"
                                            component="div"
                                            name="email"
                                        ></ErrorMessage>
                                    </div>
                                    <div className={cl('row-group')}>
                                        <label className={cl('label')} htmlFor="name">
                                            Số điện thoại: <RequiredIcon />
                                        </label>
                                        <FastField
                                            name="sdt"
                                            id="sdt"
                                            component={Input}
                                            value={values.sdt}
                                            status={errors?.sdt && touched?.sdt ? 'error' : ''}
                                            className={cl('input')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></FastField>
                                        <ErrorMessage
                                            className="field-error max-w-[321px] text-red-500"
                                            component="div"
                                            name="sdt"
                                        ></ErrorMessage>
                                    </div>
                                    <div className={cl('row-group')}>
                                        <label className={cl('label')} htmlFor="name">
                                            Mật khẩu: <RequiredIcon />
                                        </label>
                                        <FastField
                                            name="matKhau"
                                            id="matKhau"
                                            type="password"
                                            component={Input}
                                            value={values.matKhau}
                                            status={
                                                errors?.matKhau && touched?.matKhau ? 'error' : ''
                                            }
                                            className={cl('input')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></FastField>
                                        <ErrorMessage
                                            className="field-error max-w-[321px] text-red-500"
                                            component="div"
                                            name="matKhau"
                                        ></ErrorMessage>
                                    </div>
                                    <div className={cl('row-group')}>
                                        <label className={cl('label')} htmlFor="name">
                                            Xác nhận mật khẩu: <RequiredIcon />
                                        </label>
                                        <FastField
                                            name="xacNhanMatKhau"
                                            id="xacNhanMatKhau"
                                            type="password"
                                            component={Input}
                                            value={values.xacNhanMatKhau}
                                            status={
                                                errors?.xacNhanMatKhau && touched?.xacNhanMatKhau ? 'error' : ''
                                            }
                                            className={cl('input')}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></FastField>
                                        <ErrorMessage
                                            className="field-error max-w-[321px] text-red-500"
                                            component="div"
                                            name="xacNhanMatKhau"
                                        ></ErrorMessage>
                                    </div>
                                    {message ? (
                                        <div
                                            className="error-msg"
                                            role="alert"
                                            style={{ color: 'red', fontSize: 14, marginBottom: '10px' }}
                                        >
                                            {message}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <div className={cl('footer')}>
                                        <Button
                                            type="primary"
                                            onClick={handleSubmit}
                                            htmlType="submit"
                                            style={{ backgroundColor: "#ffba22", width: "200px" }}
                                        >
                                            Đăng ký
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div> : <ActiveAccount email={values.email} />
                        }
                    </div>
                )}
            </Formik>
        </>
    )
}

export default Register
