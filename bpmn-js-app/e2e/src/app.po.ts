import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getDiagramContainer() {
    return element(by.css('app-root .diagram-container'));
  }
}
