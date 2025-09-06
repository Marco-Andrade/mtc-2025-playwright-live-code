import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Definir tipo para o fixture
type AuthenticatedUserFixture = {
  authenticatedPage: Page;
  loginPage: LoginPage;
};

// Criar fixture customizada
export const test = base.extend<AuthenticatedUserFixture>({
  // Fixture que fornece uma página já autenticada
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    // Setup: realizar login automaticamente
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Aguardar estado estável
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.inventory_list');
    
    // Fornecer a página autenticada para o teste
    await use(page);
    
    // Teardown: limpar estado (se necessário)
    // Playwright já gerencia o contexto da página automaticamente
  },

  // Fixture que fornece instância da LoginPage
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }
});

// Re-exportar expect para usar com o fixture customizado
export { expect } from '@playwright/test';
