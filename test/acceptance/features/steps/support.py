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

from behave import step, then
from hamcrest import assert_that, contains_string, is_, equal_to
import os
from commons.constants import RESOURCES_PATH, SSHKEY_FILE_PATTERN, GPGKEY_FILE_PATTERN, \
    PROPERTIES_CONFIG_AIAKOS, PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH
import qautils.configuration.configuration_utils as configuration_manager
from aiakos_client.support_api_client import AIAKOS_SUPPORT_GPGKEY, AIAKOS_SUPPORT_SSHKEY, \
    AIAKOS_SUPPORT_REGION, AIAKOS_SUPPORT_BASE


__author__ = "Telefonica I+D"
__copyright__ = "Copyright 2015"
__license__ = " Apache License, Version 2.0"


def _get_keyfile_name_helper(key_type, region_name):
    """
    Get the real keyfile name considering the keytype.
    :param key_type (string): Type of the key.
    :param region_name (string): Region name.
    :return (string): Filename considering the key. e.i: 'Spain2.sshkey'
    """
    file_name = region_name.lower()

    if key_type == "SSH":
        file_name = SSHKEY_FILE_PATTERN.format(file_name)
    else:
        file_name = GPGKEY_FILE_PATTERN.format(file_name)

    if region_name.endswith("2"):
        return file_name.replace("2", "")
    else:
        return file_name

def _upload_key_helper(context, key_type, keyfile_name):
    """
    Step HELPER. Upload the kew using Aiakos API Client.
    :param context: Behave context.
    :param key_type (string): Type of the key to be uploaded
    :param keyfile_name (string): File with the key to be uploaded. e.i. 'Spain2.sshkey'
    :return: None
    """
    config = configuration_manager.config
    context.aiakos_client.add_token()
    if key_type == "SSH":
        ssh_key_filepath = os.path.join(RESOURCES_PATH, keyfile_name)
        context.response_body, context.response = \
            context.aiakos_client.support_api_resource().upload_sshkey(ssh_key_filepath)
    else:
        ssh_key_filepath = os.path.join(RESOURCES_PATH, keyfile_name)
        context.response_body, context.response = \
            context.aiakos_client.support_api_resource().upload_gpgkey(ssh_key_filepath)

    context.created_keyfiles_list.append(keyfile_name)


def _key_is_stored_in_the_server_helper(context, keyfile_name, keyfile_content):
    """
    Step HELPER. Check if the given keyfile is stored in the server. Performe assertions.
    :param context: Context
    :param keyfile_name (string): File name with the key to be uploaded. e.i. 'Spain2.sshkey'
    :param keyfile_conent (string): The file with the content (key value) to be checked. e.i 'Spain2b.sshkey'
    :return: None
    """

    aiakos_keyfile_path = \
        configuration_manager.config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH]

    # Assert: Remote file exists
    if aiakos_keyfile_path == "":
        result = True
    else:
        result = context.remote_executor.file_exist(aiakos_keyfile_path, keyfile_name)

    assert_that(result, is_(True),
                "Remote file '{}/{}' does not exist in remote host".format(aiakos_keyfile_path, keyfile_name))

    # Assert: Content of the remote file is the expected one
    ssh_key_filepath = os.path.join(RESOURCES_PATH, keyfile_content)
    with open(ssh_key_filepath, 'r') as file_content:
        if aiakos_keyfile_path == "":
            result = True
        else:
            result = context.remote_executor.content_in_file(aiakos_keyfile_path, keyfile_name, file_content.read())
        assert_that(result, is_(True),
                    "Remote file '{}/{}' does not contains the expected key".format(aiakos_keyfile_path, keyfile_name))


@step(u'the web server running properly')
def server_running_properly(context):
    """
    Step: Prepare server for running and check status.
    """
    pass


