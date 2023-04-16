import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/avatar.svg'
import { Button, Form, Input, Select } from 'antd';
import { ErrorMessage, FastField, Field, FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import './EditPassword.scss'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon';
import { toast } from 'react-toastify';
import { updateUser } from '../../actions/auth';
import { updatePassword } from '../../services/auth.service';

function EditPassword() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message)

    const dispatch = useDispatch();

    const PasswordSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại!'),
        newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu mới không khớp!')
    })

    const handleSubmit = async (values, setFieldError) => {
        const res = await updatePassword({
            "passwordCurrent": values.currentPassword,
            "password": values.newPassword,
            "passwordConfirm": values.confirmPassword
        });

        if (res.data) {
            toast.success("Cập nhật mật khẩu thành công");
            const newUserInfo = { ...user, token: res.data.token }
            dispatch(updateUser(newUserInfo))
        } else {
            toast.error(res.message);
        }
    }

    return (
        <div className="container bg-[#f4f4f4]">
            <div className="max-w-[936px] bg-[#fff]">
                <h1 className='p-4 font-semibold text-lg'>Cập nhật mật khẩu</h1>
                <hr />
                <h1 className='text-center italic text-red-500'>Đối với tài khoản đăng nhập bằng Google chưa tạo mật khẩu thì nhập ngẫu nhiên ký tự ở mật khẩu hiện tại</h1>
                <div className='flex items-center justify-center'>
                    <Formik
                        initialValues={
                            {
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            }
                        }
                        onSubmit={(values, { setFieldError }) => {
                            handleSubmit(values, setFieldError)
                        }
                        }
                        validationSchema={PasswordSchema}
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
                            <Form className='form-container w-[400px] mt-[15px] ml-[30px]'>
                                <div className='items-center justify-center'>
                                    <div className='[&>div]:mb-5'>
                                        <div>
                                            <label>
                                                Mật khẩu hiện tại: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`currentPassword`}
                                                id={`currentPassword`}
                                                type="password"
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
                                                Mật khẩu mới: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`newPassword`}
                                                id={`newPassword`}
                                                component={Input}
                                                type="password"
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
                                                Xác nhận mật khẩu mới: <RequiredIcon />
                                            </label>
                                            <Field
                                                name={`confirmPassword`}
                                                id={`confirmPassword`}
                                                component={Input}
                                                type="password"
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
                                    </div>
                                    <div>
                                        <Button
                                            onClick={handleSubmit}
                                            htmlType="submit"
                                            type='primary'
                                            className='bg-[#ffba00] mb-5'
                                        >
                                            Lưu thông tin
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div >
    );
};

export default EditPassword