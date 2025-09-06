// Dados de teste centralizados para evitar hardcoding
export const TEST_DATA = {
  USERS: {
    VALID: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    INVALID: {
      username: 'invalid_user',
      password: 'wrong_password'
    },
    LOCKED: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    },
    PROBLEM: {
      username: 'problem_user',
      password: 'secret_sauce'
    }
  },
  PRODUCTS: {
    BACKPACK: 'sauce-labs-backpack',
    BIKE_LIGHT: 'sauce-labs-bike-light',
    T_SHIRT: 'sauce-labs-bolt-t-shirt',
    FLEECE_JACKET: 'sauce-labs-fleece-jacket',
    ONESIE: 'sauce-labs-onesie',
    TEST_ALL_THINGS: 'test.allthethings()-t-shirt-(red)'
  },
  EXPECTED_MESSAGES: {
    LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match',
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    PASSWORD_REQUIRED: 'Epic sadface: Password is required'
  },
  URLS: {
    BASE: 'https://www.saucedemo.com/',
    INVENTORY: 'https://www.saucedemo.com/inventory.html',
    CART: 'https://www.saucedemo.com/cart.html'
  }
} as const;

// Tipos TypeScript para os dados
export type UserType = keyof typeof TEST_DATA.USERS;
export type ProductType = keyof typeof TEST_DATA.PRODUCTS;
export type MessageType = keyof typeof TEST_DATA.EXPECTED_MESSAGES;
