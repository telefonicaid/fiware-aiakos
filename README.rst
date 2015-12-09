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
found in the :file:`Generating support keys <doc/README.rst>`.

Top_


API Overview
============

To show the help of service, you can use the operation::

    GET /    (text/html)

To query the keys, you should use the next operations::

    GET /v1/support/<region_name>/sshkey  (text/plain)
    
    GET /v1/support/<region_name>/gpgkey  (text/plain)
    
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

You can use this  :file:`Dockerfile` to launch/execute the Docker image and container::

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
