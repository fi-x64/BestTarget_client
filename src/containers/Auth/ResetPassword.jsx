import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ResetPassword.module.scss'
import classNames from 'classnames/bind'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'
import { toast } from 'react-toastify'
import { resetPassword, validateToken } from '../../services/auth.service'

const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Vui lòng nhập mật khẩu mới!'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu mới không khớp!')
})

const cl = classNames.bind(styles)

function ResetPassword() {
    const { isLoggedIn } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [successPage, setSuccessPage] = useState();
    const [resetPasswordForm, setResetPasswordForm] = useState(false);
    const [resetToken, setResetToken] = useState();

    useEffect(() => {
        async function fetchData() {
            const resetTokenData = searchParams.get("resetToken");

            if (resetTokenData) {
                const res = await validateToken(resetTokenData);
                setResetToken(resetTokenData);

                if (res.status === 'success') {
                    setSuccessPage(true);
                } else if (res.status === 'error') {
                    setSuccessPage(false);
                }
            }
        }
        fetchData();
    }, [])

    const handleClickResetPassword = async () => {
        setResetPasswordForm(true);
    }

    const handleSubmit = async (values) => {
        values.token = resetToken;
        const res = await resetPassword(values);

        if (res.status === 'success') {
            navigate('/login')
            window.location.reload()
        } else {
            toast.error(res.message);
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
            {(successPage && !resetPasswordForm) ?
                <>
                    <div className={cl('container')} id="container">
                        <div className={cl('form-container')}>
                            <div className='block'>
                                <div className='text-2xl text-center text-green-500 [&>*]:mb-3'>
                                    <h1 className='font-semibsold'>Xác thực thành công. Nhấn vào nút bên dưới để đặt lại mật khẩu</h1>
                                    <hr />
                                    <i className="fa-regular fa-circle-check text-5xl"></i>
                                </div>
                                <Button className='mr-[50px]' style={{ backgroundColor: "#ffba22", width: "100%" }} onClick={() => handleClickResetPassword()}>Đặt lại mật khẩu</Button>
                            </div>
                        </div>
                    </div>
                </>
                : (!successPage && !resetPasswordForm) ?
                    <div className={cl('container')} id="container">
                        <div className={cl('form-container')}>
                            <div className='text-2xl text-center text-red-600 [&>*]:mb-3'>
                                <h1 className='font-semibsold'>Token không hợp lệ hoặc hết hạn. Vui lòng thử lại</h1>
                                <hr />
                                <i className="fa-regular fa-circle-xmark text-5xl"></i>
                            </div>
                        </div>
                    </div> : resetPasswordForm ?
                        <Formik
                            initialValues={{
                                password: '',
                                confirmPassword: '',
                            }}
                            onSubmit={(values, { setFieldError }) =>
                                handleSubmit(values, setFieldError)
                            }
                            validationSchema={ResetPasswordSchema}
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
                                    <div className={cl('form-container')}>
                                        <Form onSubmit={handleSubmit} onKeyUp={(event) => handleKeyUp(event, values)}>
                                            <h1 className={cl('form-title')}>Đặt lại mật khẩu</h1>
                                            <div className={cl('group')}>
                                                <div className={cl('row-group')}>
                                                    <label className={cl('label')} htmlFor="name">
                                                        Mật khẩu mới: <RequiredIcon />
                                                    </label>
                                                    <FastField
                                                        name="password"
                                                        id="password"
                                                        component={Input}
                                                        type="password"
                                                        value={values.password}
                                                        status={errors?.password && touched?.password ? 'error' : ''}
                                                        className={cl('input')}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    ></FastField>
                                                    <ErrorMessage
                                                        className="field-error text-red-500"
                                                        component="div"
                                                        name="password"
                                                    ></ErrorMessage>
                                                </div>
                                                <div className={cl('row-group')}>
                                                    <label className={cl('label')} htmlFor="name">
                                                        Xác nhận mật khẩu mới: <RequiredIcon />
                                                    </label>
                                                    <FastField
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        type="password"
                                                        component={Input}
                                                        value={values.confirmPassword}
                                                        status={
                                                            errors?.confirmPassword && touched?.confirmPassword ? 'error' : ''
                                                        }
                                                        className={cl('input')}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    ></FastField>
                                                    <ErrorMessage
                                                        className="field-error text-red-500"
                                                        component="div"
                                                        name="confirmPassword"
                                                    ></ErrorMessage>
                                                </div>
                                                <div className={cl('footer')}>
                                                    <Button
                                                        type="primary"
                                                        onClick={handleSubmit}
                                                        htmlType="submit"
                                                        style={{ backgroundColor: "#ffba22", width: "200px" }}
                                                    >
                                                        Đặt mật khẩu
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            )}
                        </Formik>
                        : null}
        </>
    )
}

export default ResetPassword
