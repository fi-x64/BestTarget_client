import { Popconfirm, Tooltip } from 'antd'

import classNames from 'classnames/bind'
import styles from './ActionButton.module.scss'
import { Link } from 'react-router-dom'
const cl = classNames.bind(styles)

function ActionButton({
  type,
  icon,
  to,
  tooltipText,
  onClick,
  showConfirm,
  disabled = false,
  className,
}) {
  let Comp = 'button'
  if (to) Comp = Link
  if (!showConfirm)
    return (
      <Tooltip placement="bottomRight" title={tooltipText}>
        <Comp
          className={`${cl('wrapper', {
            [type]: type,
            disabled,
          })} ${className}`}
          onClick={() => onClick()}
        >
          {icon}
        </Comp>
      </Tooltip>
    )
  return (
    <Popconfirm title="Are you sure?" onConfirm={() => onClick()}>
      <Tooltip placement="bottomRight" title={tooltipText}>
        <Comp
          className={`${cl('wrapper', {
            [type]: type,
            disabled,
          })} ${className}`}
        >
          {icon}
        </Comp>
      </Tooltip>
    </Popconfirm>
  )
}

export default ActionButton
