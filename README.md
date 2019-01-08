# angularjs-dev-toolbar
A modular developer toolbar and toolset for angularjs apps.

## Development

### Quickstart

Run `yarn start` and add the following bookmarklet:

```js
javascript:(function(){const a=window.NgDevTools;if('object'!=typeof a||null===a){const b=document.createElement('SCRIPT');b.type='text/javascript',b.src='http://localhost:9000/bundle.js',b.addEventListener('error',()=>alert('An error occurred loading the bookmarklet'),!1),document.head.appendChild(b)}})();
```

Ensure your `settings.js` uses the correct angular module name. You'll then be able to load your app, click the bookmarklet and load the toolbar.

### Build

Run `yarn build` and host the `/dist` folder or the `bundle.js` file directly. The bookmarklet files in the root of this repo are currently set up to load a file at `http://example.com/path/to/bundle.js`.

### A bit of detail

The toolbar is made up of two features, visual **modules** shown on the toolbar and a CLI-like collection of **utilities**.

#### Modules

Each module is a class which:

- Takes a `name` parameter in its constructor
- Specifies a Vue.js component using the given `name` parameter
- Optionally sets a `name` property using the `name` parameter

To add a module:

- Create a new module file in `src/modules`
	- For the most success, your template should wrap your module in a div with class `toolbar-module`
- Import the module into src/modules/index.js
- Add the module with a name to the exported object

Modules can render differently dependent on the mode the toolbar is running in. You can access the mode via `$root.mode` in a Vue template, and you can find the recognised modes in the [documentation](#documentation). Note that `dynamic` is not a distinct mode, and instead switched between `full` and `compact` modes on mouse hover. The `mini` mode is automatically activated when a modal is shown to ensure action buttons aren't covered

Modules may also render the full width of the screen when in `full-mode`. Use the css class `full-width` on your `toolbar-module` wrapper.

#### Utilities

Utilities are static methods of the Util class, exposed via a global object when the toolbar has loaded.

To add a utility, add a static method to the Util class in `src/Util.js`. Utilities can also be imported by the rest of the toolbar to allow for dependency injection from your angular app. See [Util Documentation](#util-methods) for more info.

## Documentation

The toolbar exposes a global `NgDevTools` variable. This provides access to the utilities as listed below via `NgDevTools.util` and access to the internals of the toolbar via `NgDevTools.toolbar`.

The toolbar has several modes it can render in:

- `full` - Full information, two lines per module, full width
- `compact` - Headline information, one line per module, all condensed
- `dynamic` - The same as `compact` unless hovered, when `full` will be applied
- `mini` - Brief information, one line per module, few or no words. Automatically activated when modals are shown
- `hidden` - Displays nothing at all, useful to capture a screenshot for non-techy use

### Available modules

- **Log**: Monkey patches `$log.debug` and captures all debug messages
- **UIRouter**: Displays the current state rendered, the component rendered by that state and the module it lives in. UIRouter only
- **CssDebug**: Loads the [debucsser](https://github.com/lucagez/Debucsser) helper tool for easier UI debugging

Other app specific modules I've built at work: Access control information, current user information, data entity information

You may access module data exposed by the module class via `NgDevTools.toolbar.modules`

### Available utilities

- `isPlatform()`: Returns a boolean as to whether or not the current page has an angular application with a module that matches the `appName` property in `settings.js`
- `$inject(moduleName, exposeToWindow)`: Returns an angular module from angular's dependency injection system. If `exposeToWindow` is `true`, the module will be made available globally via the `window` object. Injections are cached after the first injection.
- `loadAsset(type, url, appentTo)`: Load a JS file or CSS file from a URL and append it to the DOM. `type` is `js` or `css`, `appendTo` must be an `HTMLElement`
- `modal(title, content, scopeItems, buttons)`: Spawns a modal via your angular app. Assumes you're using `$uibModal`.
	- `content` is an inline HTML angular template, `scopeItems` is an object passed to the template, `buttons` is an object that specifies the affirmative and negative footer actions of the modal, defaults to "OK" and "Cancel" respectively
- `getScope(selector)`: Get the angular scope of the nearest parent component based on a selector. `selector` may be an `HTMLElement`, jQuery object, CSS selector or angular component name.
- `toJSON(data, space)`: A safe JSON stringifier that will omit previously seen object references to guard against recursive structures, `space` defaults to `2`
- `stalk(root, path)`: Attempts to find where a function is being called from via some hacky monkey patching and stack tracing. Useful if you're unsure what's calling a service method for example.
- `$state`: A getter for UIRouter's `$state` module
- `$rootScope`: A getter for Angular's `$rootScope` object
- `pageScope`: A getter for the component current being rendered by UIRouter's `ui-view` directive
- `scopes`: A getter that returns an object containing all currently rendered angular components and directives for easy scope access. **Production mode must be turned off**