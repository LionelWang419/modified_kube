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

import DeploymentDetail from 'projects/containers/Deployments/Detail'
import StatefulSetDetail from 'projects/containers/StatefulSets/Detail'
import DaemonSetDetail from 'projects/containers/DaemonSets/Detail'
import JobDetail from 'projects/containers/Jobs/Detail'
import CronJobDetail from 'projects/containers/CronJobs/Detail'
import ServiceDetail from 'projects/containers/Services/Detail'
import RouteDetail from 'projects/containers/Routes/Detail'
import SecretDetail from 'projects/containers/Secrets/Detail'
import ConfigMapDetail from 'projects/containers/ConfigMaps/Detail'
import SysConfigDetail from 'projects/containers/SysConfigs/Detail'
import FileConfigDetail from 'projects/containers/FileConfigs/Detail'
import CtlConfigDetail from 'projects/containers/CtlConfigs/Detail'
import CpuConfigDetail from 'projects/containers/CpuConfigs/Detail'
import MemConfigDetail from 'projects/containers/MemConfigs/Detail'
import ServiceAccountDetail from 'projects/containers/ServiceAccounts/Detail'
import PodDetail from 'projects/containers/Pods/Detail'
import ContainerDetail from 'projects/containers/Pods/Containers/Detail'
import NetworkPoliciesDetail from 'projects/containers/Network/Policies/Detail'
import Volume from 'projects/containers/Volumes/Detail'
import VolumeSnapshotsDetail from 'projects/containers/VolumeSnapshots/Detail'
import AlertPolicyDetail from 'projects/containers/Alerting/Policies/Detail'
import VolumeSnapshotContent from '../containers/Storage/VolumeSnapshots/SnapshotContent/Detail'
import SnapshotClassesDetail from '../containers/Storage/VolumeSnapshotClasses/Detail'
import PV from '../containers/Storage/PV/detail'
import ProjectLayout from '../layouts/Project'

import NodeDetail from '../containers/Nodes/Detail'
import EdgeNodeDetail from '../containers/EdgeNodes/Detail'

import ProjectDetail from '../containers/Projects/Detail'
import StorageClassDetail from '../containers/Storage/StorageClasses/Detail'

import ComponentDetail from '../containers/ServiceComponents/Detail'
import CustomResourceDetail from '../containers/CustomResources/Detail'
import RoleDetail from '../containers/Roles/Detail'
import LogCollectionDetail from '../containers/LogCollections/Detail'
import IPPoolDetail from '../containers/Network/IPPools/Detail'
import GatewayDetail from '../containers/Gateway/Detail'

const PATH = '/clusters/:cluster'

export default [
  {
    path: `${PATH}/nodes/:node`,
    component: NodeDetail,
  },
  {
    path: `${PATH}/edgenodes/:node`,
    component: EdgeNodeDetail,
  },
  {
    path: `${PATH}/customresources/:name`,
    component: CustomResourceDetail,
  },
  {
    path: `${PATH}/roles/:name`,
    component: RoleDetail,
  },
  {
    path: [`${PATH}/alert-rules/builtin/:name`, `${PATH}/alert-rules/:name`],
    component: AlertPolicyDetail,
  },
  {
    path: `${PATH}/log-collections/:component/:name`,
    component: LogCollectionDetail,
  },
  {
    path: `${PATH}/components/:namespace/:name`,
    component: ComponentDetail,
  },
  {
    path: `${PATH}/gateways/:component/:gatewayName`,
    component: GatewayDetail,
  },
  {
    path: `${PATH}/storageclasses/:name`,
    component: StorageClassDetail,
  },
  {
    path: `${PATH}/ippools/:name`,
    component: IPPoolDetail,
  },
  {
    path: `${PATH}/pv/:name`,
    component: PV,
  },
  {
    path: `${PATH}/volume-snapshot-content/:name`,
    component: VolumeSnapshotContent,
  },
  {
    path: `${PATH}/volume-snapshot-classes/:name`,
    component: SnapshotClassesDetail,
  },
  {
    path: `${PATH}/projects/:namespace`,
    component: ProjectLayout,
    routes: [
      {
        path: `${PATH}/projects/:namespace/deployments/:name`,
        component: DeploymentDetail,
      },
      {
        path: `${PATH}/projects/:namespace/statefulsets/:name`,
        component: StatefulSetDetail,
      },
      {
        path: `${PATH}/projects/:namespace/daemonsets/:name`,
        component: DaemonSetDetail,
      },
      {
        path: `${PATH}/projects/:namespace/jobs/:name`,
        component: JobDetail,
      },
      {
        path: `${PATH}/projects/:namespace/cronjobs/:name`,
        component: CronJobDetail,
      },
      {
        path: `${PATH}/projects/:namespace/services/:name`,
        component: ServiceDetail,
      },
      {
        path: `${PATH}/projects/:namespace/ingresses/:name`,
        component: RouteDetail,
      },
      {
        path: `${PATH}/projects/:namespace/secrets/:name`,
        component: SecretDetail,
      },
      {
        path: `${PATH}/projects/:namespace/configmaps/:name`,
        component: ConfigMapDetail,
      },
      {
        path: `${PATH}/projects/:namespace/sysconfigs/:name`,
        component: SysConfigDetail,
      },
      {
        path: `${PATH}/projects/:namespace/fileconfigs/:name`,
        component: FileConfigDetail,
      },
      {
        path: `${PATH}/projects/:namespace/ctlconfigs/:name`,
        component: CtlConfigDetail,
      },
      {
        path: `${PATH}/projects/:namespace/cpuconfigs/:name`,
        component: CpuConfigDetail,
      },
      {
        path: `${PATH}/projects/:namespace/memconfigs/:name`,
        component: MemConfigDetail,
      },
      {
        path: `${PATH}/projects/:namespace/serviceaccounts/:name`,
        component: ServiceAccountDetail,
      },
      {
        path: `${PATH}/projects/:namespace/pods/:podName/containers/:containerName`,
        component: ContainerDetail,
      },
      {
        path: `${PATH}/projects/:namespace/pods/:podName`,
        component: PodDetail,
      },
      {
        path: `${PATH}/projects/:namespace/volume-snapshots/:name`,
        component: VolumeSnapshotsDetail,
      },
      {
        path: `${PATH}/projects/:namespace/volumes/:name`,
        component: Volume,
      },
      {
        path: `${PATH}/projects/:namespace/networkpolicies/:name`,
        component: NetworkPoliciesDetail,
      },
      {
        path: `${PATH}/projects/:namespace`,
        component: ProjectDetail,
      },
    ],
  },
]
