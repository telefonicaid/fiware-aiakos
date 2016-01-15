.. _Top:

FIWARE Aiakos
*************

|Build Status| |Coverage Status|

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
FIWARE Lab. The description of all this process and why we need to do it can be
found in the `Generating support keys`_.

Top_


API Overview
============

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


Running
=======

After install rpm/deb package, and in order to start the service, run::

    $ sudo service fiware-aiakos start
    
And to stop the service, run::

    $ sudo service fiware-aiakos stop


In order to test the service is running, run::

    $ curl http://localhost:3000/v1/support/example/sshkey

Top_

Configuration
-------------

You must to add the key files in the path /opt/fiware-aiakos/lib/public/keys.
The naming must be <region_name>.sshkey and <region_name>.gpgkey

Top_

Unit tests
----------

The ``test`` target is used for running the unit tests in the component::

    $ cd fiware-aiakos
    $ grunt test

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

Top_


License
=======

\(c) 2015 Telefónica I+D, Apache License 2.0

Top_

.. IMAGES

.. |Build Status| image:: https://travis-ci.org/telefonicaid/fiware-aiakos.svg?branch=develop
   :target: https://travis-ci.org/telefonicaid/fiware-aiakos
   :alt: Build Status
.. |Coverage Status| image:: https://img.shields.io/coveralls/telefonicaid/fiware-aiakos/develop.svg
   :target: https://coveralls.io/r/telefonicaid/fiware-aiakos
   :alt: Coverage Status


.. REFERENCES

.. _FIWARE: http://www.fiware.org/
.. _FIWARE Lab: https://www.fiware.org/lab/
.. _`github issues`: https://github.com/telefonicaid/fiware-aiakos/issues
.. _FIWARE Aiakos - Apiary: https://jsapi.apiary.io/apis/fiwareaiakos/reference.html
.. _`Generating support keys`: doc/README.rst
.. _`Dockerfile`: Dockerfile
