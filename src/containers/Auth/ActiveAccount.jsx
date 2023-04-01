import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ActiveAccount.module.scss'
import classNames from 'classnames/bind'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'
import { activeAccount } from '../../services/auth.service'
import { toast } from 'react-toastify'

const ActiveSchema = Yup.object().shape({
    otp: Yup.number("Chỉ được nhập chữ số").min(6, "OTP gồm 6 chữ số").required('Vui lòng nhập mã OTP'),
})

const cl = classNames.bind(styles)

function ActiveAccount({ email }) {
    const { isLoggedIn } = useSelector((state) => state.auth)
    const { message } = useSelector((state) => state.message)
    let navigate = useNavigate()
    const ref = useRef();

    const dispatch = useDispatch()

    const handleSubmit = async ({ otp }) => {
        const res = await activeAccount(email, otp);
        if (res.status.status === 'success') {
            toast.success('Xác thực tài khoản thành công, vui lòng đăng nhập với tài khoản vừa tạo')
            navigate('/login');
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
                    otp: '',
                }}
                onSubmit={(values, { setFieldError }) =>
                    handleSubmit(values, setFieldError)
                }
                validationSchema={ActiveSchema}
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
                                <h1 className={cl('form-title')}>Xác thực tài khoản</h1>
                                <p className='max-w-[400px] text-sm m-4'>Một email đã gửi tới bạn kèm một mã otp để kích hoạt tài khoản. Mã OTP có hiệu lực trong vòng 10 phút</p>
                                <div className={cl('group')}>
                                    <div className={cl('row-group')}>
                                        <div className={cl('row-group')}>
                                            <label className={cl('label')} htmlFor="name">
                                                Nhập OTP được gửi đến bạn: <RequiredIcon />
                                            </label>
                                            <FastField
                                                name="otp"
                                                id="otp"
                                                component={Input}
                                                status={errors?.otp && touched?.otp ? 'error' : ''}
                                                className={cl('input')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            ></FastField>
                                            <ErrorMessage
                                                className="field-error max-w-[321px] text-red-500"
                                                component="div"
                                                name="otp"
                                            ></ErrorMessage>
                                        </div>
                                    </div>
                                    {message ? (
                                        <div
                                            className="error-msg"
                                            role="alert"
                                            style={{ color: 'red', fontSize: 14 }}
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
                                            Xác nhận
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    )
}

export default ActiveAccount
