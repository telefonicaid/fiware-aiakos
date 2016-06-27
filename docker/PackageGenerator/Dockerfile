# How to execute:
# - It is needed to configure some environment variables:
#   $ export BRANCH=develop
# 	$ export OS_USERNAME_VALUE=<OpenStack username>
# 	$ export OS_PASSWORD_VALUE=<OpenStack password>
# 	$ export OS_TENANT_NAME_VALUE=<OpenStack tenant name>
#
# $ docker build -t fiware-aiakos-rpm .
# $ docker run --name fiware-aiakos-rpm fiware-aiakos-rpm

FROM centos
RUN  yum install -y epel-release; yum install -y git python-pip  python-dev rpm-build redhat-rpm-config
RUN pip install http://repositories.lab.fiware.org/repo/files/fiware-repositories-uploadPkg-1.1.0.tar.gz 
RUN git clone https://github.com/telefonicaid/fiware-aiakos -b develop /opt/fiware-aiakos
WORKDIR /opt/fiware-aiakos
COPY start_rpm.sh start.sh
CMD ./start.sh

