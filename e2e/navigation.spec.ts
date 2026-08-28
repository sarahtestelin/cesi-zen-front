import { test, expect } from '@playwright/test';

test.describe('Navigation publique CESIZen', () => {
  test('affiche correctement la page d’accueil', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Prends soin de ton équilibre mental avec CESIZen.',
      }),
    ).toBeVisible();
  });

  test('permet d’accéder au diagnostic depuis l’accueil', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Faire le diagnostic' }).click();

    await expect(page).toHaveURL(/\/diagnostic$/);
  });

  test('permet d’accéder à la connexion depuis le header', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Connexion' }).click();

    await expect(page).toHaveURL(/\/connexion$/);
  });
});
