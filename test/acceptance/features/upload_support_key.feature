# -*- coding: utf-8 -*-

Feature: Upload Support keys to Aiakos Web Service: SSH and GPG Keys.

  As FIWARE admin user
  I want to upload SSH and GPG public keys of my region to Aiakos
  So that they can be managed by this web service to be used as part of the Support account in my deployed VMs.

  FIWARE Aiakos API operations:
    POST /support  (text/plain)


  Scenario: Upload SSH key for a valid region without keys uploaded yet.
    Given the web server running properly
    When  I upload the SSH key for the node "qaregion2"
    Then  I receive a HTTP "201" OK response
    And   the response contains the expected SSH key with the content for "qaregion2"
    And   the file with the SSH key is stored in the server with the expected content

  Scenario: Upload GPG key for a valid region without keys uploaded yet.
    Given the web server running properly
    When  I upload the GPG key for the node "qaregion2"
    Then  I receive a HTTP "201" OK response
    And   the response contains the expected GPG key with the content for "qaregion2"
    And   the file with the GPG key is stored in the server with the expected content

  Scenario Outline: Upload GPG key for a valid region without keys already uploaded.
    Given the web server running properly
    And   already uploaded <key_type> key for the node "qaregion2"
    When  I upload the <key_type> key for the node "qaregion2" with the content of the key "qaregion2b"
    Then  I receive a HTTP "201" OK response
    And   the response contains the expected <key_type> key with the content for "qaregion2b"
    And   the file with the <key_type> key is stored in the server with the content of the key "qaregion2b"

    Examples:
          | key_type |
          | SSH      |
          | GPG      |

  Scenario Outline: Upload GPG key for a valid region using invalid keys (without ssh-rsa/gpg headers)
    Given the web server running properly
    When  I upload the <key_type> key for the node "qaregion2" with the content of the key "malformed"
    Then  I receive a HTTP "400" BAD REQUEST response
    And   the file with the <key_type> key is not stored in the server

    Examples:
          | key_type |
          | SSH      |
          | GPG      |

  @skip @bug @CLAUDIA-5830
  Scenario Outline: Upload key for a valid region with already uploaded keys and valid representations header.
    Given the web server running properly
    And   the following representation headers are set:
           | accept     | content-type   |
           | <accept>   | <content-type> |
    When  I upload the SSH key for the node "qaregion2"
    Then  I receive a HTTP "201" NOT ACCEPTABLE response

    Examples:
           | accept     | content-type |
           | text/plain | text/plain   |
           |            | text/plain   |
           | text/plain |              |
           |            |              |

  @skip @bug @CLAUDIA-5830
  Scenario Outline: Upload key for a valid region with invalid 'accept' header.
    Given the web server running properly
    And   the following representation headers are set:
           | accept     | content-type   |
           | <accept>   | text/plain     |
    When  I upload the SSH key for the node "qaregion2"
    Then  I receive a HTTP "406" NOT ACCEPTABLE response

    Examples:
           | accept           |
           | lalala           |
           | application/json |
           | text             |


  Scenario Outline: Upload key for a valid region with invalid invalid 'content-type' header.
    Given the web server running properly
    And   the following representation headers are set:
           | accept     | content-type   |
           | text/plain | <content-type> |
    When  I upload the SSH key for the node "qaregion2"
    Then  I receive a HTTP "415" UNSUPPORTED MEDIA TYPE response

    Examples:
           | content-type     |
           | lalala           |
           | text             |
           | application      |

  @skip @bug @CLAUDIA-5831
  Scenario Outline: Method not allowed is retrieved for unsupported HTTP operations to 'support' resource.
    Given the web server running properly
    When  I execute a "<http_verb>" request to support resource for the node "qaregion2"
    Then  I receive a HTTP "405" METHOD NOT ALLOWED response

    Examples:
          | http_verb |
          | get       |
          | post      |
          | put       |
          | delete    |
