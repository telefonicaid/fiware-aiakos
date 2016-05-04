# How to execute: 
# $ docker build -t fiwareaiakos .
# $ docker run -p 3000:3000 -d fiwareaiakos

FROM centos:7
ADD fiware.repo /etc/yum.repos.d/fiware.repo
RUN yum -y install git nodejs rpm-build initscripts crontabs fiware-aiakos
RUN mkdir /opt/fiware-aiakos; mkdir /var/log/fiware-aiakos
WORKDIR /opt/fiware-aiakos
COPY aiakos.yml /etc/sysconfig/fiware-aiakos.yml
EXPOSE 3000
ENV container=docker
VOLUME VOLUME /run /tmp 
COPY start.sh start.sh
CMD /usr/sbin/init; ./start.sh
