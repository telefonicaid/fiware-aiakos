# Package installation custom attributes
%define _name fiware-aiakos
%define _fiware_usr fiware
%define _fiware_grp fiware
%define _fiware_dir /opt/fiware
%define _fiware-aiakos_srv fiware-aiakos
%define _fiware-aiakos_usr %{_fiware_usr}
%define _fiware-aiakos_grp %{_fiware_grp}
%define _fiware-aiakos_dir %{_fiware_dir}/%{_fiware-aiakos_srv}
%define _logging_dir /var/log/%{_fiware-aiakos_srv}
%define _forever_dir /var/run/fiware/.forever
%define _node_req_ver %(awk '/"node":/ {split($0,v,/["~=<>]/); print v[6]}' %{_basedir}/package.json)

# Package main attributes (_topdir, _basedir, _version and _release must be given at command line)
Summary: fiware-aiakos
URL: https://github.com/telefonicaid/fiware-aiakos/tree/master/
Name: %{_name}
Version: %{_version}
Release: %{_release}
License: Apache
Group: Applications/Engineering
Vendor: Telefónica I+D
BuildArch: noarch
Requires:
# nodejs dependency handled in 'pre' section (see below)

%description
fiware-aiakos server.

%prep
# Clean build root directory
if [ -d $RPM_BUILD_ROOT ]; then
	rm -rf $RPM_BUILD_ROOT
fi

%clean
rm -rf $RPM_BUILD_ROOT

