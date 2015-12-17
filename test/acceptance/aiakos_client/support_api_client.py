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


from qautils.http.rest_client_utils import RestClient
from qautils.http.rest_client_utils import API_ROOT_URL_ARG_NAME


__author__ = "@jframos"
__copyright__ = "Copyright 2015"
__license__ = " Apache License, Version 2.0"

AIAKOS_SUPPORT_BASE = "{" + API_ROOT_URL_ARG_NAME + "}/support"
AIAKOS_SUPPORT_REGION = AIAKOS_SUPPORT_BASE + "/{region_name}"
AIAKOS_SUPPORT_SSHKEY = AIAKOS_SUPPORT_BASE + "/{region_name}/sshkey"
AIAKOS_SUPPORT_GPGKEY = AIAKOS_SUPPORT_BASE + "/{region_name}/gpgkey"


class AiakosSupportApiClient(RestClient):

    """
    This class implements the RestClient for the Support resource of the Aiakos API.
    """

    def __init__(self, protocol, host, port, base_resource, headers):
        """
        Init RestClient.
        :param protocol: Protocol.
        :param host: Host.
        :param port: Port.
        :param base_resource: Base resource.
        :param headers: Default headers.
        :return: None
        """
        super(AiakosSupportApiClient, self).__init__(protocol, host, port, base_resource)
        self.headers = headers

    def raw_request_support(self, uri, method, body=None, headers=None, **kwargs):
        """
        Make a raw request with the given parameters.
        :param uri: URI to Aiakos API resource where request will be performed.
        :param method: HTTP Method [get|post|put|delete]
        :param body: Body if it is needed.
        :param headers: Headers, if they are needed.
        :param **kwargs: URL parameters (without url_root) to fill the URI patters by RestClient.
        :return (string, Requests): A tuple with the raw body and the response of the Requests lib.
        """
        response = super(AiakosSupportApiClient, self).launch_request(uri, body, method, headers, **kwargs)
        return response.text, response

    def get_sshkey(self, region_name):
        """
        Get SSH Key of the given region.
        :param region_name (string): Region name
        :return (string, Requests): A tuple with the raw body (key) and the response of the Requests lib.
        """
        response = super(AiakosSupportApiClient, self).get(AIAKOS_SUPPORT_SSHKEY,
                                                           self.headers, region_name=region_name)
        return response.text, response

    def get_gpgkey(self, region_name):
        """
        Get GPG Key of the given region.
        :param region_name (string): Region name
        :return (string, Requests): A tuple with the raw body (key) and the response of the Requests lib.
        """
        response = super(AiakosSupportApiClient, self).get(AIAKOS_SUPPORT_GPGKEY,
                                                           self.headers, region_name=region_name)
        return response.text, response

    def upload_sshkey(self, region_name, key_file_path):
        """
        Upload a new SSH for the given region.
        :param region_name (string): Region name.
        :param key_file_path (string): Absolute path of the local file with the key.
        :return (string, Requests): A tuple with the raw body (key) and the response of the Requests lib.
        """
        with open(key_file_path, 'r') as key_file:
            response = super(AiakosSupportApiClient, self).post(AIAKOS_SUPPORT_BASE,
                                                                key_file.read(), self.headers, region_name=region_name)

        return response.text, response

    def upload_gpgkey(self, region_name, key_file_path):
        """
        Upload a new GPG for the given region.
        :param region_name (string): Region name.
        :param key_file_path (string): Absolute path of the local file with the key.
        :return (string, Requests): A tuple with the raw body (key) and the response of the Requests lib.
        """
        with open(key_file_path, 'r') as key_file:
            response = super(AiakosSupportApiClient, self).post(AIAKOS_SUPPORT_BASE,
                                                                key_file.read(), self.headers, region_name=region_name)

        return response.text, response
