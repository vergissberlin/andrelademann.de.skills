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

  await page.fill('#search-input', 'terraform');
  const filteredCountText = await page.locator('#visible-count').textContent();
  expect(Number(filteredCountText ?? '0')).toBeGreaterThan(0);
  await expect(page.locator('#skills-grid .card:visible').first()).toBeVisible();

  await page.getByRole('tab', { name: /all/i }).click();
  await expect(page.locator('#visible-count')).not.toHaveText('0');
});

test('agent-md generator updates preview and copy button works', async ({ page }) => {
  await page.addInitScript(() => {
    // Mock clipboard for deterministic CI/browser behavior.
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true
    });
  });

  await page.goto('/andrelademann.de.skills/agent-md-generator/');

  await page.fill('#project-name', 'Docs QA');
  await page.check('input[name="domain"][value="infrastructure"]');
  await page.check('input[name="preset"][value="security"]');

  const preview = page.locator('#agents-preview');
  const sizeStatus = page.locator('#agents-size-status');
  const sizeMetrics = page.locator('#agents-size-metrics');
  const sizeHint = page.locator('#agents-size-hint');

  await expect(sizeStatus).toBeVisible();
  await expect(sizeMetrics).toContainText('KB');
  await expect(sizeHint).toBeVisible();

  const longRules = Array.from({ length: 200 }, (_, index) => `Rule ${index + 1}: Keep instructions precise and avoid duplication.`).join('\n');
  await page.fill('#custom-standards', longRules);
  await expect(sizeStatus).toContainText('Needs review');
  await expect(sizeHint).toContainText('Consider trimming duplicated or obvious rules.');

  await expect(preview).toHaveValue(/AGENTS\.md for Docs QA/);
  await expect(preview).toHaveValue(/iac-infrastructure-as-code/);

  const copyButton = page.locator('#copy-agents');
  await copyButton.click();
  await expect(copyButton).toContainText('Copied!');
});

test('skill creator chat and zip flow works with mocked API', async ({ page }) => {
  let chatCallCount = 0;
  await page.route('**/api/skill-creator/chat', async (route) => {
    chatCallCount += 1;
    const body = route.request().postDataJSON() as {
      messages?: Array<{ role?: string; content?: string }>;
    };
    const lastMessage = body.messages?.[body.messages.length - 1]?.content ?? '';

    if (chatCallCount === 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Great scope. Please answer these to finalize requirements.',
          questions: [
            {
              id: 'platform',
              label: 'Which platform should this skill target?',
              multiSelect: false,
              options: ['React', 'Vanilla HTML', 'Vue']
            },
            {
              id: 'fields',
              label: 'Which form fields should be included?',
              multiSelect: true,
              options: ['Text input', 'Dropdown', 'Checkbox']
            }
          ]
        })
      });
      return;
    }

    if (!lastMessage.includes('Clarifications:')) {
      throw new Error(`Expected clarifications payload, got: ${lastMessage}`);
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Perfect, clarifications received. You can now create the ZIP.'
      })
    });
  });

  await page.route('**/api/skill-creator/finalize', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        skillFolderName: 'playwright-ci-triage',
        files: {
          'SKILL.md': '---\nname: playwright-ci-triage\ndescription: Diagnose flaky tests\n---\n# Playwright CI Triage',
          'metadata.json':
            '{"title":"Playwright CI Triage","description":"Diagnose flaky CI tests","purpose":"Use when CI tests are flaky.","tags":["playwright","ci"],"source":"https://example.com","version":"1.0.0"}'
        }
      })
    });
  });

  await page.goto('/andrelademann.de.skills/skill-creator/');

  await page.fill('#chat-input', 'Create a skill for flaky Playwright CI failures.');
  await page.click('#chat-send');

  await expect(page.locator('#chat-messages')).toContainText('Please answer these');
  await expect(page.locator('#clarification-questions')).toBeVisible();
  await page.getByRole('button', { name: 'React' }).click();
  await page.getByRole('checkbox', { name: 'Text input' }).check();
  await page.getByRole('checkbox', { name: 'Dropdown' }).check();
  await page.getByRole('button', { name: 'Send selected answers' }).click();

  await expect(page.locator('#chat-messages')).toContainText('clarifications received');
  await expect(page.locator('#chat-status')).toContainText('Reply ready');

  await page.click('#chat-finalize');
  await expect(page.locator('#chat-status')).toContainText('ZIP is ready');
  await expect(page.locator('#download-link')).toBeVisible();
  await expect(page.locator('#download-link')).toHaveAttribute('download', 'playwright-ci-triage.zip');
  await expect(page.locator('#package-preview')).toContainText('playwright-ci-triage');
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
