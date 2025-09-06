import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login no sistema', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const username = 'standard_user';
  
  await loginPage.navigateTo();
  await loginPage.login(username, 'secret_sauce');
  
  // Asserção mais robusta - obter primeiro produto
  const firstProduct = await loginPage.getFirstProduct();
  await expect(firstProduct).toContainText('Add to cart');
});
