import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Login.module.scss'
import classNames from 'classnames/bind'
import { login } from '../../actions/auth'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Form, Input } from 'antd'
import { ErrorMessage, FastField, Formik } from 'formik'
import RequiredIcon from '../../components/atom/RequiredIcon/RequiredIcon'
import ActiveAccount from './ActiveAccount'
import { createOTP } from '../../services/auth.service'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Required'),
  password: Yup.string().required('Vui lòng nhập mật khẩu!'),
})

const cl = classNames.bind(styles)

function Login() {
  const { isLoggedIn, user } = useSelector((state) => state.auth)
  const { message } = useSelector((state) => state.message)
  const [activeAccount, setActiveAccount] = useState(false);
  const [currentEmail, setCurrentEmail] = useState();

  let navigate = useNavigate()
  const ref = useRef();

  const dispatch = useDispatch()

  const handleSubmit = async (values) => {

    dispatch(login(values.email, values.password)).then(() => {
      navigate('/')
      window.location.reload()
    })
  }

  const handleClickActive = async (values) => {
    console.log("Check values: ", values);
    const res = await createOTP(values.email);
    if (res) {
      setCurrentEmail(values.email)
      setActiveAccount(true);
      dispatch({
        type: SET_MESSAGE,
        payload: '',
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
      {!activeAccount ?
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
                <Form onSubmit={handleSubmit} onKeyUp={(event) => handleKeyUp(event, values)}>
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
                        className="field-error text-red-500"
                        component="div"
                        name="email"
                      ></ErrorMessage>
                    </div>
                    <div className={cl('row-group')}>
                      <label className={cl('label')} htmlFor="name">
                        Mật khẩu: <RequiredIcon />
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
                        className="field-error text-red-500"
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
                        {message == 'Tài khoản chưa được kích hoạt' ? <div className='flex'>{message}. <h1 className='underline cursor-pointer' onClick={() => handleClickActive(values)}> Bấm vào đây để tiến hành kích hoạt</h1></div> : message}
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
                        Đăng nhập
                      </Button>
                      <div className='block'>
                        <a href="" className='block text-blue-600'>Bạn quên mật khẩu?</a>
                        <p>Hoặc sử dụng</p>
                        <ul className={cl('login-logo')}>
                          <li><img src="https://static.chotot.com/storage/assets/LOGIN/facebook.svg" id="facebook-login-btn" alt='facebook-logo' /></li>
                          <li><img src="https://static.chotot.com/storage/assets/LOGIN/google.svg" id="google-login-btn" alt='google-logo' /></li>
                        </ul>
                      </div>
                      <p>Chưa có tài khoản? <Link to='/register' className='text-blue-600'>Đăng ký ngay</Link></p>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Formik>
        : <ActiveAccount email={currentEmail} />}
    </>
  )
}

export default Login
