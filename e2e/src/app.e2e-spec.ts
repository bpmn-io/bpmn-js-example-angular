import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should render a djs container in the #modeler div', () => {
    page.navigateToRoot();
    expect(page.getPageElts().djsContainer.isPresent()).toBeTruthy();
  });
});