@step(u'the web server running properly with a key for "(?P<region_name>\w*)"')
def server_running_properly_with_a_key(context, region_name):
    """
    Step: Prepare server for running with a valid key preloaded.
zMCGfpTLTAMF2L2c
    keyfile_name = _get_keyfile_name_helper('SSH', region_name)
    if keyfile_name not in context.created_keyfiles_list:
        _upload_key_helper(context, 'SSH', keyfile_name)

    keyfile_name = _get_keyfile_name_helper('GPG', region_name)
    if keyfile_name not in context.created_keyfiles_list:
        _upload_key_helper(context, 'GPG', keyfile_name)


@step(u'I request the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"')
def request_key(context, key_type, region_name):
    """
    Step: Get a SSH/GPG Key
    """
    context.region_name = region_name
    if key_type == "SSH":
        context.response_body, context.response = context.aiakos_client.support_api_resource().get_sshkey(region_name)
    else:
        context.response_body, context.response = context.aiakos_client.support_api_resource().get_gpgkey(region_name)


@step(u'I execute a "(?P<http_verb>get|post|put|delete)" request to (?P<key_type>SSH|GPG) '
      u'key resource for node "(?P<region_name>\w*)"')
def execute_request_http_verb_key(context, http_verb, key_type, region_name):
    """
    Step: Get a SSH/GPG Key using a raw client methods to force 'invalid' conditions.
    """
    context.region_name = region_name

    if key_type == "SSH":
        uri = AIAKOS_SUPPORT_SSHKEY
    else:
        uri = AIAKOS_SUPPORT_GPGKEY

    context.response_body, context.response = \
        context.aiakos_client.support_api_resource().raw_request_support(
            uri=uri,
            method=http_verb,
            body=None,
            headers={'accept': 'text/plain', 'content-type': 'text/plain'},
            region_name=region_name)


@step(u'I execute a "(?P<http_verb>get|post|put|delete)" request to support/"(?P<region_name>\w*)" resource')
def execute_request_http_verb_region(context, http_verb, region_name):
    """
    Step: Get a SSH/GPG Key using a raw client methods to force 'invalid' conditions.
    """
    context.region_name = region_name

    context.response_body, context.response = \
        context.aiakos_client.support_api_resource().raw_request_support(
            uri=AIAKOS_SUPPORT_REGION,
            method=http_verb,
            body=None,
            headers={'accept': 'text/plain', 'content-type': 'text/plain'},
            region_name=region_name)


@step(u'already uploaded (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"')
def already_uploaded_key(context, key_type, region_name):
    """
    Step: Upload a new key and check that the operation has been succeeded.
    """
    upload_key(context, key_type, region_name)
    http_status_code(context, "201")
    key_is_the_expected_one(context, key_type, region_name)


@step(u'I upload the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"')
def upload_key(context, key_type, region_name):
    """
    Step: Upload a new key.
    """
    context.region_name = region_name

    keyfile_name = _get_keyfile_name_helper(key_type, region_name)
    _upload_key_helper(context, key_type, keyfile_name)


@step(u'I upload the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)" '
      u'with the content of the key "(?P<key_node>\w*)"')
def upload_key_file(context, key_type, region_name, key_node):
    """
    Step: Upload a new key with the content of the given key_node file.
    """
    context.region_name = region_name

    keyfile_name = _get_keyfile_name_helper(key_type, key_node)
    _upload_key_helper(context, key_type, keyfile_name)


@step(u'I execute a "(?P<http_verb>get|post|put|delete)" request to support resource '
      u'for the node "(?P<region_name>\w*)"')
def execute_request_http_verb_support(context, http_verb, region_name):
    """
    Step: Upload a SSH/GPG Key using a raw client methods to force 'invalid' conditions.
    """

    context.response_body, context.response = \
        context.aiakos_client.support_api_resource().raw_request_support(
            uri=AIAKOS_SUPPORT_BASE,
            method=http_verb,
            body=None,
            headers={'accept': 'text/plain', 'content-type': 'text/plain'},
            region_name=region_name)


@step(u'I receive a HTTP "(?P<status>\w*)" .*')
def http_status_code(context, status):
    """
    Step: Check the HTTP response status.
    """
    assert_that(str(context.response.status_code), is_(equal_to(status)),
                "HTTP response code is not the expected one.")


@step(u'the response contains the expected (?P<key_type>SSH|GPG) key with the content for "(?P<key_node>\w*)"')
def key_is_the_expected_one(context, key_type, key_node):
    """
    Step: Check the response body. The key returned is the expected one.
    """
    keyfile_name = _get_keyfile_name_helper(key_type, key_node)

    ssh_key_filepath = os.path.join(RESOURCES_PATH, keyfile_name)

    with open(ssh_key_filepath, 'r') as file_content:
        assert_that(context.response_body, is_(equal_to(file_content.read())),
                    "The retrieved SSH is not the expected one.")


@step(u'the accept header is set to "(?P<accept_header>[\w/]*)" representation')
def accept_header_is_set(context, accept_header):
    """
    Step: The accept header is set to the given one, to force 'invalid' conditions.
    """
    context.aiakos_client.update_representation_headers(content_type=None, accept=accept_header)


@step(u'the following representation headers are set')
def representatio_header_are_set(context):
    """
    Step: The representations headers are set to the given ones (context.table, to force 'invalid' conditions.
    """
    for row in context.table:
        context.aiakos_client.update_representation_headers(content_type=row['content-type'],
                                                            accept=row['accept'])


@step(u'the file with the (?P<key_type>SSH|GPG) key '
      u'is stored in the server with the expected content')
def the_keyfile_is_stored_in_server(context, key_type):
    """
    Step: Check that the key file is stored in the remote server.
    """
    keyfile_name = _get_keyfile_name_helper(key_type, context.region_name)
    _key_is_stored_in_the_server_helper(context, keyfile_name, keyfile_name)


@step(u'the file with the (?P<key_type>SSH|GPG) key '
      u'is stored in the server with the content of the key "(?P<key_node_content>\w*)"')
def the_keyfile_is_stored_in_server_content(context, key_type, key_node_content):
    """
    Step: Check that the key file is stored in the remote server with the content of file key_node_content
    """
    keyfile_name = _get_keyfile_name_helper(key_type, context.region_name)
    keyfile_name_content = _get_keyfile_name_helper(key_type, key_node_content)
    _key_is_stored_in_the_server_helper(context, keyfile_name, keyfile_name_content)


@step(u'the file with the (?P<key_type>SSH|GPG) key is not stored in the server')
def the_keyfile_is_not_stored_in_server(context, key_type):
    """
    Step: Check that the key file is stored in the remote server with the content of file key_node_content
    """
    keyfile_name = _get_keyfile_name_helper(key_type, context.region_name)
    aiakos_keyfile_path = \
        configuration_manager.config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH]

    # Assert: Remote file DO NOT exist
    result = context.remote_executor.file_exist(aiakos_keyfile_path, keyfile_name)
    assert_that(result, is_(False),
                "Remote file '{}/{}' exists in remote host and it shouldn't".format(aiakos_keyfile_path, keyfile_name))
