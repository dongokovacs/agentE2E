import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export class ProductsPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('.shopping_cart_link');
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addItemToCart(name: string) {
    const item = this.page.locator('.inventory_item', { hasText: name });
    await expect(item).toBeVisible();
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number) {
    if (count > 0) {
      await expect(this.cartBadge).toHaveText(String(count));
    } else {
      await expect(this.cartBadge).toHaveCount(0);
    }
  }
}

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  itemByName(name: string) {
    return this.page.locator('.cart_item', { hasText: name });
  }

  async expectItemVisible(name: string) {
    await expect(this.itemByName(name)).toBeVisible();
  }

  async expectCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectItemDetails(name: string, price: string, quantity = '1') {
    const item = this.itemByName(name);
    await expect(item.locator('.inventory_item_desc')).toBeVisible();
    await expect(item.locator('.inventory_item_price')).toContainText(price);
    await expect(item.locator('.cart_quantity')).toHaveText(quantity);
  }

  async expectActionsVisible() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

export class CheckoutInformationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('h3[data-test="error"]');
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summaryInfo: Locator;
  readonly itemRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.summaryInfo = page.locator('.summary_info');
    this.itemRows = page.locator('.cart_item');
  }

  async expectItemVisible(name: string) {
    await expect(this.page.locator('.cart_item', { hasText: name })).toBeVisible();
  }

  async expectOrderSummary() {
    await expect(this.summaryInfo).toBeVisible();
    await expect(this.itemRows).toHaveCount(2);
  }

  async expectPaymentAndShippingDetails() {
    await expect(this.summaryInfo.getByText('Payment Information')).toBeVisible();
    await expect(this.summaryInfo.getByText('Shipping Information')).toBeVisible();
    await expect(this.page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(this.page.locator('.summary_tax_label')).toBeVisible();
    await expect(this.page.locator('.summary_total_label')).toBeVisible();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

export class CheckoutCompletePage {
  readonly page: Page;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.getByRole('heading', { name: /thank you for your order/i });
    this.completeText = page.getByText('Your order has been dispatched');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toContainText('Thank you for your order');
    await expect(this.completeText).toContainText('Your order has been dispatched');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
