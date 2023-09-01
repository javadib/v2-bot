#!/usr/bin/bash

apt -y update;
apt install -y vim;
apt install -y git;

#java-openJDK
apt install -y java-1.8.0-openjdk
apt install -y java-1.8.0-openjdk-devel



#Docker
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

sudo apt-get update -y
sudo apt-get install ca-certificates curl gnupg -y

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y


#Redis
sudo apt install lsb-release curl gpg -y

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update -y
sudo apt-get install redis -y

sudo systemctl enable redis-server
sudo systemctl start redis-server

#nvm & node
curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
source ~/.bashrc
nvm install 18.17.1
nvm use 18.17.1
nvm alias default 18.17.1

#npm
npm i -g pm2
npm i -g yarn
