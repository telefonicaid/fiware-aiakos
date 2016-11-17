.. _Top:

FIWARE Aiakos
*************

|License Badge| |Documentation Badge| |Build Status| |Coverage Status|

.. contents:: :local:

Introduction
============

Server with public API to manage ssh/gpg public keys for the support user of each
`FIWARE Lab`_ node.

This project is part of FIWARE_.

Any feedback on this documentation is highly welcome, including bugs, typos
or things you think should be included but are not. You can use
`github issues`_ to provide feedback.


Top_


Overall description
===================

Aiakos is a service developed to store the public keys corresponding to each FIWARE
Lab node in order to secure the access to the virtual machines instantiated in the
FIWARE Lab.

Each region of FIWARE Lab must generate and provided a SSH public key and a GPG
public key. As a remainder,
it is perfectly secure that people have access to public keys. Only the private
keys must remain secret.

Top_

Why a SSH key and a GPG key are needed
======================================

The new base images and all the images based on them, as the migrated GE images,
have a support account. There are two public keys with an important role in the
support account:

- a SSH public key: This is the only method to log in the virtual machine with
  the support account via SSH (the password access is disabled).
- a GPG public key: This key is used to encrypt the password of the support
  account. That password is generated inside the VM and after the encryption
  is printed to the console. The support account password allows to access the
  VM via console, which is useful if the network is down. Besides, the password
  is also needed to get full root privileges after connecting to the support
  account both using console and ssh client due to, for security reasons, sudo is
  configured for asking the password.

Another reason to require the support password and encrypt it is to make easy
enforcing full control and audit of who have admin access to each VM. This is
because the SSH public key is not specific of each VM, but the password yes. There
are alternatives but more complex. For example, do not provide the SSH
private key to the support staff but use an special designed ssh-agent that audit
each access. This document describes the `protocol used by OpenSSH's ssh-agent`_.

Top_


Why each region must use their own public keys
==============================================

The region staff team are responsible of the virtual machines instantiated on their
servers. Therefore each region staff should have the control of who access the virtual
machines for support purposes and set and enforce the corresponding policy. It is
not possible if the public keys are shared among all the regions. Additionally,
it is also extremely insecure and a problem when a region leaves the federation.

Top_


How the keys are injected inside the virtual machines. Limitations
==================================================================

The support account is created by a script invoked at boot time. This script is named
*activate_support_account.py* and it is available at `GlanceSync support scripts`_.
Inside this folder there is also documentation and all the material to create the base
images with the support account.

The script tries to download the userdata file from the metadata server. This is something
that cloudinit also do, but this script can do more attempts because it works in the
background. However, if the metadata server is not accessible (e.g. because the network is
down) the script will finally give up. In this case, it will use a failback, a public SSH
and public GPG keys hardcoded in the images. The failback keys are used also if the user
modify the userdata content and removes the part that provides the keys.

Of course, the private key pairs hardcoded in the images cannot be shared among regions
for the same reasons it is recommended that each region has its own keys. However a
procedure could be activated to request that the support password of a specific virtual
machine is being encrypted using the public GPG key of the region asking for it.

Finally, it must be considered that the support account can be disabled by the user, who
has full control of the virtual machine. For example, the support account can be deleted
or its password changed. Also the script that create the support account can be modified
or deleted. In those cases, the administrator looses the control over the support of the
virtual machine.

Note that the script is run at boot time, but the support account and password only should
be generated in the first boot of the virtual machine. However, the encrypted password must
be printed at each boot, because the console logs are clean when the virtual machine is
rebooted.

It is important to delete the support account before making a snapshot to be used as template
of new images; indeed this is one of the steps than the procedure to create GE images do.
Otherwise all the instantiated VMs will have the same password in the support account. The
script try to detect this checking if the UUID of the virtual machine has changed, but anyway
during a few minutes the password might remain unmodified.

Top_


How to generate and use the keys
================================

Software vs hardware solution
-----------------------------

This document only describes how to generate and use the keys through a software
solution, but it is also possible use a hardware device, as an smartcard.
The use of hardware solution is not documented here because it may be specific of
each product, although some information will be provided AS IS to people
interested in an introduction and some references to start with.

The advantage of a hardware solution is that it provides better security. It
also make possible a full control and audit, because with a hardware solution
the person who uses the key cannot copy it. Most of the advantages of a
hardware solution can be replicated using a dedicated host and an agent: this way
support staff does not have access to the key and the cryptographic operations are
delegated to the agent.

A hardware solution consists of a device that stores the private keys and does not
allow extracting them. Most of these devices generate the keys by themselves
and therefore nobody has a copy of the private key, while others allow storing
an existing key. People do not need to access the private key to use it, because
the operations involving the key (e.g. to sign a challenge) are delegated to the
device.

Some hardware solutions
-----------------------

There is neither an only solution nor standard. Some devices are intended for SSH
keys, other for GPG keys but also support SSH. Neither all devices are supported
in Linux nor provided free/open source drivers.

