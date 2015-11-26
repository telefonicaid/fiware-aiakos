===============
 FIWARE Aiakos
===============

|Build Status| |Coverage Status|

Server with public API to manage ssh/gpg public keys for the support user of each 
`FIWARE Lab`_ node.

This project is part of FIWARE_.

API Overview
============

To show the help of service, you can use the operation::

    GET /    (text/html)

To query the keys, you should use the next operations::

    GET /v1/support/<region_name>/sshkey  (text/plain)
    
    GET /v1/support/<region_name>/gpgkey  (text/plain)
    

Running
=======

After install rpm/deb package, and in order to start the service, run::

    $ sudo service fiware-aiakos start
    
And to stop the service, run::

    $ sudo service fiware-aiakos stop


In order to test the service is running, run::

    $ curl http://localhost:3000/v1/support/example/sshkey

Configuration
-------------

You must to add the key files in the path /opt/fiware-aiakos/lib/public/keys.
The naming must be <region_name>.sshkey and <region_name>.gpgkey


Unit tests
----------

The ``test`` target is used for running the unit tests in the component::

    $ cd fiware-aiakos
    $ grunt test

Build
-----

Use the script provided for generate the package for the OS used::

    $ tools/build/package.sh


Docker image
------------

You can use this  `Dockerfile <Dockerfile>`_ to launch/execute the Docker image and container::

    $ docker build -t fiwareaiakos .
    $ docker run -p 3000:3000 -d fiwareaiakos

License
=======

\(c) 2015 Telefónica I+D, Apache License 2.0


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
