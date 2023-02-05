import React from 'react'
import { Spin } from 'antd'
import { Link } from 'react-router-dom'

import classNames from 'classnames/bind'
import styles from './Button.module.scss'
const cl = classNames.bind(styles)

function Button({
  type,
  size,
  to,
  leftIcon,
  htmlType,
  loading,
  disabled,
  onClick,
  children,
  className,
  ...passwdProps
}) {
  let Component = 'button'
  if (to) Component = Link

  return (
    <Component
      type={htmlType || ''}
      className={`${className} ${cl('wrapper', type, size, {
        icon: !!leftIcon,
        loading: loading,
        disabled: disabled,
      })}`}
      to={to}
      onClick={onClick}
      {...passwdProps}
    >
      {loading && <Spin className={cl('spin')} size="small" />}
      {leftIcon}
      {children}
    </Component>
  )
}

export default Button
