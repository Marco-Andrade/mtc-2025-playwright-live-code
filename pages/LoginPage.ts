import { Page } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    
    // Locators centralizados
    private readonly usernameInput = '#user-name';
    private readonly passwordInput = '#password';
    private readonly loginButton = 'input[type="submit"]';
    private readonly product = '.inventory_item';
    
    constructor(page: Page) {
      this.page = page;
    }
    
    async navigateTo() {
      await this.page.goto('https://www.saucedemo.com/');
    }
    
    async login(username: string, password: string) {
      await this.page.fill(this.usernameInput, username);
      await this.page.fill(this.passwordInput, password);
      await this.page.click(this.loginButton);
    }
    
    async getFirstProduct() {
      return this.page.locator(this.product).first();
    }
  }