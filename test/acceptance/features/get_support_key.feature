# -*- coding: utf-8 -*-

Feature: Retrieve Support keys from Aiakos Web Service: SSH and GPG Keys.

  As FIWARE admin user
  I want to retrieve the public support keys of a given node from a centralized web service
  So that I can use them to configure a Support User access that will be created in each deployed VM.

  FIWARE Aiakos API operations:
    GET /support/sshkey  (text/plain)
    GET /support/gpgkey  (text/plain)


  @bug @CLAUDIA-5829
  Scenario: Get SSH key for a valid region with already uploaded keys.
    Given the web server running properly
    When  I request the SSH key for the node "qaregion"
    Then  I receive a HTTP "200" OK response
    And   the response contains the expected SSH key with the content for "qaregion"

  @bug @CLAUDIA-5829
  Scenario: Get GPG key for a valid region with already uploaded keys.
    Given the web server running properly
    When  I request the GPG key for the node "qaregion"
    Then  I receive a HTTP "200" OK response
    And   the response contains the expected GPG key with the content for "qaregion"

  Scenario Outline: Get key for a not existing region or region without uploaded keys.
    Given the web server running properly
    When  I request the <key_type> key for the node "notexistingregion"
    Then  I receive a HTTP "404" NOT FOUND response

    Examples:
          | key_type |
          | SSH      |
          | GPG      |

  Scenario Outline: Get GPG key for a valid region with already uploaded keys and valid 'accept' header.
    Given the web server running properly
    And   the accept header is set to "<accept_header>" representation
    When  I request the GPG key for the node "qaregion"
    Then  I receive a HTTP "200" NOT ACCEPTABLE response

    Examples:
          | accept_header     |
          | text/plain        |
          |                   |

  @skip @bug @CLAUDIA-5830
  Scenario Outline: Get GPG key for a valid region with already uploaded keys but invalid 'accept' header.
    Given the web server running properly
    And   the accept header is set to "<accept_header>" representation
    When  I request the GPG key for the node "qaregion"
    Then  I receive a HTTP "406" NOT ACCEPTABLE response

    Examples:
          | accept_header     |
          | application/json  |
          | application/xml   |
          | text              |

  @skip @bug @CLAUDIA-5831
  Scenario Outline: Method not allowed is retrieved for unsupported HTTP operations to SSH key resource.
    Given the web server running properly
    When  I execute a "<http_verb>" request to SSH key resource for node "qaregion"
    Then  I receive a HTTP "405" METHOD NOT ALLOWED response

    Examples:
          | http_verb |
          | post      |
          | put       |
          | delete    |

  @skip @bug @CLAUDIA-5831
  Scenario Outline: Method not allowed is retrieved for unsupported HTTP operations to GPG key resource.
    Given the web server running properly
    When  I execute a "<http_verb>" request to GPG key resource for node "qaregion"
    Then  I receive a HTTP "405" METHOD NOT ALLOWED response

    Examples:
          | http_verb |
          | post      |
          | put       |
          | delete    |

  @skip @bug @CLAUDIA-5831
  Scenario Outline: Method not allowed is retrieved for unsupported HTTP operations to GPG key resource.
    Given the web server running properly
    When  I execute a "<http_verb>" request to support/"qaregion" resource
    Then  I receive a HTTP "405" METHOD NOT ALLOWED response

    Examples:
          | http_verb |
          | get       |
          | put       |
          | delete    |
