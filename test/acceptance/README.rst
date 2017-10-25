.. _Top:

FIWARE | AIAKOS | Acceptance test project
*****************************************

.. contents:: :local:

Introduction
============

This project contains the Aiakos acceptance tests (component, integration and E2E testing).
All test cases have been defined using Gherkin that it is a Business Readable, Domain Specific
Language that lets you describe software’s behaviour without detailing how that behaviour is
implemented. Gherkin has the purpose of serving documentation of test cases.


Test case implementation has been performed using `Python <http://www.python.org/>`_ and the BDD
framework `Behave <http://pythonhosted.org/behave/>`_.

Top_


Acceptance Project Structure
----------------------------
 ::

    ├───acceptance
    │   ├───doc
    │   ├───commons
    │   ├───features
    │   │   ├───steps
    │   │   │   ├───support.py
    │   │   │   │   └───...
    │   │   ├───environment.py
    │   │   ├───get_support_key.feature
    │   │   └───...
    │   ├───resources
    │   ├───conf
    │   │   ├───settings.json
    │   │   └───logging.conf
    │   └───aiakos_client
    │

Top_


FIWARE Aiakos Automation Framework
----------------------------------

Features:

- Behave support.
- Settings using json files.
- Test report using xUnit output and Behave output.
- Assertions using Hamcrest (declaratively define "match" rules).
- Aiakos API Client.
- Logging.
- Remote validations (Aiakos host).

Domain specific language implemented for building features: `Aiakos Acceptance DSL <doc/dsl.rst>`_

Top_


Acceptance test preparation
===========================

Prerequisites
-------------

- Python 2.7 or newer (2.x) (https://www.python.org/downloads/).
- pip (https://pypi.python.org/pypi/pip).
- virtualenv (https://pypi.python.org/pypi/virtualenv).
- Aiakos (https://github.com/telefonicaid/fiware-aiakos).

Top_


Settings
--------

Before executing the acceptance tests, you will need configure the properties file.
To execute acceptance test on the experimentation environment, you will have to
configured the file `config/settings.json` properly:

- You will have to configure API endpoints.
- And the host credentials where Aiakos API is running for remote validations.
  You need a valid private key (*host_key*) to connect to the host by SSH.


Configuration parameters (settings):

- **protocol**: Aiakos API Protocol (HTTP/HTTPS).
- **host**: Aiakos API host and Name of the host (to be used as part as a ssh connection).
- **port**: Aiakos API port.
- **resource**: Aiakos API base resource (e.i: /v1).
- **host_user**: User name of the host.
- **host_password**: Password for the previous user.
- **host_private_key_location**: RSA key for ssh connections instead of previous user/password.
  If protected, _host_password_ should be set with the correct value to decrypt.

Top_

Keys for testing purpose
------------------------

Different 'fake' keys files have been provided. These ones are located in `resources/`:

- malformed.gpgkey
- malformed.sshkey
- qaregion.gpgkey
- qaregion.sshkey
- qaregion2.gpgkey
- qaregion2.sshkey
- qaregion2b.gpgkey
- qaregion2b.sshkey

Top_


Test Cases execution
====================

Execute the following command in the test project root directory:

::

  $> cd $AIAKOS_HOME/tests/acceptance
  $> behave features/ --tags ~@skip

With this command, you will execute:

- Test Cases in the environment configured in `conf/settings.json`.
- all *.features implemented under features folder.
- Skipping all Scenarios tagged with "skip".

For more options, execute *behave --help*.

Top_

Test case execution using virtualenv
------------------------------------
1. Create a virtual environment somewhere ::

    $> virtualenv $WORKON_HOME/venv

#. Activate the virtual environment ::

    $> source $WORKON_HOME/venv/bin/activate

#. Go to `$AIAKOS_HOME/tests/acceptance` folder in the project
#. Install the requirements for the acceptance tests in the virtual environment ::

    $> pip install -r requirements.txt --allow-all-external


Top_

