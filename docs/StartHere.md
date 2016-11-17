# @tidepool/viz developer guide

This repository, which is published to [npm](https://www.npmjs.com/ 'node package manager') as [@tidepool/viz](https://www.npmjs.com/package/@tidepool/viz 'npm: @tidepool/viz') is a library providing data visualization components and state management tools for use in [blip](https://github.com/tidepool-org/blip 'GitHub: blip'), Tidepool's main web application for people with type 1 diabetes and their care teams to view and contextualize (via notes) the PwD's diabetes device data.

As you're getting ready to develop code in this repository, we recommend starting with the following documents:

- [project background]('./Background.md')
- [overview of features]('./FeatureOverview.md')
- [planned architecture]('./Architecture.md')
- [directory structure]('./DirectoryStructure.md')

The root-level [README]('../README.md') contains the nuts & bolts of installing, configuring, and commands to accomplish various tasks.

## Dependencies

We use [webpack](https://webpack.github.io/ 'webpack module bundler') to bundle the JavaScript, CSS, and JSON assets in this repository into a single JavaScript bundle from which blip can import the pieces (components, functions, etc.) needed.

Some of the other dependencies we leverage in this repository are, like webpack, commonly used by many others building apps today with React, and some are a bit more unusual:

- [D3](https://d3js.org/ 'D3: Data-Driven Documents') ([read more]('./D3.md'))
- [react-motion](https://github.com/chenglou/react-motion 'GitHub: react-motion') (see [D3 usage](./D3.md))
- [webpack](https://webpack.github.io/ 'webpack module bundler') ([read more]('./Webpack.md'))

Follow the "read more" link where available in this list of tools to learn more about the specifics of our usage of the tool at Tidepool.