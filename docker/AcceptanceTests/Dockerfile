# How to execute:
# $ docker build -t fiware-aiakos-acceptance .
# $ docker run --name fiware-aiakos-acceptance fiware-aiakos-acceptance

FROM centos
RUN yum install -y epel-release
RUN yum -y install curl host syslinux nc  gcc libffi-devel  openssl-devel git gcc build-essentials python-devel python-pip 
RUN git clone https://github.com/telefonicaid/fiware-aiakos /opt/fiware-aiakos
WORKDIR /opt/fiware-aiakos/test/acceptance
RUN pip install -r requirements.txt --allow-all-external
RUN pip install behave pycrypto
COPY settings.json ./conf/settings.json
COPY start_acceptance.sh start.sh
CMD ./start.sh
