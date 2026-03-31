import { test, expect } from './test-options';

const username = 'standard_user';
const password = 'secret_sauce';
const lockedOutUsername = 'locked_out_user';
const shipping = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '90210',
};
const productA = 'Sauce Labs Backpack';
const productB = 'Sauce Labs Bike Light';

test.describe('E2E Checkout Workflow - SauceDemo', () => {
  test('should complete a checkout flow successfully', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {

    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.addItemToCart(productB);
    await productsPage.openCart();

    await cartPage.expectCartItemCount(2);
    await cartPage.expectItemVisible(productA);
    await cartPage.expectItemVisible(productB);
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkoutOverviewPage.expectOrderSummary();
    await checkoutOverviewPage.expectItemVisible(productA);
    await checkoutOverviewPage.expectItemVisible(productB);
    await checkoutOverviewPage.expectPaymentAndShippingDetails();
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete.html/);
    await checkoutCompletePage.expectOrderComplete();
  });

  test('should review cart item details and actions before checkout', async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.addItemToCart(productB);
    await productsPage.expectCartBadgeCount(2);
    await productsPage.openCart();

    await cartPage.expectCartItemCount(2);
    await cartPage.expectItemDetails(productA, '$29.99');
    await cartPage.expectItemDetails(productB, '$9.99');
    await cartPage.expectActionsVisible();
  });

  test('should enforce all mandatory checkout fields before continuing', async ({ loginPage, productsPage, cartPage, checkoutInformationPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation('', shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: First Name is required');

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, '', shipping.postalCode);
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: Last Name is required');

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, '');
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: Postal Code is required');
  });

  test('should complete order, return home and clear the cart', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await checkoutCompletePage.expectOrderComplete();

    await checkoutCompletePage.backHome();
    await expect(page).toHaveURL(/inventory.html/);
    await productsPage.expectCartBadgeCount(0);
  });

  test('should allow cancelling from order overview and return to cart', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.cancel();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productsPage.inventoryList).toBeVisible();
  });

  test('should allow continue shopping from cart and keep selected items @happy @smoke', async ({ page, loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();

    await cartPage.expectCartItemCount(1);
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory.html/);
    await productsPage.expectCartBadgeCount(1);
  });

  test('should remove a cart item and update cart badge count @regression', async ({ page, loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.addItemToCart(productB);
    await productsPage.expectCartBadgeCount(2);
    await productsPage.openCart();

    await page.getByRole('button', { name: 'Remove' }).first().click();
    await cartPage.expectCartItemCount(1);
    await productsPage.expectCartBadgeCount(1);
  });

  test('should keep checkout information inputs editable across corrections @regression', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation('', shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: First Name is required');

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('should allow cancelling from checkout information and return to cart @happy', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/cart.html/);
    await cartPage.expectItemVisible(productA);
  });

  test('should show error for locked-out user during login @negative', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(lockedOutUsername, password);

    await expect(page.getByText('Swag Labs')).toBeVisible();
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    await expect(page).toHaveURL(/saucedemo.com/);
  });

  test('should complete checkout with special characters in customer names @edge', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productA);
    await productsPage.openCart();
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation("Anne-Marie O'Neil", 'de la Cruz', '10001');
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.expectOrderComplete();
  });

  test('should complete checkout with long but valid customer names @edge @regression', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.addItemToCart(productB);
    await productsPage.openCart();
    await cartPage.checkout();

    const longFirstName = 'Alexanderthegreatlongfirstname';
    const longLastName = 'Montgomery-Wellington-Smythe';

    await checkoutInformationPage.fillCustomerInformation(longFirstName, longLastName, '30301');
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.expectOrderComplete();
  });

  test('should permit checkout flow from an empty cart and still complete order @edge', async ({ page, loginPage, productsPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await loginPage.goto();
    await loginPage.login(username, password);

    await productsPage.openCart();
    await cartPage.expectCartItemCount(0);
    await cartPage.checkout();

    await checkoutInformationPage.fillCustomerInformation(shipping.firstName, shipping.lastName, shipping.postalCode);
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.expectOrderComplete();
  });
});
