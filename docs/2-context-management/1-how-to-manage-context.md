---
title: How to manage context
icon: 🧭
---
## Context
### Create a context

You can also create your own contexts and add apps to them using `atlan context` tool:

```shell
$ atlan context create <context>
```

### Import a context

You can import a context with Atlan CLI but you need to setup some requirements to do it:

1. Your context must be a directory.
2. Groups all your docker compose app files in a `apps` directory.

### Using a context

You can use a context with Atlan CLI by using the `atlan use` command:

```shell
$ atlan context use <context>
```

By default, when you switch to a new context, Atlan will stop all previous context app.
If you want to keep the previous context apps, you can use the `--stay-alive` option


### Duplicate a context

You can duplicate a context with Atlan CLI:

```shell
$ atlan context duplicate <context> <new-context>
```

### Remove a context

You can remove a context with Atlan CLI:

```shell
$ atlan context remove <context>
```
