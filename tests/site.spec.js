import { test, expect } from '@playwright/test';

test('desktop renders 3D and supports projects and brief downloads', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Different');
  await expect(page.locator('html')).toHaveClass(/webgl-ready/);
  await page.screenshot({ path: '/tmp/mcf-desktop.png', fullPage: false });
  await page.locator('[data-project="0"]').click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('#project-detail')).toContainText('not a commissioned client project');
  await page.getByRole('button', { name: 'Explore a similar idea' }).click();
  await expect(page.locator('#project-dialog')).not.toBeVisible();
  await expect(page.locator('#brief-dialog')).toBeVisible();
  await page.getByLabel('Your name').fill('Test Visitor');
  await page.getByLabel('Email address').fill('visitor@example.com');
  await page.getByLabel('What are you imagining?').fill('An expressive launch film');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my brief' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('mcf-visuals-project-brief.txt');
  await expect(page.getByRole('status')).toContainText('has not been sent');
  await page.keyboard.press('Escape');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.getByText('Visual storytelling', { exact: true }).first().click();
  await expect(page.locator('details').nth(1)).toHaveAttribute('open', '');
  expect(errors).toEqual([]);
});

test('mobile menu, viewport and reduced motion work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.screenshot({ path: '/tmp/mcf-mobile.png' });
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#mobile-menu').getByRole('link', { name: 'Capabilities' }).click();
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
  await expect(page).toHaveURL(/#services/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Start a conversation' }).click();
  await expect(page.locator('#brief-dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(page.locator('#brief-dialog')).not.toBeVisible();
});
