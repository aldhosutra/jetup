# Jetup

Jetup: JavaScript Project Setup! Jetting-up your next JS project in seconds with one command, using fully modular, customizable presets, instantly ready to code!

### Usage

Scaffold a new project in the current directory using the default preset:

```sh
npx jetup
```

Scaffold a new project `my-app` with preset `ts`:

```sh
npx jetup my-app ts
```

Use a custom config file:

```sh
npx jetup -c ./myconfig.json
```

All available arguments and options:

```
jetup [options] [location] [preset]

Arguments:
  location               Project location (default: current directory) (default: ".")
  preset                 Jetup preset to use (default: "ts") (default: "ts")

Options:
  -V, --version          output the version number
  --preset <presetName>  Override preset to use
  -c, --config <path>    Path to config file (env: JETUP_CONFIG)
  -h, --help             display help for command
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/aldhosutra/jetup)
- [Documentation](https://jetup.js.org)
- [Report Issues](https://github.com/aldhosutra/jetup/issues)