- An OpenPGP 2.0 card can be used with GPG and also with OpenSSH through the gpg-agent_.
- The `gnuk project`_ allows using some very cheap STM32F103 microcontrollers with a USB
  port (it installs a firmware supporting the OpenPGP 2.0 card specification). This option
  is less secure than and smartcard or a specifically designed USB-token but safer than
  a software solution.
- The `OpenSC projects`_ is about using smartcards and USB-tokens through PKCS#11/PKCS#15
  with Linux. This project does not work with GPG due to GPG does not speak PKCS#11.
  However some devices might work with and old project (probably unmaintained) that do
  a bridge between PCKS#11 and GPG.

A very cheap solution (but not the more secure, most of the other devices are
designed to resists more types of attacks, including analysing the power consume)
is to use gnuk project with some STM32 devices. This software is designed
for GPG keys, but the documentation explains how to use with ssh through an
agent.

These links are provided as reference only. The solutions described, including
the gnuk project commented before, have not been tested and therefore the information
is provided AS IS, without any support.

Generating a SSH key
--------------------

A public key can be generated from different ways, including the generation of
SSH keys from the FIWARE Lab Cloud Portal. For more details about it, we suggest
to follow the indications in the presentation `Setting up your infrastructure using FIWARE Cloud`_
between slides 19 and 23. A simple way to generate a ssh key is just running
this OpenSSH command:

.. code::

  ssh-keygen -N "" -f support_key

The file support_key will contain the private key. The file support_key.pub is the
file that contains the public key and have to be provided in to the Aiakos Service.

Generating a GPG key
--------------------

A gpg key can be generated with the following command:

.. code::

  gpg --gen-key

It is not convenient to run this command in a virtual machine, because it needs
a lot of entropy and the command will stop waiting for more information from
/dev/random.

**It is very important that the name of the key is *Fiware support <region>*.**
If the key name does not start with *Fiware support* it is not detected by the
script that creates the support account.

The public key is exported with this command:

.. code::

  gpg --armor --output public.gpg --export "Fiware support"

The public.gpg is the file that must be provided in the Aiakos service. To decrypt
a message just execute the following command:

.. code::

  gpg -d message_file

Where message_file is the file in which we have found the encrypted text (in our case,
it should be the text in the log file in which we see the encrypted password).

Top_


Obtaining the password of the support account
=============================================

The support account password is generated inside the VM, then encrypted with
the GPG public key and printed to the console. The console logs can be obtained
by the owner of the VM or by an administrator using the command *nova console-log*

The following script (getpassword.sh) can be used to decrypt the password:

.. code::

  #!/bin/bash

  export OS_AUTH_URL=http://130.206.112.3:5000/v2.0

  cat <<EOF > extract.awk
  /-----BEGIN PGP MESSAGE-----/ {cp=1}
  /-----END PGP MESSAGE-----/ {cp=0; msg=msg $0}
  cp==1 {msg=msg $0 "\n"} ; END {print msg}'
  EOF
  nova console-log $1 | awk -f ./extract.awk | gpg -d
  rm extract.awk

Keep in mind that the environment variables:

.. code::

  OS_REGION_NAME
  OS_TENANT_NAME
  OS_USERNAME
  OS_PASSWORD
  OS_AUTH_URL

have to be correctly configured. You can now check that the environment is
correctly loaded, perform:

.. code::
  env | grep OS_

To run the script just write:

.. code::

  $ getpassword.sh <UUID>

or

.. code::

  $ getpassword.sh <virtual machine name>

where the UUID is the UUID of the virtual machine.

Top_

API Overview
============

First of all, for POST request to Aiakos you need to fill x-auth-token header.
The header x-auth-token is mandatory because Aiakos have to validate against infrastructure the permissions to upload a key.
The token should be requested to keystone with a valid admin-<region> user as follows:

::

    curl --request POST \
         --url http://cloud.lab.fi-ware.org:4731/v2.0/tokens \
         --header "Accept: application/json" \
         --header "Content-Type: application/json"
         --data '{"auth":{"tenantName":"admin","passwordCredentials":{"username":"<admin-spain>","password":"zzzzzzzzzzzzz"}}}'

In the json response, token with the value should be in *access.token.id*

To upload new/modified a gpg key to the server. You should send a POST like this:

::

    curl --request POST \
        --url http://aiakoshost/v1/support \
        --header 'accept: text/plain' \
        --header 'content-type: text/plain' \
        --header 'x-auth-token: 201dd9a13de844db905cb4f617cbc17d' \
        --data '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v1\n\nmQENBFWnVCYBCADPeDMbTOkCM4MPbUMvtbAtGbUDnH3AHyZCEZZuyjeExATfT0Au\n-----END PGP PUBLIC KEY BLOCK-----'

The result of this operation is a text/plain response with the generated key:

