import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Dados Centralizados e Tratamento de Erros', () => {

  // 4. DADOS DE TESTE CENTRALIZADOS
  test('usar dados centralizados em vez de hardcoded', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    
    // ✅ USAR dados centralizados
    await loginPage.login(
      TEST_DATA.USERS.VALID.username, 
      TEST_DATA.USERS.VALID.password
    );
    
    // Validar login bem-sucedido
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Adicionar produto usando dados centralizados
    await page.click(`[data-test="add-to-cart-${TEST_DATA.PRODUCTS.BACKPACK}"]`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // 5. TRATAMENTO DE ERROS ROBUSTO
  test('tratamento de erros com validação específica', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    
    // Testar usuário bloqueado
    await loginPage.login(
      TEST_DATA.USERS.LOCKED.username, 
      TEST_DATA.USERS.LOCKED.password
    );
    
    // ✅ Tratamento específico do erro
    try {
      await page.waitForSelector('[data-test="error"]', { timeout: 5000 });
      const errorMessage = await page.locator('[data-test="error"]').textContent();
      
      // Validar mensagem específica
      expect(errorMessage).toContain(TEST_DATA.EXPECTED_MESSAGES.LOCKED_USER);
      
      // Fechar mensagem de erro
      await page.click('.error-button');
      await expect(page.locator('[data-test="error"]')).not.toBeVisible();
      
    } catch (error) {
      throw new Error(`Erro inesperado ao testar usuário bloqueado: ${error.message}`);
    }
  });

  test('tratamento de erros de rede e timeout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Simular cenário de rede lenta
    await page.route('**/*', route => {
      // Simular delay em requisições específicas
      if (route.request().url().includes('inventory')) {
        setTimeout(() => route.continue(), 2000);
      } else {
        route.continue();
      }
    });
    
    await loginPage.navigateTo();
    
    // ✅ Tratamento de timeout com retry
    let loginAttempted = false;
    let attempts = 0;
    const maxAttempts = 2;
    
    while (!loginAttempted && attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Tentativa ${attempts} de login com rede lenta`);
        
        await loginPage.login(
          TEST_DATA.USERS.VALID.username, 
          TEST_DATA.USERS.VALID.password
        );
        
        // Aguardar com timeout específico para rede lenta
        await page.waitForURL('**/inventory.html', { timeout: 10000 });
        loginAttempted = true;
        
      } catch (error) {
        console.log(`Tentativa ${attempts} falhou: ${error.message}`);
        
        if (attempts >= maxAttempts) {
          throw new Error(`Login falhou após ${maxAttempts} tentativas em rede lenta`);
        }
        
        // Aguardar antes de tentar novamente
        await page.waitForTimeout(1000);
      }
    }
  });

  test('validação de dados de entrada', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    
    // ✅ Validar dados antes de usar
    const testCases = [
      { username: '', password: 'secret_sauce', expectedError: TEST_DATA.EXPECTED_MESSAGES.USERNAME_REQUIRED },
      { username: 'standard_user', password: '', expectedError: TEST_DATA.EXPECTED_MESSAGES.PASSWORD_REQUIRED },
      { username: 'invalid', password: 'wrong', expectedError: TEST_DATA.EXPECTED_MESSAGES.INVALID_CREDENTIALS }
    ];
    
    for (const testCase of testCases) {
      await test.step(`Testar: ${testCase.username || 'vazio'} / ${testCase.password || 'vazio'}`, async () => {
        // Limpar campos antes de cada teste
        await page.reload();
        
        if (testCase.username) {
          await page.fill('#user-name', testCase.username);
        }
        if (testCase.password) {
          await page.fill('#password', testCase.password);
        }
        
        await page.click('#login-button');
        
        // Validar mensagem de erro específica
        if (testCase.expectedError) {
          await expect(page.locator('[data-test="error"]')).toBeVisible();
          const errorText = await page.locator('[data-test="error"]').textContent();
          expect(errorText).toContain(testCase.expectedError);
        }
      });
    }
  });

});
