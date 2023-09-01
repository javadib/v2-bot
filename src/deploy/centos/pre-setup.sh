#!/usr/bin/bash


#timezone
yum install -y ntp
chkconfig ntpd on
chkconfig --list ntpd
ntpdate be.pool.ntp.org
timedatectl set-timezone Asia/Tehran
ls -l /etc/localtime


yum -y update
yum install -y epel-release
yum groups install "Development Tools"
yum install -y vim git unzip bzip2 htop wget tmux


#nvm & node
curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
source ~/.bashrc
nvm install 18.17.1
nvm use 18.17.1
nvm alias default 18.17.1


#npm
npm i -g pm2
npm i -g yarn
