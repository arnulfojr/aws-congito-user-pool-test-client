/// <reference types='codeceptjs' />
type steps_file = typeof import('../actors/CustomActor.js');
type LogInPage = typeof import('../pages/LogIn.js');

declare namespace CodeceptJS {
  interface SupportObject { I: CodeceptJS.I, LogInPage: LogInPage }
  interface CallbackOrder { [0]: CodeceptJS.I; [1]: LogInPage }
  interface Methods extends CodeceptJS.Puppeteer {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
