import { test, expect } from '@playwright/test';

// Exemplo de código problemático - sem estrutura
test('login no sistema', async ({ page }) => {
  // Seletores hard-coded
  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(5000); // Espera fixa
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(3000); // Outra espera fixa
  
  // Asserção frágil
  const productTitle = await page.textContent('.inventory_item_name ');
  expect(productTitle).toBe('Sauce Labs Backpack');
});














// ❌ PROBLEMAS IDENTIFICADOS:
// 1. Seletores hard-coded espalhados pelo código
// 2. Esperas fixas (waitForTimeout) que tornam os testes instáveis
// 3. Credenciais hard-coded no teste
// 4. Asserção frágil que pode quebrar facilmente
// 5. Sem separação de responsabilidades
// 6. Código não reutilizável
// 7. Difícil manutenção
// 8. Sem tipagem TypeScript adequada
