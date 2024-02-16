import { test, expect } from '@playwright/test';

test.describe('workspace-project App', () => {

  test('should display diagram', async ({ page }) => {

    // when
    await page.goto('/');

    // then
    const element = await page.$('app-root .diagram-container');

    expect(element).not.toBeNull();
  })

});