::

    -----BEGIN PGP PUBLIC KEY BLOCK-----
    Version: GnuPG v1

    mQENBFWnVCYBCADPeDMbTOkCM4MPbUMvtbAtGbUDnH3AHyZCEZZuyjeExATfT0Au
    -----END PGP PUBLIC KEY BLOCK-----


Please have a look at the `API Reference Documentation`_ section below for more description and operations.

API Reference Documentation
---------------------------

- `FIWARE Aiakos v1 (Apiary)`__

__ `FIWARE Aiakos - Apiary`_


Top_


Installation
============

Using FIWARE package repository (recommended)
--------------------------------------------

Refer to the documentation of your Linux distribution to set up the URL of the
repository where FIWARE packages are available (and update cache, if needed).
Currently, ``http://repositories.lab.fiware.org/repo/rpm/x86_64``

Then, use the package tool to install ``fiware-aiakos``::

    $ sudo yum install fiware-aiakos


Configuration file
------------------

Although some options can be specified from the command line, as a general rule
the use of a configuration file is preferable:

- ``/etc/sysconfig/aiakos.yml`` (when running system service)
- ``{installation_path}/config/aiakos.yml`` (when running manually)

Such configuration file is self-documented, so you will find a description of
every configuration option there.

After installing and configuring the service, you can execute the service with the following command::

    $ sudo service fiware-aiakos start

And to stop the service, run::

    $ sudo service fiware-aiakos stop


In order to test the service is running, run::

    $ curl http://localhost:3000/v1/support/example/sshkey

Top_

SSH and PGP keys
----------------

The key files for aiakos are stored in the folder /opt/fiware-aiakos/lib/public/keys.
The naming must be <region_name>.sshkey and <region_name>.gpgkey (lowercase is mandatory)

Top_

Unit tests
----------

The ``test`` target is used for running the unit tests in the component::
First of all, install `grunt tools <http://gruntjs.com/installing-grunt>`_. Previous to it, remove old versions of grunt and grunt-cli.
Install grunt as follow::

   $ npm install
   $ npm install -g grunt-cli

Now, you can run the tests::

    $ cd fiware-aiakos
    $ grunt test

Top_

Acceptance tests
----------------

In order to launch the acceptance test, there is a project developed in python and behave.
Please refer to `component, integration and e2e testing <test/acceptance/README.rst>`_ for more information.

Top_

Build
-----

Use the script provided for generate the package for the OS used::

    $ tools/build/package.sh

Top_

Docker image
------------

You can use this `Dockerfile`_ to launch/execute the Docker image and container::

    $ docker build -t fiwareaiakos .
    $ docker run -p 3000:3000 -d fiwareaiakos

If you want to get more information about the use of docker see `How to use Aiakos with Docker <docker/README.md>`_.

Top_


License
=======

\(c) 2015 Telefónica I+D, Apache License 2.0

Top_

.. IMAGES

.. |Build Status| image:: https://travis-ci.org/telefonicaid/fiware-aiakos.svg?branch=develop
   :target: https://travis-ci.org/telefonicaid/fiware-aiakos
   :alt: Build Status
.. |Coverage Status| image:: https://coveralls.io/repos/github/telefonicaid/fiware-aiakos/badge.svg?branch=develop
   :target: https://coveralls.io/github/telefonicaid/fiware-aiakos?branch=develop
   :alt: Coverage Status
.. |License Badge| image:: https://img.shields.io/badge/license-Apache_2.0-blue.svg
   :target: LICENSE
   :alt: Apache 2.0
.. |Documentation Badge| image:: https://readthedocs.org/projects/fiware-aiakos/badge/?version=latest
   :target: http://fiware-aiakos.readthedocs.org/en/latest/?badge=latest


.. REFERENCES

.. _FIWARE: http://www.fiware.org/
.. _FIWARE Lab: https://www.fiware.org/lab/
.. _`github issues`: https://github.com/telefonicaid/fiware-aiakos/issues
.. _FIWARE Aiakos - Apiary: https://jsapi.apiary.io/apis/fiwareaiakos/reference.html
.. _`Dockerfile`: docker/Dockerfile
.. _protocol used by OpenSSH's ssh-agent: http://api.libssh.org/rfc/PROTOCOL.agent
.. _`GlanceSync support scripts`: https://github.com/telefonicaid/fiware-glancesync/tree/develop/fiwareglancesync/scripts/support
.. _gpg-agent: https://gnupg.org/documentation/manuals/gnupg-2.0/Invoking-GPG_002dAGENT.html
.. _`Setting up your infrastructure using FIWARE Cloud`: http://www.slideshare.net/flopezaguilar/setting-up-your-virtual-infrastructure-using-fi-lab-cloud-32388357
.. _`gnuk project`: http://www.fsij.org/doc-gnuk/intro.html
.. _`OpenSC projects`: https://github.com/OpenSC/OpenSC/wiki/Frequently-Asked-Questions
