import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// 1. RETRIES
test.describe('Estratégias para Testes Estáveis', () => {
  
  // Retry implementado manualmente no teste
  test('retry - login crítico', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    
    // Implementação de retry manual
    let loginSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!loginSuccess && attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Tentativa de login: ${attempts}/${maxAttempts}`);
        
        // Tentar fazer login
        await loginPage.login('standard_user', 'secret_sauce');
        
        // Verificar se login foi bem-sucedido
        await page.waitForURL('**/inventory.html', { timeout: 5000 });
        await page.waitForSelector('.inventory_list', { timeout: 5000 });
        
        loginSuccess = true;
        console.log('Login realizado com sucesso!');
        
      } catch (error) {
        console.log(`Tentativa ${attempts} falhou: ${error.message}`);
        
        if (attempts < maxAttempts) {
          // Aguardar antes da próxima tentativa
          await page.waitForTimeout(1000);
          
          // Verificar se precisa voltar para página de login
          if (!page.url().includes('saucedemo.com')) {
            await loginPage.navigateTo();
          }
        } else {
          throw new Error(`Login falhou após ${maxAttempts} tentativas`);
        }
      }
    }
  });

  // 2. ESPERAS DINÂMICAS EM VEZ DE TIMEOUTS FIXOS
  test('esperas dinâmicas - aguardar condições específicas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // ❌ EVITAR: await page.waitForTimeout(3000);
    
    // ✅ USAR: Esperas dinâmicas baseadas em condições
    
    // Aguardar elemento específico estar visível
    await page.waitForSelector('.inventory_list', { state: 'visible' });
    
    // Aguardar por mudança de estado
    await page.waitForFunction(() => {
      return document.querySelectorAll('.inventory_item').length > 0;
    });
    
    // Aguardar requisição de rede completar
    await page.waitForLoadState('networkidle');
    
    // Aguardar texto específico aparecer
    await page.waitForSelector('text=Products', { timeout: 5000 });
  });

  // 3. ORGANIZAÇÃO COM TEST.STEP
  test('demonstração de test.step para organização', async ({ page }) => {
    // Usar test.step para organizar testes complexos
    await test.step('Setup - Navegar e fazer login', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.navigateTo();
      await loginPage.login('standard_user', 'secret_sauce');
      
      // Aguardar estado estável
      await page.waitForSelector('.inventory_list');
    });
    
    await test.step('Ação - Adicionar produto ao carrinho', async () => {
      const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
      await addButton.click();
      
      // Aguardar mudança de estado
      await page.waitForSelector('[data-test="remove-sauce-labs-backpack"]');
    });
    
    await test.step('Verificação - Validar carrinho atualizado', async () => {
      await expect(page.locator('.shopping_cart_badge')).toBeVisible();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });
  });

});
