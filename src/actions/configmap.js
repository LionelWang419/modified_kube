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

import { get, set } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/Create'
import ConfigMapEditModal from 'projects/components/Modals/ConfigMapEdit'
import { MODULE_KIND_MAP } from 'utils/constants'
import FORM_TEMPLATES from 'utils/form.templates'
import formPersist from 'utils/form.persist'
import FORM_STEPS from 'configs/steps/configmaps'

export default {
  'configmap.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)

              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)

              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'configmap.edit': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          set(data, 'metadata.resourceVersion', detail.resourceVersion)
          if (props.isFederated) {
            set(data, 'apiVersion', store.version)
            set(data, 'kind', 'FederatedConfigMap')
          }
          store.update(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: t('UPDATE_SUCCESSFUL') })
            success && success()
          })
        },
        store,
        detail,
        modal: ConfigMapEditModal,
        ...props,
      })
    },
  },
  'cpuconfig.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          // 检查是否包含 cpu.profile 字段
          const hasCpuProfile = Object.keys(data.data || {}).some(key => 
            key === 'cpu.profile'
          )

          if (!hasCpuProfile) {
            Notify.error({
              content: t('CPU_PROFILE_REQUIRED'),
            })
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)
              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'memconfig.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          // 检查是否包含 memory.profile 字段
          const hasMemoryProfile = Object.keys(data.data || {}).some(key => 
            key === 'memory.profile'
          )

          if (!hasMemoryProfile) {
            Notify.error({
              content: t('MEMORY_PROFILE_REQUIRED'),
            })
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)
              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'fileconfig.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          // 检查是否包含 file.profile 字段
          const hasFileProfile = Object.keys(data.data || {}).some(key => 
            key === 'file.profile'
          )

          if (!hasFileProfile) {
            Notify.error({
              content: t('FILE_PROFILE_REQUIRED'),
            })
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)
              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'ctlconfig.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          // 检查是否包含 sysctl.profile 字段
          const hasCtlProfile = Object.keys(data.data || {}).some(key => 
            key === 'sysctl.profile'
          )

          if (!hasCtlProfile) {
            Notify.error({
              content: t('SYSCTL_PROFILE_REQUIRED'),
            })
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)
              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'sysconfig.create': {
    on({ store, cluster, namespace, module, isFederated, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      if (isFederated) {
        Object.keys(formTemplate).forEach(key => {
          formTemplate[key] = FORM_TEMPLATES.federated({
            data: formTemplate[key],
            clusters: props.projectDetail.clusters.map(item => item.name),
            kind: key,
          })
        })
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          // 检查是否包含 syscall.profile 字段
          const hasSyscallProfile = Object.keys(data.data || {}).some(key => 
            key === 'syscall.profile'
          )

          if (!hasSyscallProfile) {
            Notify.error({
              content: t('SYSCALL_PROFILE_REQUIRED'),
            })
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success(data)
              formPersist.delete(`${module}_create_form`)
            })
        },
        module,
        cluster,
        namespace,
        name: kind,
        isFederated,
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
}
