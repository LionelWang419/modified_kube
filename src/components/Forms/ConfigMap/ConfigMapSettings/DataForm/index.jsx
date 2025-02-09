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

import React from 'react'
import PropTypes from 'prop-types'
import { trim } from 'lodash'
import { Form, Input, TextArea } from '@kube-design/components'
import { ReactComponent as BackIcon } from 'assets/back.svg'

import styles from './index.scss'

export default class SecretDataForm extends React.Component {
  static defaultProps = {
    detail: {},
    selectKey: '',
  }

  static contextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  formRef = React.createRef()

  state = {
    formData: this.getFormData(),
  }

  componentDidMount() {
    this.registerForm()
  }

  registerForm = () => {
    const { registerSubRoute } = this.context
    const { onCancel } = this.props

    registerSubRoute && registerSubRoute(this.handleSubmit, onCancel)
  }

  handleGoBack = () => {
    const { resetSubRoute } = this.context

    resetSubRoute && resetSubRoute()

    this.props.onCancel()
  }

  getFormData() {
    const { detail, selectKey } = this.props

    return {
      key: selectKey || '',
      value: detail[selectKey] || '',
    }
  }

  handleSubmit = callback => {
    const { onOk } = this.props
    const form = this.formRef && this.formRef.current

    form &&
      form.validate(() => {
        const { key, value } = form.getData()
        
        // 定义配置类型映射
        const profileTypes = {
          'cpu.profile': 'cpu_profile',
          'memory.profile': 'memory_profile',
          'file.profile': 'file_profile',
          'syscall.profile': 'syscall_profile',
          'sysctl.profile': 'sysctl_profile'
        }

        // 如果是已知的配置类型
        if (profileTypes[key]) {
          const formTemplate = this.props.formTemplate
          
          // 确保 labels 存在
          if (!formTemplate.metadata.labels) {
            formTemplate.metadata.labels = {}
          }
          
          // 设置对应的 profile 标签为 true
          formTemplate.metadata.labels[profileTypes[key]] = 'true'
        }

        onOk({ [trim(key)]: value })
        callback && callback()
      })
  }

  render() {
    const { detail, selectKey } = this.props

    return (
      <div className={styles.wrapper}>
        <div className="h6">
          <a className="custom-icon" onClick={this.handleGoBack}>
            <BackIcon />
          </a>
          {!detail[selectKey] ? t('ADD_DATA_TCAP') : t('EDIT_DATA_TCAP')}
        </div>
        <div className={styles.formWrapper}>
          <Form data={this.state.formData} ref={this.formRef}>
            <Form.Item
              label={t('DATA_KEY')}
              description={t('CONFIG_FIELD_DESC')}
            >
              <Input name="key" />
            </Form.Item>
            <Form.Item
              label={t('DATA_VALUE')}
              description={t('ENTER_CONFIG_VALUE_DESC')}
            >
              <TextArea maxHeight={430} name="value" rows={4} autoResize />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
