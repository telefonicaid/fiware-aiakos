# How to execute: 
# $ docker build -t fiwareaiakos .
# $ docker run -p 3000:3000 -d fiwareaiakos

FROM centos:7
ADD fiware.repo /etc/yum.repos.d/fiware.repo
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -
RUN yum -y install git nodejs rpm-build initscripts crontabs fiware-aiakos
WORKDIR /opt/fiware/fiware-aiakos
RUN npm install
COPY aiakos.yml /etc/sysconfig/fiware-aiakos.yml
EXPOSE 3000
VOLUME /sys/fs/cgroup /run /tmp
ENV container=docke
COPY start.sh start.sh
CMD ./start.sh

