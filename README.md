<h1 align='center'>
    <img width='300' src='docs/assets/logo.png'/>
</h1>


# Atlan CLI

Atlan is a CLI that helps you to manage local dockerized infrastructure without any needed knowledge on Docker and Docker Compose.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)



## What is Atlan CLI?

Atlan is a CLI tool based on [Docker](https://docs.docker.com/get-started/overview) and [Docker Compose](https://docs.docker.com/compose) that helps you to manage complex local dockerized infrastructure.


## Use Atlan CLI


Please read the full [documentation](./docs/README.md).

## Integrate Atlan CLI in your CLI


Atlan is based on [commander.js](https://github.com/tj/commander.js) cli builder. 
If you have a custom commander CLI, you can integrate Atlan in your CLI by requiring it with theses simple lines of code:

```js
const atlan = require('atlan');

```
## Philosophy and goals


Atlan is a tool that was designed to simplify the life of developers. You don't need to know Docker to use it, Atlan does it for you in a very simple way. Its goal is and will remain to simplify the daily life of its users.

Atlan must and will have to respect some main DX principles:

1. **Ease of use**

The entire Atlan API must be described and understandable by any developer without having to consult any other source than Atlan itself.

2. **Evolutivity**

Atlan will inevitably evolve over time. Even if it does evolve, the API must minimize the affordance that Atlan users may encounter.

3. **Contributability**

Atlan is and will remain an open source tool. Contributing to its evolution should therefore always be easy and accessible to anyone who wants to help improve it.

## License


This tool is licensed under the [MIT license](LICENSE).

## Want to contribute?

If you want to contribute through code or documentation, the [Contributing guide](CONTRIBUTING.md) is the best place to start. If you have questions, feel free to ask.

## Want to support the project ?
All this project is open source and free to use. If you want to support the project, you can use the link below.

Every little bit helps.

<a href="https://www.buymeacoffee.com/Myastro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

___
Made with 🥖 by [@Myastr0](https://github.com/Myastr0)

