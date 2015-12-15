=========================================
FIWARE | AIAKOS | Acceptance test project
=========================================

This page describes the DSL implemented for building features. All available steps can be used as part of following
test elements:

- Given
- When
- Then
- And
- But

Although all steps can be used as part of any group above, in next sections we have grouped them by the typical test
element you are going to use with them.

Given clauses
-------------

::

    >> the web server running properly
    >> already uploaded (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"

When clauses
------------

::

    >> I request the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"
    >> I execute a "(?P<http_verb>get|post|put|delete)" request to (?P<key_type>SSH|GPG) key resource for node "(?P<region_name>\w*)"
    >> I execute a "(?P<http_verb>get|post|put|delete)" request to support/"(?P<region_name>\w*)" resource
    >> I upload the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"
    >> I upload the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)"
    >> I upload the (?P<key_type>SSH|GPG) key for the node "(?P<region_name>\w*)" with the content of the key "(?P<key_node>\w*)"
    >> I execute a "(?P<http_verb>get|post|put|delete)" request to support resource for the node "(?P<region_name>\w*)"
    >> I receive a HTTP "(?P<status>\w*)" .*

Then clauses
------------

::

    >> the response contains the expected (?P<key_type>SSH|GPG) key with the content for "(?P<key_node>\w*)"
    >> the accept header is set to "(?P<accept_header>[\w/]*)" representation
    >> the following representation headers are set
    >> the file with the (?P<key_type>SSH|GPG) key is stored in the server with the expected content
    >> the file with the (?P<key_type>SSH|GPG) key is stored in the server with the content of the key "(?P<key_node_content>\w*)"
    >> the file with the (?P<key_type>SSH|GPG) key is not stored in the server