%install
mkdir -p $RPM_BUILD_ROOT/%{_fiware-aiakos_dir}; set +x
INCLUDE='bin|config|lib|package.json|README.*|.*rc$'
PATTERN='* .npmrc'
FILES=$(cd %{_basedir}; for i in $PATTERN; do echo $i; done | egrep "$INCLUDE")
for I in $FILES; do cp -R %{_basedir}/$I $RPM_BUILD_ROOT/%{_fiware-aiakos_dir}; done
cp -R %{_sourcedir}/* $RPM_BUILD_ROOT
(cd $RPM_BUILD_ROOT; find . -type f -printf "/%%P\n" >> %{_topdir}/MANIFEST)
echo "FILES:"; cat %{_topdir}/MANIFEST

%files -f %{_topdir}/MANIFEST

%pre
# preinst ($1 == 1)
if [ $1 -eq 1 ]; then
	# Function to compare version strings (in `x.y.z' format)
	valid_version() {
		local CUR=$1
		local REQ=$2
		printf "$CUR\n$REQ" \
		| awk '{split($0,v,"."); for (i in v) printf "%%05d ", v[i]; print}' \
		| sort | tail -1 | cat -E | fgrep -q $CUR'$'
	}

	# Function to setup EPEL and/or NodeSource repo (for the latest node.js version)
	setup_nodesource() {
		fmt --width=${COLUMNS:-$(tput cols)} 1>&2 <<-EOF

			ERROR: node.js >=v$NODE_REQ_VERSION is required. Setting up
			repositories to get the latest version ...
		EOF

		# prepare sources list configuration for the next `yum' command
		# (this requires removing the lock to allow access to the repositories configuration)
		find /var/lib/rpm -name "*.lock" -exec rm -f {} \;
		curl -sL https://rpm.nodesource.com/setup | bash - >/dev/null
		if [ $? -eq 0 ]; then fmt --width=${COLUMNS:-$(tput cols)} 1>&2 <<-EOF

			Please run \`sudo yum -y install nodejs' to install/upgrade version
			prior reinstalling this package.

			EOF
		else fmt --width=${COLUMNS:-$(tput cols)} 1>&2 <<-EOF

			Unable to setup repositories. Please install/upgrade node.js manually
			and then reinstall this package.

			EOF
		fi
	}

	NODE_REQ_VERSION=%{_node_req_ver}
	NODE_CUR_VERSION=$(node -pe 'process.versions.node' 2>/dev/null)
	if ! valid_version ${NODE_CUR_VERSION:-0.0.0} $NODE_REQ_VERSION; then
		setup_nodesource
		exit 1
	fi
	exit 0
fi

%post
# postinst ($1 == 1)
if [ $1 -eq 1 ]; then
	# actual values of installation variables
	FIWARE_USR=%{_fiware_usr}
	FIWARE_GRP=%{_fiware_grp}
	FIWARE_DIR=%{_fiware_dir}
	FIWAREAIAKOS_SRV=%{_fiware-aiakos_srv}
	FIWAREAIAKOS_USR=%{_fiware-aiakos_usr}
	FIWAREAIAKOS_GRP=%{_fiware-aiakos_grp}
	FIWAREAIAKOS_DIR=%{_fiware-aiakos_dir}
	LOGGING_DIR=%{_logging_dir}
	FOREVER_DIR=%{_forever_dir}
	STATUS=0

	# create additional directories
	mkdir -p $LOGGING_DIR
	mkdir -p $FOREVER_DIR

	# install npm dependencies
	echo "Installing npm dependencies ..."
	cd $FIWAREAIAKOS_DIR
	npm config set ca=""
	npm install --production || STATUS=1

	# install pip dependencies (in current python env or virtualenv)
	pip install mailman-api==0.2.9

	# check FIWARE user
	if ! getent passwd $FIWARE_USR >/dev/null; then
		groupadd --force $FIWARE_GRP
		useradd --gid $FIWARE_GRP --shell /bin/false \
		        --home-dir /nonexistent --no-create-home \
		        --comment "FIWARE" $FIWARE_USR
	fi

	# check FIWAREAIAKOS user
	if ! getent passwd $ADAPTER_USR >/dev/null; then
		groupadd --force $ADAPTER_GRP
		useradd --gid $ADAPTER_GRP --shell /bin/false \
		        --home-dir /nonexistent --no-create-home \
		        --comment "Fiware Aiakos" $FIWAREAIAKOS_USR
	fi

	# change ownership
	chown -R $FIWARE_USR:$FIWARE_GRP $FIWARE_DIR
	chown -R $FIWARE_USR:$FIWARE_GRP $FOREVER_DIR
	chown -R $FIWAREAIAKOS_USR:$FIWAREAIAKOS_GRP $FIWAREAIAKOS_DIR
	chown -R $FIWAREAIAKOS_USR:$FIWAREAIAKOS_GRP $LOGGING_DIR

	# change file permissions
	chmod -R g+w $FIWAREAIAKOS_DIR
	chmod a+x $FIWAREAIAKOS_DIR/bin/www

	# configure service
	chmod a+x /etc/init.d/$FIWAREAIAKOSD_SRV
	/sbin/chkconfig --add $FIWAREAIAKOS_SRV

	# postinstall message
	if [ $STATUS -eq 0 ]; then fmt --width=${COLUMNS:-$(tput cols)} <<-EOF

		FIWARE AIAKOS successfully installed at $FIWAREAIAKOS_DIR.

		EOF
	else fmt --width=${COLUMNS:-$(tput cols)} 1>&2 <<-EOF

		ERROR: Failed to install dependencies. Please check
		\`npm-debug.log' file for problems and then reinstall package.

		EOF
	fi

	# finalization
	exit $STATUS
fi

%postun
# uninstall ($1 == 0)
if [ $1 -eq 0 ]; then
	# remove installation directory
	rm -rf %{_fiware-aiakos_dir}

	# remove FIWARE parent directory, if empty
	[ -d %{_fiware_dir} ] && rmdir --ignore-fail-on-non-empty %{_fiware_dir}

	# remove FIWARE Forever directory, if empty
	[ -d %{_forever_dir} ] && rmdir --ignore-fail-on-non-empty %{_forever_dir}

	# remove log files
	rm -rf %{_logging_dir}
fi

%changelog
* Tue Dec 01 2015 Telefónica I+D <opensource@tid.es> 1.3.0-1
- TODO

* Mon Oct 26 2015 Telefónica I+D <opensource@tid.es> 1.2.0-1
- Elapsed time of Sanity Checks execution
- Username of region administrators given by configuration
- Fix dependencies
- Add exclusions to sonar configuration
- Add jslint and gjslint support
- Fix documentation

* Thu Sep 28 2015 Telefónica I+D <opensource@tid.es> 1.1.3-1
- Bugfixing

* Tue Sep 08 2015 Telefónica I+D <opensource@tid.es> 1.1.2-1
- Documentation

* Tue Aug 04 2015 Telefónica I+D <opensource@tid.es> 1.1.1-1
- Required libs

* Tue Jun 30 2015 Telefónica I+D <opensource@tid.es> 1.1.0-1
- New css/style
- Add home button

* Thu Jun 03 2015 Telefónica I+D <opensource@tid.es> 1.0.0-2
- Add forever to monitor the execution of the server.

* Fri May 29 2015 Telefónica I+D <opensource@tid.es> 1.0.0-1
- New overview and details pages.
- IdM authentication.
- Mail notifications in subscriptions to status changes.
