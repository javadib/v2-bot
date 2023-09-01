#!/usr/bin/env bash

#nginx
# shellcheck disable=SC2016
echo '[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1' >> /etc/yum.repos.d/nginx.repo

yum install -y nginx

systemctl start nginx
systemctl enable nginx


setsebool -P httpd_can_network_connect 1

#certbot
#yum install certbot-nginx
#firewall-cmd --add-service=http
#firewall-cmd --add-service=https
#firewall-cmd --runtime-to-permanent

iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT

setsebool -P httpd_can_network_connect 1

#Enable basic auth
yum install -y httpd-tools

htpasswd -c /etc/nginx/.htpasswd nginx

systemctl reload nginx
