# Sivir installer lab

Start the local-only dashboard from the repository root:

```sh
bun --cwd apps/installer-lab dev
```

Open the printed `127.0.0.1` URL. The dashboard has two modes:

- **Automatic** creates, installs, checks, builds, and previews a disposable consumer app for you.
- **Manual terminal** automatically prepares an empty Svelte app, opens the terminal inside it, and shows only the relative Sivir/check/build commands. Select a step to copy it into the command field, then choose **Run** or press Enter.

The manual terminal runs one command at a time. It supports quoted arguments and the built-in `cd`, `pwd`, and `clear` commands. Shell chaining, pipes, redirects, and leaving the repository directory are rejected. **Cancel** stops the active process group; **Recreate app** deletes only `temp/installer-lab/manual`, rebuilds the empty app and returns the terminal to its root.

Use **Local working tree** to test the repository package or **npm latest** to verify the current release. Use **CLI source-copy** to exercise `sivir init` and `sivir add`, or **Package imports** to install `@sivir-ui/svelte` into the consumer.
