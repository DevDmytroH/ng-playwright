import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://g4c2xt-4200.csb.app/#/all');

  bypassCodeSandpoxMainPage(page);
});

type Todo = any;

/**
 * Goals:
 * 1. Improvements
 * 1.1 Readability
 * 1.2 Reusability
 * 1.3 Type-safety
 * 1.4 ...
 *
 * 2. Tests
 * 2.1 API: load todos stored in cloud
 * 2.2 Activate cross-browser testing
 */

test.describe('My Todo', () => {
  test('add todo item', async ({ page }) => {
    var newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('buy some cheese');
    await newTodo.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText(
      'What needs to be done?',
    );
    await newTodo.fill('feed the cat');
    await newTodo.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText([
      'buy some cheese',
      'feed the cat',
    ]);
    // TODO: ensure that added items have been saved in localStorage
  });

  test('mark all items as completed', async ({ page }) => {
    var newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('buy some cheese');
    await newTodo.press('Enter');
    await newTodo.fill('feed the cat');
    await newTodo.press('Enter');
    await newTodo.fill('book a doctors appointment');
    await newTodo.press('Enter');

    // TODO: ensure that added items have been saved in localStorage

    await page.getByLabel('Toggle All Input').check();
    await expect(page.getByTestId('todo-item')).toHaveClass([
      'completed',
      'completed',
      'completed',
    ]);

    // TODO: ensure that completed items have been updated in localStorage
  });

  test('complete all checkbox updates when items are completed/cleared', async ({
    page,
  }) => {
    var newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('buy some cheese');
    await newTodo.press('Enter');
    await newTodo.fill('feed the cat');
    await newTodo.press('Enter');
    await newTodo.fill('book a doctors appointment');
    await newTodo.press('Enter');

    // TODO: ensure that added items have been saved in localStorage

    const toggleAll = page.getByLabel('Toggle All Input');
    await toggleAll.check();
    await expect(toggleAll).toBeChecked();

    // TODO: ensure that completed items have been updated in localStorage

    const todo = page.getByTestId('todo-item').nth(0);
    await todo.getByRole('checkbox').uncheck();
    await expect(toggleAll).not.toBeChecked();
    await todo.getByRole('checkbox').check();

    // TODO: ensure that completed items (3) have been updated in localStorage
  });

  test('save edits on blur', async ({ page }) => {
    var newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('buy some cheese');
    await newTodo.press('Enter');
    await newTodo.fill('feed the cat');
    await newTodo.press('Enter');
    await newTodo.fill('book a doctors appointment');
    await newTodo.press('Enter');

    // TODO: ensure that added items have been saved in localStorage

    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).dblclick();
    await todoItems
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .fill('buy some sausages');

    await expect(todoItems).toHaveText([
      'buy some cheese',
      'buy some sausages',
      'book a doctors appointment',
    ]);

    // TODO: ensure that updated items have been saved in localStorage
  });

  /**
   * TODO: write a test to ensure when the user clicks the "Cloud" button, the received todos render on the page
   */
  test('load todos stored in cloud', async ({ page }) => {});
});

// Out of scope
const bypassCodeSandpoxMainPage = async (page: Page) => {
  await page.getByRole('link', { name: 'Yes, proceed to preview' }).click();
};
