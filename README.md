@[TOC](目录)

kubesphere console 本地调试环境搭建

虚拟机配置：

1. **ubuntu22.04**
2. **vmware workstation**

# KubeKey 搭建单节点 k8s

## 搭建

kubekey repo: https://github.com/kubesphere/kubekey

输入以下命令：

```
sudo apt-get update
sudo apt-get install openssh-server
sudo ufw disable
sudo apt-get install openssl
sudo apt-get install socat conntrack ebtables ipset ipvsadm
sudo gedit /etc/resolv.conf
```

在 `resolv.conf` 文件中已有nameserver前面加上三行：

```
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 114.114.114.114
```

保存退出，继续：

```
sudo systemctl restart NetworkManager
sudo apt-get install curl
free -h
sudo swapoff -a
setenforce 0
```

`setenforce 0`应该是会显示找不到命令的，这就说明**selinux**没有安装，这是正确的，继续：

```
export KKZONE=cn
sudo curl -sfL https://get-kk.kubesphere.io | sh -
sudo chmod +x kk
sudo su root
./kk create cluster --with-kubernetes v1.23.10 --with-kubesphere v3.4.0
```

（此处用**v1.23.10**，之前用v1.24.x失败了，原因未知）

输入**yes**，然后到这里就说明成功了：

```
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://x.x.x.x:30880
Account: admin
Password: P@88w0rd
```

可以执行以下命令确认 kubeshpere 的状态：

```bash
kubectl get pods -A
```

显示有 `kubesphere-system` 条目且 `status` 为 `Running` 即可，并且**在同一网段下**可使用 http://IP:30880 访问 KubeSphere Console，此处IP是节点IP，管理员登录帐密为 admin/P@88w0rd。

## 问题

过程中可能出现的问题/情况：

1. 一开始会下载 kubeadm、kubelet、kubectl、helm、kubecni、crictl、etcd、docker、calicoctl，中途小概率可能会连接不畅，表现为没有speed，等个10秒没反应就 `Ctrl+c` 退出重新执行`./kk create cluster --with-kubernetes v1.23.10 --with-kubesphere v3.4.0`，总会下好的
2. 拉取镜像时，从 **registry.cn-beijing.aliyuncs.com/kubesphereio** 地址拉取会比较快，如果运行`./kk create cluster --with-kubernetes v1.23.10 --with-kubesphere v3.4.0`时显示的拉取镜像不是从**registry.cn-beijing.aliyuncs.com/kubesphereio** 地址拉取的，最后会在后面所说的第3步时一直等待120min后超时报错，那就直接使用本仓库上传的kk可执行文件，然后执行`./kk create cluster --with-kubernetes v1.23.10 --with-kubesphere v3.4.0`，会从上述阿里云仓库上传的镜像地址拉取镜像，且速度会快很多 
3. 到 Please wait for the installation to complete 阶段，会有一个动态安装箭头，在这里等待10分钟-30分钟左右为正常情况



# 访问 KubeSphere 的后端服务

参考 https://github.com/kubesphere/console/blob/master/docs/access-backend.md

## 向主机公开 KubeSphere API 服务器

通过节点端口 30881 暴露 ks-apiserver 服务，从而可以通过 `<node_ip>:<30881>` 端口访问 ks-apiserver 服务：

```shell
kubectl -n kubesphere-system patch svc ks-apiserver -p '{"spec":{"type":"NodePort","ports":[{"port":80,"protocal":"TCP","targetPort":9090,"nodePort":30881}]}}'
```

## 在 KubeSphere console 中配置 API 服务器

```shell
git clone git@github.com:kubesphere/console.git # 拉取前端源码，这里使用 tag 3.4.0 版本
```

修改 `config.yaml` 文件的 `url` 和 `wsUrl`，指定本地调试的前端代码连接的后端,换成自己的节点ip地址：

```
  # backend service gateway server
  apiServer:
    clientID: kubesphere
    clientSecret: kubesphere
    url: http://<node_ip>:30881
    wsUrl: ws://<node_ip>:30881
```
同时在和`config.yaml`文件同级目录下新建`local_config.yaml`文件，内容如下：
```
server:
  apiServer:
    url: http://<node_ip>:30881
    wsUrl: ws://<node_ip>:30881
``` 



# 前端二次开发环境搭建

## 环境
- 下载并安装 NVM：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
```
- 验证 NVM 是否安装成功：
```bash
nvm --version
```
- 使用 NVM 安装 Node.js 18
```bash
nvm install 18
nvm use 18
node -v
```
- 安装 `yarn` 并编译
```bash
npm install -g yarn@1.22.4
cd /etc/console
# 推荐换源
yarn config set registry https://registry.npmmirror.com  
npm config set registry https://registry.npmmirror.com
yarn install
yarn && yarn build
# 安装依赖时需要node版本>18，实际运行时需要node版本低于14，在依赖安装完成后build 失败会有node版本报错，需要执行nvm install 14, nvm use 14后再yarn build
```
## 调试

```shell
# 开一个终端，启动前端
yarn dev:client
# 再开一个终端，启动后端
yarn dev:server
```

之后每次修改 console 代码，修改保存后，`http://<后端ip>:8000` 页面就会有实时显示

# 源码编译打包

通过手动复现dockerfile的方式来编译和打包源码。

首先拉取ks-console:v3.4.0镜像，以此为镜像创建两个容器A和B，在容器A中新建/kubesphere目录，将修改好的源码目录下的所有文件复制到/kubesphere目录下，执行以下命令：

```shell
cd /kubesphere
apk add --no-cache --virtual .build-deps ca-certificates python2 python3 py3-pip make openssl g++ bash
npm install yarn@1.22.4
yarn config set registry https://registry.npmmirror.com
npm config set registry https://registry.npmmirror.com
yarn config set "strict-ssl" false -g
yarn && yarn build
```
编译完成后，在容器A中继续执行以下命令：
```shell
mkdir -p /out/server
mv /kubesphere/dist/ /out/
mv /kubesphere/server/locales \
       /kubesphere/server/public \
       /kubesphere/server/views \
       /kubesphere/server/sample \
       /kubesphere/server/config.yaml /out/server/
mv /kubesphere/package.json /out/
```
接下来进入容器B，执行以下命令：
```shell
adduser -D -g kubesphere -u 1002 kubesphere && \
    mkdir -p /opt/kubesphere/console && \
    chown -R kubesphere:kubesphere /opt/kubesphere/console
```
由于不支持容器之间的docker cp操作，所以需要先将容器A中的编译好的文件先docker cp到本地虚拟机中，然后再将本地虚拟机中的文件复制到容器B中，需要执行以下命令：
```shell
docker cp A:/out/. /tmp/A-out/
docker cp /tmp/A-out/ B:/opt/kubesphere/console/
rm -rf /tmp/A-out/  
```
继续在容器B中执行以下命令：
```shell
cd /opt/kubesphere/console
mv dist/server.js server/server.js
```
记住此时之前为了在本地调试修改了config.yaml文件（现在在/opt/kubesphere/console/server/目录下），需要将其复原为：
```shell
  # backend service gateway server
  apiServer:
    clientID: kubesphere
    clientSecret: kubesphere
    url: http://ks-apiserver
    wsUrl: ws://ks-apiserver
```
复原url和wsUrl为上述形式后，就可以开始打包容器B了，执行以下命令：
```shell
docker commit B myimage 
docker save -o myimage.tar myimage
```
现在就完成了源码的编译打包工作。

