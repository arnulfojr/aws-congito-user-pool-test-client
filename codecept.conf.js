const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./e2e_tests/*_test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http://localhost:8080",
      show: !false,
      windowSize: "1200x900",
    },
    ResembleHelper: {
      require: "codeceptjs-resemblehelper",
      baseFolder: "./e2e_tests/screenshots/base",
      diffFolder: "./e2e_tests/screenshots/diff",
    },
  },
  include: {
    I: "./e2e_tests/actors/CustomActor.js",
    LogInPage: "./e2e_tests/pages/LogIn.js",
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      reportDir: "./output",
    },
  },
  name: "aws-congito-user-pool-test-client",
  plugins: {
    retryFailedStep: {
      enabled: false,
    },
    autoDelay: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
    allure: {
      enabled: true,
      enableScreenshotDiffPlugin: true,
    },
  },
};
