# How to execute: 
# $ docker build -t fiwareaiakos .
# $ docker run -p 3000:3000 -d fiwareaiakos

FROM centos
WORKDIR /opt
RUN yum -y install git
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
RUN yum -y install rpm-build
RUN yum -y install initscripts
RUN yum -y install crontabs
ADD . /opt/fiware-aiakos-source
WORKDIR /opt/fiware-aiakos-source
RUN npm install
RUN ./node_modules/.bin/grunt test
RUN ./tools/build/package.sh
RUN mv *.rpm ..
WORKDIR /opt
RUN rpm -i fiware-aiakos-1.1.0-1.noarch.rpm
EXPOSE 3000
CMD service fiware-aiakos start; tail -f /var/log/fiware-aiakos/fiware-aiakos.log
