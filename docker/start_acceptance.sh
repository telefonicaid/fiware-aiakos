export OS_REGION_NAME=$Region1
export  OS_USERNAME=$ADM_USERNAME
export OS_PASSWORD=$ADM_PASSWORD
export OS_TENANT_NAME=$ADM_TENANT_NAME
export  OS_AUTH_URL=http://$KEYSTONE_IP:5000/v3
export OS_AUTH_URL_V2=http://$KEYSTONE_IP:5000/v2.0/
export OS_PROJECT_DOMAIN_ID=default
export OS_USER_DOMAIN_NAME=Default
export OS_IDENTITY_API_VERSION=3

sed -i -e "s/{KEYSTONE_IP}/${KEYSTONE_IP}/" conf/settings.json
pip install python-openstackclient
openstack user delete  admin-${Region1}
openstack project delete  admin-${Region1}
openstack project create  admin-${Region1}
openstack user create  admin-${Region1} --password  admin-${Region1} --project  admin-${Region1}
openstack role add --user  admin-${Region1} --project  admin-${Region1} admin

openstack user create  admin-${Region1}2 --password  admin-${Region1}2 --project  admin-${Region1}
openstack role add --user  admin-${Region1}2 --project  admin-${Region1} admin


openstack project show admin-${Region1} > project
export TENANT_ID=`grep "| id" project | awk 'NR==1{print $4}'`

sed -i -e "s/{TENANT_ID}/${TENANT_ID}/" conf/settings.json
sed -i -e "s/{ADM_USERNAME}/admin-${Region1}/" conf/settings.json
sed -i -e "s/{ADM_TENANT_NAME}/admin-${Region1}/" conf/settings.json
sed -i -e "s/{ADM_PASSWORD}/admin-${Region1}/" conf/settings.json

sleep 12000
host="fiwareaikos"
ip="`gethostip -d "$host"`"
echo $ip
while ! echo exit | nc $ip 3000; do sleep 10; done
behave features/ --tags ~@skip --junit --junit-directory testreport
