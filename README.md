# Projeto de Automação de Testes - Boas Práticas MTC

Este projeto demonstra a implementação de boas práticas em automação de testes usando **Playwright** e **TypeScript**.

## 📁 Estrutura do Projeto

```
MTC/
├── tests/                    # Testes organizados por funcionalidade
│   ├── 01.spec.ts          # Teste de login básico (exemplo problemático)
│   ├── 02.spec.ts          # Teste de inventário
│   ├── 03.spec.ts          # Teste de carrinho
│   ├── 04.spec.ts          # Teste de checkout
│   └── 05.spec.ts          # Teste de logout
├── pages/                   # Page Objects
│   └── LoginPage.ts        # Page Object para login
├── fixtures/               # Dados de teste e configurações
│   ├── authenticated-user.ts # Fixture para usuário autenticado
│   └── test-data.ts        # Dados de teste centralizados
├── config/                 # Configurações (vazio - para implementação futura)
├── docs/                   # Documentação
│   └── boas-praticas-automacao.md # Guia de boas práticas
├── reports/               # Relatórios (gerados automaticamente)
│   ├── html/              # Relatórios HTML
│   └── junit/             # Relatórios JUnit
├── test-results/          # Resultados de testes (gerados automaticamente)
├── playwright.config.ts   # Configuração do Playwright
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## 📋 Arquivos Principais

### Testes (`/tests/`)
- **01.spec.ts**: Exemplo de teste problemático com práticas inadequadas
- **02.spec.ts**: Teste de funcionalidades do inventário
- **03.spec.ts**: Teste de funcionalidades do carrinho
- **04.spec.ts**: Teste do processo de checkout
- **05.spec.ts**: Teste de logout do sistema

### Page Objects (`/pages/`)
- **LoginPage.ts**: Classe para interação com a página de login

### Fixtures (`/fixtures/`)
- **test-data.ts**: Dados de teste centralizados (usuários, produtos, mensagens)
- **authenticated-user.ts**: Fixture para usuário autenticado

### Configuração
- **playwright.config.ts**: Configuração principal do Playwright
- **package.json**: Dependências e scripts do projeto

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
# Apenas teste de login (exemplo problemático)
npm test 01.spec.ts

# Apenas teste de inventário
npm test 02.spec.ts

# Apenas teste de carrinho
npm test 03.spec.ts

# Apenas teste de checkout
npm test 04.spec.ts

# Apenas teste de logout
npm test 05.spec.ts

# Executar múltiplos testes
npm test 01.spec.ts 02.spec.ts
```

### Executar com UI
```bash
npm test:ui
```

### Executar em modo debug
```bash
npm test:debug
```

## 🔧 Principais Melhorias Implementadas

### 1. **Locators Centralizados**
```typescript
// config/locators.ts
export const LOCATORS = {
  LOGIN: {
    USERNAME: '#username',
    PASSWORD: '#password',
    SUBMIT_BUTTON: 'button[type="submit"]'
  }
} as const;
```

### 2. **Page Object Model**
```typescript
// pages/LoginPage.ts
export class LoginPage extends BasePage {
  private usernameInput = this.page.locator(LOCATORS.LOGIN.USERNAME);
  
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }
}
```

### 3. **Helpers Reutilizáveis**
```typescript
// utils/test-helpers.ts
export class TestHelpers {
  static async loginWithStandardUser(page: Page): Promise<InventoryPage> {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginWithStandardUser();
    return new InventoryPage(page);
  }
}
```

### 4. **Eliminação de Esperas Fixas**
- ❌ `await page.waitForTimeout(5000)`
- ✅ `await this.waitForElement(locator)`
- ✅ `await this.page.waitForLoadState('networkidle')`

### 5. **Tipagem TypeScript Forte**
```typescript
async login(username: string, password: string): Promise<void>
async expectLoginSuccess(): Promise<void>
```

## 📈 Benefícios Alcançados

1. **Manutenibilidade**: Mudanças em locators afetam apenas um arquivo
2. **Reutilização**: Componentes e helpers podem ser usados em múltiplos testes
3. **Legibilidade**: Código mais limpo e fácil de entender
4. **Escalabilidade**: Fácil adição de novos testes e funcionalidades
5. **Estabilidade**: Eliminação de esperas fixas e asserções frágeis
6. **Colaboração**: Estrutura clara facilita trabalho em equipe

## 📝 Próximos Passos

Este projeto demonstra tanto práticas problemáticas quanto boas práticas. Próximas implementações podem incluir:

### Melhorias na Estrutura
- [ ] Implementar BasePage com métodos comuns
- [ ] Criar locators centralizados em `/config/locators.ts`
- [ ] Adicionar InventoryPage, CartPage e CheckoutPage
- [ ] Implementar helpers em `/utils/test-helpers.ts`

---

*Este projeto demonstra como uma arquitetura bem pensada pode transformar scripts simples em um framework robusto e escalável.*
