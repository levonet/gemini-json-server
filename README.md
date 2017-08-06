# Gemini json-server plugin

Plugin for starting up [json-server](https://github.com/typicode/json-server/) when running tests with [Gemini](https://github.com/gemini-testing/gemini)

## Installation

```sh
npm install git+https://github.com/levonet/gemini-json-server.git
```

## Configuration

Set the configuration to your `gemini` config file in `plugins` section:

```js
module.exports = {
    // ...
    system: {
        plugins: {
            'json-server': {
                enabled: true,
                port: 8080,
                host: '0.0.0.0',
                schema: 'db.json',
                routes: 'routes.json',
                static: '.',
                readOnly: false,
                quiet: false,
                id: 'id'
            }
        }
    }
};
```
