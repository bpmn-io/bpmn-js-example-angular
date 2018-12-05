import { browser, by, element } from 'protractor';

export class AppPage {
  navigateToRoot() {
    return browser.get('/');
  }
  getPageElts() {
    return {
      djsContainer: element(by.css('app-root #modeler .djs-container'))
    };
  }
}
