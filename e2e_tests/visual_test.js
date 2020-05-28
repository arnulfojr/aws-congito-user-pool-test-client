const faker = require("faker");

Feature("design");

let password;
let username;

BeforeSuite(async (I) => {
  password = `${faker.internet.password(15)}1!`;
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

Scenario("The LogIn page should match the design provided", async (I) => {
  await I.saveScreenshot(`LogInPage.png`);
  await I.seeVisualDiff(`LogInPage.png`, {
    tolerance: 2,
    prepareBaseImage: false,
    skipFailure: false,
  });
}).tag("@design");

Scenario(
  "The reset password should match the design provided",
  async (I, LogInPage) => {
    const newPassword = `${faker.internet.password(16)}1!`;
    LogInPage.fillsFirstPasswordResetForm({ username, password, newPassword });

    await I.saveScreenshot(`ResetPassword.png`);
    await I.seeVisualDiff(`ResetPassword.png`, {
      tolerance: 2,
      prepareBaseImage: false,
      skipFailure: false,
    });
  }
);

AfterSuite(async (I) => {
  await I.deleteUser({ username });
});
