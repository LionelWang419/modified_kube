/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */
// index.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, has } from 'lodash'
import classnames from 'classnames'
import { Button } from '@kube-design/components'

import Item from './Item'

import styles from './index.scss'

export default class PropertiesInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
    hiddenKeys: PropTypes.arrayOf(PropTypes.string),
    readOnlyKeys: PropTypes.arrayOf(PropTypes.string),
    controlled: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    value: {},
    hiddenKeys: [],
    readOnlyKeys: [],
    controlled: false,
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      existedKey: false,
      propsValue: props.value,
      ...PropertiesInput.getValues(props),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.controlled && this.props.value !== prevProps.value) {
      this.setState({
        propsValue: this.props.value,
        ...PropertiesInput.getValues(this.props),
      })
    }
  }

  static getValues(props) {
    const propsValue = props.value || {}
    const hiddenValues = []
    const readOnlyValues = []
    const arrayValues = []

    // 首先添加六个固定行，确保它们始终存在
    const fixedKeys = [
      { key: 'vkernel.cpu_profile', type: 'cpu', displayKey: t('CPU_SCHE') },
      { key: 'vkernel.memory_profile', type: 'mem', displayKey: t('MEMORY_THP') },
      { key: 'vkernel.syscall_profile', type: 'syscall', displayKey: t('SYSCALL') },
      { key: 'vkernel.file_profile', type: 'file', displayKey: t('FILE_RULE') },
      { key: 'vkernel.sysctl_profile', type: 'sysctl', displayKey: t('SYS_CONTROL') },
      //{ key: 'vkernel_permission', type: 'perm', displayKey: t('KERNEL_PERMISSION') }
    ]

    // 添加固定行，并从 propsValue 中获取它们的值
    fixedKeys.forEach(({ key, type, displayKey }) => {
      arrayValues.push({
        key,
        value: propsValue[key] || '',  // 如果值不存在，使用空字符串
        type,
        isEditable: false,
        displayKey
      })
    })

    // 处理其他非固定行
    Object.keys(propsValue).forEach(key => {
      if (props.hiddenKeys.some(hiddenKey => new RegExp(hiddenKey).test(key))) {
        hiddenValues.push({
          key,
          value: propsValue[key],
        })
      } else if (!fixedKeys.some(fixed => fixed.key === key)) {
        // 只添加不在固定行中的其他键
        arrayValues.push({
          key,
          value: propsValue[key],
          type: 'any',
          isEditable: true,
          isNew: true
        })
      }
    })

    return { hiddenValues, readOnlyValues, arrayValues }
  }

  static getItemType(key) {
    if (key === 'cpu_profile') return 'cpu'
    if (key === 'memory_profile') return 'mem'
    if (key === 'kernel_permission') return 'perm'
    if (key === 'syscall_profile') return 'syscall'
    if (key === 'file_profile') return 'file'
    if (key === 'sysctl_profile') return 'sysctl'
    return 'any'
  }

  handleAdd = () => {
    this.setState(({ arrayValues }) => ({
      arrayValues: [
        ...arrayValues,
        { key: '', value: '', type: 'any', isEditable: true, isNew: true },
      ],
    }))
  }

  triggerChange = arrayValues => {
    const { onChange } = this.props
    const { hiddenValues, readOnlyValues } = this.state
    let existedKey = false
    let emptyKeyValue = false

    this.props.onError()

    const valuePairs = [...hiddenValues, ...readOnlyValues, ...arrayValues]
    const value = valuePairs.reduce((prev, cur) => {
      cur.key = cur.key || ''

      // when add new line, do not change value
      if (isEmpty(cur.key) && isEmpty(cur.value)) {
        emptyKeyValue = true
        return prev
      }

      // has duplicate keys
      if (has(prev, cur.key)) {
        existedKey = true
        return prev
      }

      // 对于预定义的六个字段，只有在值不为空时才存储
      if (['vkernel_cpu_profile', 'vkernel_memory_profile', 'vkernel_permission',
           'vkernel_syscall_profile', 'vkernel_file_profile', 'vkernel_sysctl_profile'].includes(cur.key)) {
        if (!isEmpty(cur.value)) {
          return {
            ...prev,
            [cur.key]: cur.value,
          }
        }
        return prev
      }

      // 其他字段正常存储
      return {
        ...prev,
        [cur.key]: cur.value || '',
      }
    }, {})

    this.setState({ arrayValues }, () => {
      if (emptyKeyValue) {
        return
      }

      if (!existedKey) {
        onChange(value)
      }
    })

    // some key is empty, throw error
    const hasEmptyKey = Object.keys(value).some(key => isEmpty(key))

    // has duplicate keys, throw error
    if (hasEmptyKey) {
      this.props.onError({ message: t('EMPTY_KEY') })
    } else if (existedKey) {
      this.props.onError({ message: t('DUPLICATE_KEYS') })
    } else {
      this.props.onError()
    }
  }

  handleItemChange = (index, value) => {
    const { arrayValues } = this.state
    const item = arrayValues[index]
    
    if (item.type === 'cpu' || item.type === 'mem' || item.type === 'perm' || 
        item.type === 'syscall' || item.type === 'file' || item.type === 'sysctl') {
      arrayValues[index] = { 
        ...item,
        value: value.value,
      }
    } else {
      arrayValues[index] = { 
        ...value, 
        type: 'any',
        isEditable: true
      }
    }
    
    this.triggerChange(arrayValues)
  }

  handleItemDelete = index => {
    const { arrayValues } = this.state
    this.triggerChange(arrayValues.filter((_, _index) => _index !== index))
  }

  isAddEnable() {
    const { arrayValues } = this.state
    return arrayValues.every(
      item => !(isEmpty(item) || (!item.key && !item.value))
    )
  }

  render() {
    const { className, addText, itemProps } = this.props
    const { readOnlyValues, arrayValues } = this.state

    return (
      <div className={classnames(styles.wrapper, className)}>
        {readOnlyValues.map(item => (
          <Item
            key={`readonly-${item.key}`}
            value={item}
            readOnly
            {...itemProps}
          />
        ))}
        <div className={styles.inputRows}>
          {arrayValues.map((item, index) => (
            <div className={styles.inputRow} key={`array-${index}`}>
              <Item
                key={`array-${index}`}
                index={index}
                value={item || {}}
                onChange={this.handleItemChange}
                onDelete={this.handleItemDelete}
                keyProps={{
                  placeholder: item.type === 'any' ? t('KEY') : item.displayKey,
                  readOnly: item.type === 'cpu' || item.type === 'mem' || item.type === 'perm' || 
                            item.type === 'syscall' || item.type === 'file' || item.type === 'sysctl',
                }}
                valueProps={{
                  placeholder: t('VALUE'),
                  readOnly: false,
                }}
                {...itemProps}
              />
            </div>
          ))}
        </div>
        <div className="text-right">
          <Button
            className={styles.add}
            onClick={this.handleAdd}
            disabled={!this.isAddEnable()}
          >
            {addText}
          </Button>
        </div>
      </div>
    )
  }
}
