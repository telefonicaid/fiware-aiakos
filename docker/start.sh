sed -i -e "s/{ADM_TENANT_NAME}/${ADM_TENANT_NAME}/" /etc/sysconfig/fiware-aiakos.yml
sed -i -e "s/{ADM_PASSWORD}/${ADM_PASSWORD}/" /etc/sysconfig/fiware-aiakos.yml
sed -i -e "s/{KEYSTONE_IP}/${KEYSTONE_IP}/" /etc/sysconfig/fiware-aiakos.yml
sed -i -e "s/{ADM_TENANT_ID}/${ADM_TENANT_ID}/" /etc/sysconfig/fiware-aiakos.yml
sed -i -e "s/{ADM_USERNAME}/${ADM_USERNAME}/" /etc/sysconfig/fiware-aiakos.yml
service fiware-aiakos start
tail -f /var/log/fiware-aiakos/fiware-aiakos.log
