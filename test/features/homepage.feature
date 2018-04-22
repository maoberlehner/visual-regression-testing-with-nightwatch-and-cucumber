Feature: Homepage

@visual-regression
Scenario: The homepage looks as expected

  Given I view the page on a small screen device
  When I open "http://localhost:8080"
  And I look at the homepage
  Then I expect the homepage to look the same as before
