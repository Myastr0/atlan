# Context management

As you can see, at the initialization of Atlan, there is some defaults contexts to learn how to use basics atlan commands.
This is simply an getting started guide but you can manage your contexts depending on your needs using the `atlan context` tool.

This tool contains all crud commands to manage your contexts and associated apps.

## Table of Contents
* Context
    * [Create](#create-context)
    * [Import](#import-context)
    * [Use](#use-context)
    * [Remove](#remove-context)
    * [Duplicate](#duplicate-context)
* App
    * [Import](#import-app)
    * [Remove](#remove-app)

___

## Context
### Create a context <a id="create-context"></a>

You can also create your own contexts and add apps to them using `atlan context` tool:

```shell
$ atlan context create <context>
```

### Import a context <a id="import-context"></a>

You can import a context with Atlan CLI but you need to setup some requirements to do it:

1. Your context must be a directory.
2. Groups all your docker compose app files in a `apps` directory.

### Using a context <a id="use-context"></a>

You can use a context with Atlan CLI by using the `atlan use` command:

```shell
$ atlan context use <context>
```

By default, when you switch to a new context, Atlan will stop all previous context app.
If you want to keep the previous context apps, you can use the `--stay-alive` option


### Duplicate a context <a id="duplicate-context"></a>

You can duplicate a context with Atlan CLI:

```shell
$ atlan context duplicate <context> <new-context>
```

### Remove a context <a id="remove-context"></a>

You can remove a context with Atlan CLI:

```shell
$ atlan context remove <context>
```

___
## App

### Import an app to a context <a id="import-app"></a>

You can import an app to a context with Atlan CLI by using the `atlan context import-app` command:

```shell
$ atlan context import-app <app-path> <context> [app-name]
```

### Remove an app from a context <a id="remove-app"></a>

You can remove an app from a context with Atlan CLI by using the `atlan context remove-app` command:

```shell
$ atlan context remove-app <app-name> <context>
```



