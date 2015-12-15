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


from aiakos_client.support_api_client import AiakosSupportApiClient
from qautils.http.headers_utils import set_representation_headers


__author__ = "@jframos"
__copyright__ = "Copyright 2015"
__license__ = " Apache License, Version 2.0"

HTTP_REPRESENTATION_HEADER_TEXT = "text/plain"


class AiakosApiClient:

    """
    This class implements a manager for Aiakos API clients.
    """

    def __init__(self, protocol, host, port, base_resource):
        """
        Contructor of the class. Inits API parameters and headers.
        :param protocol (string): Protocol.
        :param host (string): Host.
        :param port (string): Port.
        :param base_resource(string): Base resource.
        :return: None
        """
        self.protocol = protocol
        self.host = host
        self.port = port
        self.base_resource = base_resource

        self.headers = dict()
        set_representation_headers(self.headers,
                                   content_type=HTTP_REPRESENTATION_HEADER_TEXT,
                                   accept=HTTP_REPRESENTATION_HEADER_TEXT)

    def update_representation_headers(self, content_type, accept):
        """
        Update headers with the given representations.
        :param content_type (string): Content-Type header value.
        :param accept (string): Accept header value.
        :return: None
        """
        set_representation_headers(self.headers,
                                   content_type=content_type,
                                   accept=accept)

    def support_api_resource(self):
        """
        Return the Aiakos API Client for the Support API resource.
        :return (AiakosSupportApiClient):  Aiakos Support API Client.
        """
        return AiakosSupportApiClient(self.protocol, self.host, self.port, self.base_resource, self.headers)
