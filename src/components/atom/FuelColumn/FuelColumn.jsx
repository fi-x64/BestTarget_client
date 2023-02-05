import React from 'react'

import classNames from 'classnames/bind'
import styles from './FuelColumn.module.scss'
const cl = classNames.bind(styles)

function camelToWord(camelText) {
  const text = camelText
  const result = text.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
}

function FuelColumn({ data, index = 0 }) {
  return (
    <div className={cl('wrapper')}>
      <div className={cl('index')}>#{index}</div>
      {Object.keys(data).map((k) => (
        <div key={k} className={cl('group')}>
          <div className={cl('label')}>{camelToWord(k)}:</div>
          <div className={cl('value')}>{data[k]}</div>
        </div>
      ))}
    </div>
  )
}

export default FuelColumn
