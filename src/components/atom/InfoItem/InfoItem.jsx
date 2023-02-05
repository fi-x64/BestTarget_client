import React from 'react'

import classNames from 'classnames/bind'
import styles from './InfoItem.module.scss'
const cl = classNames.bind(styles)

function InfoItem({ icon, text }) {
  return (
    <div className={cl('wrapper')}>
      {icon}
      <div className={cl('text')}>{text}</div>
    </div>
  )
}

export default InfoItem
