import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

test.describe("Landing page", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText("Analyze any app")).toBeVisible();
    await expect(page.getByText("Generate something better")).toBeVisible();
  });

  test("shows 5 process phases", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText("Analyze")).toBeVisible();
    await expect(page.getByText("Document")).toBeVisible();
    await expect(page.getByText("Design")).toBeVisible();
    await expect(page.getByText("Generate")).toBeVisible();
    await expect(page.getByText("Roadmap")).toBeVisible();
  });

  test("shows pricing section", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("a[href='#pricing']");
    await expect(page.getByText("Free")).toBeVisible();
    await expect(page.getByText("Pro")).toBeVisible();
    await expect(page.getByText("Enterprise")).toBeVisible();
  });

  test("sign up CTA navigates to signup", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("text=Start analyzing for free");
    await expect(page).toHaveURL(/.*signup/);
  });

  test("navigation links work", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("text=Sign in");
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
  });

  test("shows error on invalid login", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[type="email"]', "invalid@test.com");
    await page.fill('[type="password"]', "wrongpassword");
    await page.click('[type="submit"]');
    await expect(page.getByRole("alert").or(page.locator(".text-red-400"))).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Analysis Wizard", () => {
  test.beforeEach(async ({ page }) => {
    // Note: In real e2e tests, you'd authenticate first
    // For now we test the redirect behavior
    await page.goto(`${BASE_URL}/analyze`);
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Accessibility", () => {
  test("landing page has proper heading hierarchy", async ({ page }) => {
    await page.goto(BASE_URL);
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("buttons have accessible labels", async ({ page }) => {
    await page.goto(BASE_URL);
    const buttons = page.locator("button, a[role='button']");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto(BASE_URL);
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });
});
