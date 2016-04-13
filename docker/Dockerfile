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
RUN git clone https://github.com/telefonicaid/fiware-aiakos /opt/fiware-aiakos
WORKDIR /opt/fiware-aiakos
RUN npm install
RUN ./node_modules/.bin/grunt test
RUN ./tools/build/package.sh
COPY aiakos.yml /etc/sysconfig/aiakos.yml
EXPOSE 3000
COPY start.sh start.sh
CMD ./start.sh