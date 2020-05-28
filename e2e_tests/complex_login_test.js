const faker = require("faker");

Feature("Complex LogIn");

let password;
let username;

BeforeSuite(async (I) => {
  password = `${faker.internet.password(15)}a1!`;
  username = faker.internet.email(); // TODO: maybe control the email better?
  await I.createUserWith({
    phoneNumber: "", // TODO: is it needed?
    username,
    password,
  });
});

Before((I) => {
  I.amOnPage("/");
});

Scenario("I entered wrong password", (I, LogInPage) => {
  LogInPage.fillsForm(username, `${password}adsfasdf`);
  I.amAcceptingPopups();
  I.click(LogInPage.LogInButton);
  I.waitForResponse((request) => request.url().includes("cognito"));

  I.retry({ retries: 2, maxTimeout: 1000 }).seeInPopup(
    "Incorrect username or password"
  );
});

Scenario("I'm asked to reset my password", (I, LogInPage) => {
  I.dontSeeElement(LogInPage.NewPasswordField);
  I.dontSeeElement(LogInPage.NameField);

  LogInPage.fillsForm(username, password);
  I.click(LogInPage.LogInButton);

  I.retry({ retries: 3, maxTimeout: 1000 }).waitForElement(
    LogInPage.NewPasswordField
  );

  I.seeElement(LogInPage.NewPasswordField);
  I.seeElement(LogInPage.NameField);
}).tag("@realUser");

Scenario("I reset my password", (I, LogInPage) => {
  LogInPage.doLogIn(username, password);

  I.retry({ retries: 3, maxTimeout: 1000 }).waitForElement(
    LogInPage.NewPasswordField
  );
  I.seeElement(LogInPage.NewPasswordField);

  const newPassword = `${faker.internet.password(16)}2!`;
  LogInPage.fillsNewPassword(newPassword);

  I.click(LogInPage.ChangePasswordButton);
});

AfterSuite(async (I) => {
  await I.deleteUser({ username });
});
