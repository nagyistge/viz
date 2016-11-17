[![Build Status](https://img.shields.io/travis/tidepool-org/viz/master.svg)](https://travis-ci.org/tidepool-org/viz)

# @tidepool/viz

Tidepool data visualization for diabetes device data.

## Getting started

After cloning this repository to your local machine, first make sure that you have a version of `npm` that is recent enough - at least `3.x`. We are still using node `0.12.x` for our engine, and a `3.x` version of `npm` does **not** get installed by default if you are installing node `0.12.x` through a mechanism like [`nvm`](https://github.com/creationix/nvm 'nvm'). In this case, you will need to manually update with:

```bash
$ npm install -g npm
```

Then, install the dependencies:

```bash
$ npm install
```

## Development

### Running locally with blip

To work on code in this repository within [blip](https://github.com/tidepool-org/blip 'Tidepool on GitHub: blip'), first do the following from your local blip repository (assuming blip/ and viz/ are sister directories):

```bash
$ npm link ../viz/
```

Then in this viz/ directory, remove your copy of React (because it expects to be a singleton and configuring webpack to dedupe multiple locations from which React is `require`ed or `import`ed thus far has eluded us):

```bash
$ rm -rf node_modules/react/
```

NB: If you're also making changes in tideline and thus also `npm link`-ing tideline into blip locally, you'll need to do the same deletion of React from *tideline's* node modules. @jebeck now does both deletions from the blip repo like so, in order not to forget to do both:

```bash
$ rm -rf ../viz/node_modules/react/
$ rm -rf ../tideline/node_modules/react/
```

And finally, start the build in watch mode:

```bash
$ npm start
```

### Running locally with React Storybook

If you're working at the component or view level outside of blip, you can work on component and view rendering code with [React Storybook](https://github.com/kadirahq/react-storybook 'GitHub: react-storybook'). Just start up the storybook with:

```bash
$ npm run storybook
```

### Running the tests

To run the unit tests in [PhantomJS](http://phantomjs.org/ 'PhantomJS') (as they run on [Travis CI](https://travis-ci.org/ 'Travis CI')):

```bash
$ npm test
```

To have the tests run continuously with source and test code changes rebundled as you work:

```bash
$ npm run karma-watch
```

To run the unit tests in your local Chrome browser (recommended for Tidepool developers before merging or publishing a release):

```bash
$ npm run browser-tests
```

### Running the linter

To run the code linter from the command line:

```bash
$ npm run lint
```

## Production

### Publishing examples to GitHub Pages with React Storybook

Coming soon!

### Building and publishing to `npm`

When a new feature(s) is/are complete (i.e., reviewed with a sign-off from another developer), it's time to publish the package to npm! Since this is one of our most recently created repositories, any member of the "developers" team in the `@tidepool` npm organization will be able to publish the package using his or her npm login. Steps to publishing are as follows:

1. create a tag on the approved pull request using the `mversion` tool with the `-m` option to auto-commit the version bump and tag (e.g., `$ mversion patch -m` for a patch version bump)
1. push the new commit and tag to the GitHub remote with `$ git push origin <branch-name>` and `$ git push origin --tags`
1. check that the tag build has passed on [TravisCI](https://travis-ci.org/tidepool-org/viz)
1. `$ npm whoami` to check if you are logged in as yourself; if you are, skip to 8.
1. if you are logged in as `tidepool-robot`, log out with `$ npm logout`
1. then log in as yourself with `$ npm login`
1. publish the new version with `$ npm publish`; before the *actual* publish happens, the linter, tests, and packaging webpack build will run since we have set those up through the `prepublish` npm hook in the package.json
1. merge the approved pull request to master
1. remember to bump the version appropriately in the package.json for the app (e.g., blip) requiring `@tidepool/viz` as a dependency!
