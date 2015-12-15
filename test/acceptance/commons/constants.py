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


import os

__author__ = "@jframos"
__copyright__ = "Copyright 2015"
__license__ = " Apache License, Version 2.0"


RESOURCES_PATH = os.path.join(os.getcwd(), "resources")

PROPERTIES_CONFIG_AIAKOS = "aiakos"
PROPERTIES_CONFIG_AIAKOS_KEYFILES_PATH = "aiakos_keyfiles_path"

SSHKEY_FILE_PATTERN = "{}.sshkey"
GPGKEY_FILE_PATTERN = "{}.gpgkey"
