// Importar fixture customizada em vez do test padrão
import { test, expect } from '../fixtures/authenticated-user';

test.describe('Testes com Fixture Customizada', () => {

  // Teste que usa a página já autenticada
  test('produtos visíveis após login automático', async ({ authenticatedPage }) => {
    // Não precisa fazer login - fixture já fez isso
    // Teste focado apenas na validação de produtos
    const products = authenticatedPage.locator('.inventory_item');
    await expect(products).toHaveCount(6);
    
    // Validar que estamos na página correta
    await expect(authenticatedPage).toHaveURL(/.*inventory.html/);
  });

  test('funcionalidade do carrinho com usuário logado', async ({ authenticatedPage }) => {
    // Usuário já está logado - foco apenas na funcionalidade do carrinho
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Validar badge do carrinho
    await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Validar mudança do botão
    await expect(authenticatedPage.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('adicionar múltiplos produtos', async ({ authenticatedPage }) => {
    // Adicionar 3 produtos diferentes
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // Validar contador do carrinho
    await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('navegação para carrinho', async ({ authenticatedPage }) => {
    // Adicionar produto e ir para carrinho
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await authenticatedPage.click('.shopping_cart_link');
    
    // Validar que está na página do carrinho
    await expect(authenticatedPage).toHaveURL(/.*cart.html/);
    await expect(authenticatedPage.locator('.cart_item')).toHaveCount(1);
  });
});

// Exemplo de fixture para cenários específicos
test.describe('Testes com Estados Específicos', () => {

  test('teste que precisa de setup customizado', async ({ loginPage, page }) => {
    // Usar fixture loginPage para cenários específicos
    await loginPage.navigateTo();
    
    // Testar comportamento de erro de login
    await loginPage.login('invalid_user', 'wrong_password');
    
    // Validar mensagem de erro
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

});
