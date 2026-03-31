# Playwright Test Plan - E2E-101 - E-commerce Checkout Process

## Story
As a customer, I want to complete my purchase through a checkout process so that I can order products online.

## Application
https://www.saucedemo.com

## Test Data
- Username: `standard_user`
- Password: `secret_sauce`
- Products: `Sauce Labs Backpack`, `Sauce Labs Bike Light`
- Shipping info: `John Doe`, `90210`

## Preconditions
- The application is accessible at `https://www.saucedemo.com`
- The user can log in with valid credentials
- Test account starts with an empty cart
- Network is stable and page load is successful

## Test Scenarios
1. Happy path: login, add items, review cart, enter checkout information, verify order overview, finish order, confirm completion.
2. Cart review: verify cart item details, quantities, prices, and the availability of cart actions before checkout.
3. Mandatory field enforcement: ensure First Name, Last Name, and Zip/Postal Code are required before continuing.
4. Validation path: submit incomplete checkout information and verify the exact error messages for each missing field.
5. Checkout overview details: verify payment and shipping summary, item list, subtotal, tax, and total.
6. Checkout cancellation: from the overview page, cancel and return to inventory.
7. Order completion state: complete checkout, return home, and verify the cart has been cleared.

## Test Steps
### Scenario 1: End-to-end checkout
1. Open `https://www.saucedemo.com`
2. Log in with valid credentials
3. Add at least two products to the cart
4. Open the shopping cart and verify cart items, descriptions, prices, and total
5. Click `Checkout`
6. Enter first name, last name, and postal code
7. Click `Continue`
8. Verify order overview with selected items, subtotal, tax, total, and payment/shipping details
9. Click `Finish`
10. Verify order completion page and `Back Home` button

### Scenario 2: Validation behavior
1. Open the checkout information page with items in cart
2. Leave one required field empty
3. Click `Continue`
4. Verify the appropriate validation error message appears

### Scenario 3: Checkout cancellation
1. From checkout overview, click `Cancel`
2. Verify the user is returned to the cart page with items intact

### Scenario 4: Mandatory checkout fields
1. Leave each required field empty in turn
2. Click `Continue`
3. Verify the correct error message appears for First Name, Last Name, and Zip/Postal Code

### Scenario 5: Order overview details
1. Continue from checkout information with valid data
2. Verify payment and shipping summary details
3. Verify subtotal, tax, and total labels appear

### Scenario 6: Clear cart after completion
1. Finish checkout
2. Click `Back Home`
3. Verify the cart badge is removed and the cart is cleared

## Expected Results
- All cart items and details are displayed correctly
- Required checkout fields are enforced
- The order overview page shows the correct item summary and totals
- Successful checkout leads to confirmation and cart reset
- Canceling checkout returns the user to the cart state

## Risk Areas
- UI selectors changing due to page redesign
- Flaky timing on page navigation or dynamic content
- Validation message text or page transitions changing
- Cross-browser differences in button behavior

## Suggested Selector Strategy
- Prefer stable `data-test` and element IDs
- Use text-aware locators for product names and buttons
- Avoid brittle class-only selectors
- Centralize selector logic in Playwright page objects

## API Dependencies
- No direct API dependencies are required for this front-end checkout flow
- Optional network verification: ensure checkout navigation and completion triggers the expected page transitions

## Notes
- The workflow is designed for Chromium, Firefox, and WebKit
- Manual MCP execution is recommended to capture UI behavior, network calls, and timing issues before running automation
