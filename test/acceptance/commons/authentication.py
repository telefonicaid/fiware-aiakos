__author__ = 'henar'

from keystoneclient import session
from keystoneclient.exceptions import ClientException as KeystoneClientException
from keystoneclient.exceptions import ConnectionRefused as KeystoneConnectionRefused
import qautils.configuration.configuration_utils as configuration_manager
from constants import PROPERTIES_CONFIG_AIAKOS
from qautils.configuration.configuration_properties import PROPERTIES_CONFIG_SERVICE_OS_TENANT_ID, \
    PROPERTIES_CONFIG_SERVICE_OS_PASSWORD, PROPERTIES_CONFIG_SERVICE_OS_TENANT_NAME, \
    PROPERTIES_CONFIG_SERVICE_OS_USERNAME, \
    PROPERTIES_CONFIG_SERVICE_OS_DOMAIN_NAME, PROPERTIES_CONFIG_SERVICE_OS_AUTH_URL
from qautils.logger.logger_utils import get_logger

__logger__ = get_logger("authentication")

class Authentication(object):


    # Test region (to be overriden)
    region_name = None
    # Test authentication
    auth_api = 'v2.0'
    auth_url = None
    auth_sess = None
    auth_token = None
    auth_cred = {}



    @classmethod
    def init_auth(cls):
        """
        Init the variables related to authorization, needed to execute tests
        :return: The auth token retrieved
        """
        configuration_manager.set_up_project()
        config = configuration_manager.config

        tenant_id = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_TENANT_ID]
        auth_url = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_AUTH_URL]
        user_name = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_USERNAME]
        password = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_PASSWORD]
        tenant_name = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_TENANT_NAME]
        domain_name = config[PROPERTIES_CONFIG_AIAKOS][PROPERTIES_CONFIG_SERVICE_OS_DOMAIN_NAME]

        cred_kwargs = {
        'auth_url': auth_url,
        'username': user_name,
        'password': password
        }

        # Currently, both v2 and v3 Identity API versions are supported
        if cls.auth_api == 'v2.0':
            cred_kwargs['tenant_name'] = tenant_name
        elif cls.auth_api == 'v3':
            cred_kwargs['user_domain_name'] = domain_name
        else:
            assert False, "Identity API {} ({}) not supported".format(cls.auth_api, auth_url)
        # Instantiate a Password object
        try:
            identity_package = 'keystoneclient.auth.identity.%s' % cls.auth_api.replace('.0', '')
            identity_module = __import__(identity_package, fromlist=['Password'])
            password_class = getattr(identity_module, 'Password')
            __logger__.debug("Authentication with %s", password_class)
            credentials = password_class(**cred_kwargs)
        except (ImportError, AttributeError) as e:
            assert False, "Could not find Identity API {} Password class: {}".format(cls.auth_api, e)
        # Get auth token
        __logger__.debug("Getting auth token for tenant %s...", tenant_id)
        cls.auth_sess = session.Session(auth=credentials)
        try:
            cls.auth_token = cls.auth_sess.get_token()
        except (KeystoneClientException, KeystoneConnectionRefused) as e:
            __logger__.error("No auth token (%s): all tests will be skipped", e.message)
        return cls.auth_token
