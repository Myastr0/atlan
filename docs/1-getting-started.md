# Getting started with Atlan CLI

Atlan is composed by multiple cli modules that brings you the power of docker and docker-compose without any knowledge of them.

```shell
$ atlan | atl
```

## Initialization

Atlan needs to be initialized before you can use it. It will create a `.atlan` directory in your home directory to store ressources that atlan needs to be used.

```shell    
$ atlan init
```

To verify the initialization, you can run the following command and the see the following result:

```shell
$ atlan get state

{
  "version": "<your-atlan-version>",
  ...
}
```

## Concepts

Atlan interact with some concept that you need to know to use it.

- **context**: A context is a collection of apps.
- **app**: An app is a docker-compose file.
- **environment**: An environment is env file with docker-compose app files.

## Usage

### Using a context
By default, Atlan install some default contexts. You can use the following commands to manage your contexts:

```shell
$ atlan context list|ls

Contexts:

- gitea [directory]
- plex [directory]
```


All of these contexts are already initialized. 
You can use the following command to describe the context, listing all of its apps:

```shell
$ atlan context describe gitea

Context: gitea
Apps: gitea
```

You can use the following commands to use one of them:

```shell
$ atlan context use gitea
```

You can see the current used context by running the following command:

```shell
$ atlan context current

Current context: gitea
```
Or with lising all of them, the current context is marked with an 👉:

```shell
$ atlan context list

Contexts:
👉 gitea [directory]
- plex [directory]
```

### Launching apps

Now you've a current context, you can use the following command to launch apps of this context :

```shell
$ atlan start
```

Select the applications that you want to start with your keyboard :

```shell
? Which applications do you want to start ? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ Gitea

✔ Finding infrastructure definition: Completed
✔ Mounting apps: Completed
✔ Saving apps definition: Completed
```

### Accessing to your apps

Gitea context basicaly embed an application called Gitea that is a web application that you can use to manage your git repository.
If you've followed the [Gitea documentation](https://docs.gitea.io/en-us/), you can access to the gitea app with the following link:

[http://localhost:3000](http://localhost:3000)

### Stopping apps

You can stop apps with the following command:

```shell
$ atlan stop
```

___
In the next chapter, you'll learn how to manage your context.
___

Next chapter: [2 - Context Management](2-context-management.md)
