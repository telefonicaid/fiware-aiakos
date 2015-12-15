# -*- coding: utf-8 -*-

# Copyright 2015 Telefónica Investigación y Desarrollo, S.A.U
#
# This file is part of FIWARE project.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
#
# You may obtain a copy of the License at:
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
# See the License for the specific language governing permissions and
# limitations under the License.
#
# For those usages not covered by the Apache version 2.0 License please
# contact with opensource@tid.es

import behave
from qautils.logger.logger_utils import get_logger
import qautils.configuration.configuration_utils as configuration_manager
from commons.constants import PROPERTIES_CONFIG_AIAKOS, PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH
from qautils.configuration.configuration_properties import PROPERTIES_CONFIG_SERVICE_PROTOCOL, \
    PROPERTIES_CONFIG_SERVICE_HOST, PROPERTIES_CONFIG_SERVICE_PORT, PROPERTIES_CONFIG_SERVICE_RESOURCE, \
    PROPERTIES_CONFIG_SERVICE_HOST_USER, PROPERTIES_CONFIG_SERVICE_HOST_PKEY
from aiakos_client.client import AiakosApiClient
from qautils.remote.fabric_utils import FabricUtils


__author__ = "@jframos"
__copyright__ = "Copyright 2015"
__license__ = " Apache License, Version 2.0"

__logger__ = get_logger("behave_environment")

# Use regular expressions for step param definition (Behave).
behave.use_step_matcher("re")


def before_all(context):
    """
    HOOK: To be executed before all.
        - Load project properties
        - Init Aiakos API Client
    """

    __logger__.info("Setting UP execution")

    # Load project properties.
    # The loaded properties will be available in 'configuration_manager.config' variable.
    __logger__.info("Loading project properties")
    configuration_manager.set_up_project()
    config = configuration_manager.config

    # Init Aiakos Client
    context.aiakos_client = \
        AiakosApiClient(protocol=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_PROTOCOL],
                        host=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_HOST],
                        port=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_PORT],
                        base_resource=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_RESOURCE])

    # Init remote-command client
    context.remote_executor = \
        FabricUtils(host_name=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_HOST],
                    host_username=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_HOST_USER],
                    host_ssh_key=config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_HOST_PKEY])


def before_scenario(context, scenario):
    """
    HOOK: To be executed before each Scenario.
        - Init context.created_keyfiles list
        - Set default headers (Aiakos API Client)
    """

    __logger__.info("Starting execution of scenario")
    __logger__.info("##############################")
    __logger__.info("##############################")

    context.created_keyfiles_list = list()

    # Restore default header (representations headers) for Aiakos API Client requests.
    context.aiakos_client.update_representation_headers(content_type='text/plain',
                                                        accept='text/plain')


def after_scenario(context, scenario):
    """
    HOOK: To be executed after each Scenario.
        - Remove generated key files.
    """

    __logger__.info("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    __logger__.info("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    __logger__.info("Tearing down execution of scenario")

    aiakos_keyfile_path = \
        configuration_manager.config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH]

    __logger__.debug("Removing created keyfiles '%s' from '%s'", context.created_keyfiles_list, aiakos_keyfile_path)
    for keyfile in context.created_keyfiles_list:
        __logger__.debug("Removing remote keyfile '%s/%s'", aiakos_keyfile_path, keyfile)
        context.remote_executor.execute_command('rm -f {}/{}'.format(aiakos_keyfile_path, keyfile))


def after_all(context):
    """
    HOOK: To be executed after all.
    """

    __logger__.info("Tearing down execution")
