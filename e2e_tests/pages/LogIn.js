const { I } = inject();

class LogIn {
  constructor() {
    this.AppContainer = "#app";
    this.PageTitleField = ".hello > h1";
    this.PageTitle = "Welcome to Your Vue.js App";

    this.UserNameField = "input[type='email']";
    this.PasswordField = "input[type='password']";
    this.NewPasswordField = "input[name='new-password']";
    this.NameField = "input[name='name']";

    this.LogInButton = "button[type='button']";
    this.ChangePasswordButton = "button[name='change-password']";
  }

  fillsForm(username, password) {
    within(this.AppContainer, () => {
      I.fillField(this.UserNameField, username);
      I.fillField(this.PasswordField, password);
    });
  }

  fillsNewPassword(password) {
    I.fillField(this.NewPasswordField, password);
  }

  doLogIn(username, password) {
    this.fillsForm(username, password);
    I.click(this.LogInButton);
  }

  fillsFirstPasswordResetForm({ username, password, newPassword }) {
    this.doLogIn(username, password);
    I.waitForResponse((request) => request.url().includes("cognito"));
    I.retry(3).waitForElement(this.NewPasswordField);
    I.seeElement(this.NewPasswordField);
    this.fillsNewPassword(newPassword);
  }

  submitPasswordResetForm() {
    I.click(this.ChangePasswordButton);
  }
}

module.exports = new LogIn();
