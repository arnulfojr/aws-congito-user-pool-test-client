const { expect } = require("chai");
const faker = require("faker");

Feature("Simple LogIn Behaviour");

Scenario("I land at root and get LogIn form", (I, LogInPage) => {
  I.amOnPage("/");
  I.see(LogInPage.PageTitle, LogInPage.PageTitleField);
});

Scenario("I should always get back to /", async (I, LogInPage) => {
  I.amOnPage("/test");
  I.see(LogInPage.PageTitle);
  const currentUrl = await I.grabCurrentUrl();
  expect(currentUrl)
    .to.be.a("string")
    .that.matches(/\/$/)
    .and.that.does.not.include("/test");
});

Scenario("I should see a logIn form", (I, LogInPage) => {
  I.amOnPage("/");
  I.seeElement(LogInPage.UserNameField);
  I.seeElement(LogInPage.PasswordField);
  I.see("LogIn", LogInPage.LogInButton);
});

Scenario("I try to login without any information", (I, LogInPage) => {
  I.amOnPage("/");
  I.fillField(LogInPage.UserNameField, "");
  I.fillField(LogInPage.PasswordField, "");
  I.click(LogInPage.LogInButton);
  I.seeInPopup(
    "The username should either be a string or one of the sign in types"
  );
});

Scenario(
  "I try to login without any information but using PageObject",
  async (I, LogInPage) => {
    I.amOnPage("/");
    I.see(LogInPage.PageTitle, LogInPage.PageTitleField);

    LogInPage.fillsForm("", "");

    const usernameInForm = await I.grabTextFrom(LogInPage.UserNameField);
    expect(usernameInForm)
      .to.be.a("string")
      .that.equals("");

    const passwordInForm = await I.grabTextFrom(LogInPage.PasswordField);
    expect(passwordInForm)
      .to.be.a("string")
      .that.equals("");

    I.click(LogInPage.LogInButton);
    I.seeInPopup(
      "The username should either be a string or one of the sign in types"
    );
  }
);

Scenario("I try to login with an invalid account", async (I, LogInPage) => {
  I.amOnPage("/");
  LogInPage.doLogIn(faker.internet.email(), faker.internet.password());
  I.waitForResponse((req) => req.url().includes("cognito"));
  I.retry({ retries: 2, maxTimeout: 1000 }).seeInPopup("User does not exist");
});
