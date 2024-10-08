@graph-context-menu
# don't change first line of this file - the tag is used for the test scripts to identify the test suite

Feature: Kiali Graph page - Context menu actions

  User opens the Graph page and opens the context menu of graph nodes.

  Background:
    Given user is at administrator perspective
    When user graphs "bookinfo" namespaces

  @bookinfo-app
  Scenario: Actions in context menu for service node with existing traffic routing
    And user opens the context menu of the "productpage" service node
    And user should see no cluster parameter in the url when clicking the "Details" link in the context menu
    And user opens the context menu of the "productpage" service node
    And user should see no cluster parameter in the url when clicking the "Traffic" link in the context menu
    And user opens the context menu of the "productpage" service node
    And user should see no cluster parameter in the url when clicking the "Inbound Metrics" link in the context menu

  @multi-cluster
  Scenario: Actions in context menu for a service node with existing traffic routing
    And user opens the context menu of the "details" service node on the "east" cluster
    And user should see the "east" cluster parameter in the url when clicking the "Details" link in the context menu
    And user opens the context menu of the "details" service node on the "east" cluster
    And user should see the "east" cluster parameter in the url when clicking the "Traffic" link in the context menu
    And user opens the context menu of the "details" service node on the "east" cluster
    And user should see the "east" cluster parameter in the url when clicking the "Inbound Metrics" link in the context menu
    And user opens the context menu of the "details" service node on the "east" cluster
