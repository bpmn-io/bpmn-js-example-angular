import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display diagram', () => {
    page.navigateTo();
    expect(page.getDiagramContainer()).toBeTruthy();
  });

});
