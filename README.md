Thread Link Client Library
======================

This library provides a client for interacting with Thread Link's public and admin endpoints. It includes both a programmatic interface and command-line tools for ease of use.

Table of Contents
-----------------

*   [Installation](#installation)
*   [Usage](#usage)
    *   [Public Client](#public-client)
    *   [Admin Client](#admin-client)
*   [CLI](#cli)
    *   [Public CLI](#public-cli)
    *   [Admin CLI](#admin-cli)
*   [Contributing](#contributing)
*   [License](#license)

Installation
------------

You can install the library via npm:

```sh
npm install thread-link
```

Usage
-----

### Public Client

The public client provides methods to interact with Thread Link's public endpoints. Here's an example of how to use the public client:


```typescript
import { PublicClient } from 'thread-link';

const publicClient = new PublicClient();

publicClient.getMessages()
   .then(messages => console.log(messages))
   .catch(error => console.error(error));
```


### Admin Client

The admin client provides methods to interact with Thread Link's admin endpoints. Here's an example of how to use the admin client:

```typescript
import { AdminClient } from 'thread-link';

const adminClient = new AdminClient();

adminClient.getAccounts()
   .then(accounts => console.log(accounts))
   .catch(error => console.error(error));
```

CLI
---

The library includes command-line interfaces (CLI) for interacting with both public and admin endpoints.

### Public CLI

The public CLI can be used to interact with public endpoints. Here's an example:

```bash
npx thread-link get-messages
```

#### Commands

*   `get-messages`: Retrieve messages
*   `get-threads`: Retrieve threads
*   `get-topics`: Retrieve topics

### Admin CLI

The admin CLI can be used to interact with admin endpoints. Here's an example:

```sh
npx thread-link-admin get-accounts
```

#### Commands

*   `get-accounts`: Retrieve accounts
*   `get-provider-configurations`: Retrieve provider configurations

Contributing
------------

We welcome contributions!

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.
