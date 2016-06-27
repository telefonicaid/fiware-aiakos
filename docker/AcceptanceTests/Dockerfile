# How to execute:
# - Define the following export variables:
#
#    $ export BRANCH=develop
#    $ export KEYSTONE_IP=<IP of the keystone instance>
#    $ export ADM_TENANT_ID=<admin tenant id in the OpenStack environment>
#    $ export USER_TENANT_ID=<admin tenant id in the OpenStack environment>
#    $ export ADM_TENANT_NAME=<admin tenant name>
#    $ export USER_TENANT_NAME=<user tenant name>
#    $ export ADM_USERNAME=<admin username>
#    $ export USER_USERNAME=<username>
#    $ export ADM_PASSWORD=<admin password>
#    $ export USER_PASSWORD=<user password>
#    $ export Region1=qaregion
#    $ export OS_USER_DOMAIN_NAME=<OpenStack user domain name>
#    $ export OS_PROJECT_DOMAIN_NAME=<OpenStack project domain name>
#
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
