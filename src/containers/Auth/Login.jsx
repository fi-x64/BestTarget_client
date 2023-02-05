import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Login.module.scss'
import classNames from 'classnames/bind'
import { login } from '../../../actions/auth'
import { Navigate, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Please enter password!'),
})

const cl = classNames.bind(styles)

function Login() {
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { message } = useSelector((state) => state.message)

  let navigate = useNavigate()

  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    console.log(values)

    dispatch(login(values.email, values.password)).then(() => {
      navigate('/')
      window.location.reload()
    })
  }

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={(values, { setFieldError }) =>
        handleSubmit(values, setFieldError)
      }
      validationSchema={LoginSchema}
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
            <Form onSubmit={handleSubmit}>
              <h1 className={cl('form-title')}>Đăng nhập vào hệ thống</h1>
              <div className={cl('group')}>
                <div className={cl('row-group')}>
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
                    className="field-error"
                    component="div"
                    name="email"
                  ></ErrorMessage>
                </div>
                <div className={cl('row-group')}>
                  <label className={cl('label')} htmlFor="name">
                    Password: <RequiredIcon />
                  </label>
                  <FastField
                    name="password"
                    id="password"
                    type="password"
                    component={Input}
                    value={values.password}
                    status={
                      errors?.password && touched?.password ? 'error' : ''
                    }
                    className={cl('input')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></FastField>
                  <ErrorMessage
                    className="field-error"
                    component="div"
                    name="password"
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
                <div className={cl('footer')}>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  )
}

export default Login
