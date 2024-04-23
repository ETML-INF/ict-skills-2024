# skills17/cypress-helpers

<img src="https://cyrilwanner.github.io/packages/skills17/cypress-helpers/assets/output-preview.png" align="center">

This package provides some Cypress helpers for usage in a skills competition environment. It includes:
- Custom output formatter
- Commands
- Automatic task file server
- ... and more

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

**Requirements:**
- Node `16` or greater
- Cypress `12.0` or greater

To install this package, simply run the following command:

```bash
npm install @skills17/cypress-helpers
```

Additionally, install the support file and plugins shipped with this package:

```typescript
// cypress/support/e2e.ts
import '@skills17/cypress-helpers/support';
```

```typescript
// cypress/cypress.config.ts
import { defineConfig } from 'cypress';
import plugins from '@skills17/cypress-helpers/plugins';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      plugins(on, config);
    },
  },
});

```

It is suggested to add the following npm scripts:

```json
  "scripts": {
    "start": "skills17-cypress open --e2e --browser chrome",
    "test": "skills17-cypress run --quiet --browser chrome --headless",
    "test:json": "skills17-cypress run --quiet --browser chrome --headless --json"
  },
```

This will provide the following commands:
- `npm start` - Start the interactive cypress browser (useful for the competitors to debug errors)
- `npm test` - Run all tests once and show a nice output with the awarded points (useful for the competitors to see their points)
- `npm run test:json` - Run all tests once and get a json output (useful for automated marking scripts)

For international championships, it is also strongly recommended setting the [`--timezone` argument](#cli) to the timezone in which the championship takes place.
This helps to avoid time discrepancies between the development environment and the championship-site.

## Usage

A `config.yaml` file needs to be created that contains some information about the task. It should be placed in the root folder of your task, next to the `package.json` file.

See the [`@skills17/task-config`](https://github.com/skills17/task-config#configuration) package for a detailed description of all available properties in the `config.yaml` file.

### CLI

As seen in the install instructions, the `skills17-cypress` command is available.

It is a thin wrapper around the actual `cypress` command which prepares the task and configures cypress correctly.

All arguments to the command will be forwarded to `cypress` so cypress can be used exactly the same way if this package wouldn't be installed.

Additionally, the following new arguments are available:
- `--json` output the test result in json (only for `cypress run`)
- `--timezone <timezone>` forces the timezone during a test run (e.g. `--timezone Etc/UTC`)

### Grouping

A core concept is test groups. You usually don't want to test everything for one criterion in one test function but instead split it into multiple ones for a cleaner test class and a better overview.

In JS, tests are grouped by a test name prefix defined in the `config.yaml` file.

All context are concatenated with the actual test names before evaluation.

For example, the following test will have the name `Countries > Overview > lists all countries`:

```typescript
context('Countries', () => {
  context('Overview', () => {
    it('lists all countries', () => {
      // ...
    });
  });
});
```

To catch and group all tests within the `Overview` context, the group matcher can be set to `Countries > Overview > .+` for example. Each of the tests within that group will now award 1 point to the group.

### Static file server

Cypress tests usually run against a website competitors have to implement.
This has to be served in order for cypress to be able to access it.
This package respects the [`serve` option](https://github.com/skills17/task-config#serve-serve) in the `config.yaml` and automatically starts a static file server for the paths defined there if it is enabled (`serve.enabled` has to be set to `true`).

The base path is also automatically set for cypress, so you can omit the host and directly start with the path in any cypress statements (e.g. `cy.visit('/countries')`).

### Extra tests

To prevent cheating, extra tests can be used.
They are not available to the competitors and should test exactly the same things as the normal tests do, but with different values.

For example, if your normal test contains a check to search the list of all countries by 'Sw*', copy the test into an extra test and change the search string to 'Ca*'.
Since the competitors will not know the extra test, it would detect statically returned values that were returned to simply satisfy the 'Sw*' tests instead of actually implement the search logic.

Extra tests are detected by their context, which should equal `'Extra'` or `'extra'`. That means that you can simply wrap your test in an aditional extra context like shown below. The other context and test names should exactly equal the ones from the normal tests. If they don't, a warning will be displayed.

```typescript
context('Extra', () => {    // <-- only this context has to be added
  context('Countries', () => {
    it('lists all countries', () => {
      // ...
    });
  });
});
```

It usually makes sense to move the extra tests in a separate folder, so the folder can simply be deleted before the tasks are distributed to the competitors.
Nothing else needs to be done or configured.

If an extra test fails while the corresponding normal test passes, a warning will be displayed that a manual review of that test is required since it detected possible cheating.
The penalty then has to be decided manually from case to case, the points visible in the output assumed that the test passed and there was no cheating.

### Cypress commands

This package provides a few helper commands for cypress.

The following ones are available.

#### Bounding Rect

- `cy(selector).width()` returns the bounding client rect width
- `cy(selector).height()` returns the bounding client rect height
- `cy(selector).left()` returns the left position of the bounding client rect
- `cy(selector).top()` returns the top position of the bounding client rect
- `cy(selector).right()` returns the right position of the bounding client rect
- `cy(selector).bottom()` returns the bottom position of the bounding client rect

All these commands can be chained normally.
For example `cy('.box').width().should('equal', 100)` can be used to test if the width equals `100px`.

## License

[MIT](https://github.com/skills17/cypress-helpers/blob/master/LICENSE)
