import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ForgotPassword.module.scss'
import classNames from 'classnames/bind'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'
import { toast } from 'react-toastify'
import { activeAccount, forgotPassword } from '../../services/auth.service'

const ActiveSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
})

const cl = classNames.bind(styles)

function ForgotPassword({ email }) {
    const { isLoggedIn } = useSelector((state) => state.auth)
    const { message } = useSelector((state) => state.message)
    const navigate = useNavigate();
    const [nextPage, setNextPage] = useState(false);

    const handleSubmit = async (values) => {
        console.log("Check values: ", values);
        const res = await forgotPassword(values.email);
        console.log("Check res: ", res);
        if (res.status === 'success') {
            toast.success('Một email kèm link xác thực vừa được gửi đến email');
            setNextPage(true);
            setCheckSuccess(true);
        } else if (res.status === 'error') {
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
            <div className={cl('container')} id="container">
                <div className={cl('form-container')}>
                    {!nextPage ? <Formik
                        initialValues={{
                            email: '',
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

                            <Form onSubmit={handleSubmit} onKeyUp={(event) => handleKeyUp(event, values)}>
                                <h1 className={cl('form-title')}>Quên mật khẩu</h1>
                                <div className={cl('group')}>
                                    <div className={cl('row-group')}>
                                        <div className={cl('row-group')}>
                                            <label className={cl('label')} htmlFor="name">
                                                Nhập địa chỉ email: <RequiredIcon />
                                            </label>
                                            <FastField
                                                name="email"
                                                id="email"
                                                component={Input}
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
                        )}
                    </Formik> : <div className='text-2xl text-center text-green-600 [&>*]:mb-3'>
                        <h1 className='font-semibsold'>Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn</h1>
                        <hr />
                        <i className="fa-regular fa-circle-check text-5xl"></i>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
