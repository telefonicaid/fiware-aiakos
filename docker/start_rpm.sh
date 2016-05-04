tools/build/package.sh
export RPM_FILE=`find  -name "*.rpm"`
uploadPkg.py --os-username=$OS_USERNAME_VALUE --os-password=$OS_PASSWORD_VALUE --os-tenant-name=$OS_TENANT_NAME_VALUE $RPM_FILE
