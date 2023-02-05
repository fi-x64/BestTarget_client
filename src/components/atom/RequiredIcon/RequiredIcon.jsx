import React from 'react'
import required from '../../../assets/img/required.png'

import classNames from 'classnames/bind';
import styles from './RequiredIcon.module.scss';
const cl = classNames.bind(styles);

function RequiredIcon() {
  return (
    <div className={cl('wrapper')}>
      <img className={cl('icon')} src={required} alt="required" />
    </div>
  )
}

export default RequiredIcon
