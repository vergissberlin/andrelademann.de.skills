import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('andrelademann-skills-theme');
  });
});

test('mobile hamburger menu toggles on index page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/andrelademann.de.skills/');

  const toggle = page.locator('#site-nav-toggle');
  const navLinks = page.locator('#site-nav-panel');

  await expect(toggle).toBeVisible();
  await expect(navLinks).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();

  await expect(navLinks).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('index search and filter interactions keep cards visible', async ({ page }) => {
  await page.goto('/andrelademann.de.skills/');

  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-input')).toBeFocused();

  const cards = page.locator('#skills-grid .card');
  await expect(cards.first()).toBeVisible();

  await page.fill('#search-input', 'blog');
  const filteredCountText = await page.locator('#visible-count').textContent();
  expect(Number(filteredCountText ?? '0')).toBeGreaterThan(0);
  await expect(page.locator('#skills-grid .card:visible').first()).toBeVisible();

  await page.getByRole('tab', { name: /all/i }).click();
  await expect(page.locator('#visible-count')).not.toHaveText('0');
});

test('theme toggle applies dark class manually', async ({ page }) => {
  await page.goto('/andrelademann.de.skills/');

  const themeToggle = page.locator('#theme-toggle-button').first();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await themeToggle.click();
    const hasDarkClass = await page.locator('html').evaluate((element) => element.classList.contains('dark'));
    if (hasDarkClass) break;
  }
  await expect(page.locator('html')).toHaveClass(/dark/);

  const savedTheme = await page.evaluate(() => localStorage.getItem('andrelademann-skills-theme'));
  expect(savedTheme === 'dark' || savedTheme === 'system').toBeTruthy();
});

test('system theme follows prefers-color-scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/andrelademann.de.skills/');

  const themeToggle = page.locator('#theme-toggle-button').first();
  await themeToggle.click();
  await themeToggle.click();
  await themeToggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
