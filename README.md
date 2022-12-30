# get-gradle-versions

[![actions-workflow-test][actions-workflow-test-badge]][actions-workflow-test]
[![release][release-badge]][release]
[![license][license-badge]][license]

This is a simple GitHub Action to query the Gradle services API for latest version information.

This is an expansion of some existing logic to automatically test Gradle plugins against upcoming RC builds, isolated in order to be easily reusable.


## Inputs

| NAME          | DESCRIPTION                                                    | TYPE      | REQUIRED | DEFAULT  |
|---------------|----------------------------------------------------------------|-----------|----------|----------|
| `debug`       | Whether to enable extra debug logging                          | `boolean` | `false`  | `false`  |
| `override`    | A version ID to override the computed latest version           | `string`  | `false`  | `N/A`    |
| `output_file` | File to output extra Gradle version to, in mammoth-test format | `string`  | `false`  | *(none)* |

## Outputs

| NAME                   | DESCRIPTION                                                          | TYPE     |
|------------------------|----------------------------------------------------------------------|----------|
| `latest_rc_or_nightly` | The latest RC (if present) or nightly (otherwise), can be overridde. | `string` |
| `release`              | The latest release, or blank if none is published.                   | `string` |
| `nightly`              | The latest nightly, or blank if none is published.                   | `string` |
| `rc`                   | The latest release candidate, or blank if none is published.         | `string` |
| `release_nightly`      | The latest release-nightly, or blank if none is published.           | `string` |

## Contributing

As this is a Javascript action, it is subject to the quirks enforced on GitHub. Development should be done on Node 16 or later. Any text editor works, but we tend to use VS Code.

To set up a development environment:

1. Clone this repository
2. Install Node v16 or later
3. (if the `yarn` command is not available), run `corepack enable`
4. Fetch dependencies by running `yarn install`
5. Open the project in VS Code: `code .` (or your choice of editor). The source to edit is in `src/`

After making changes, run `yarn build` to compile the TS source, producing the final `dist/index.js` file that Actions actually reads. Yes, for some reason GitHub makes us commit this file to the repository. A CI check will ensure that this step has been done when pull requests are published.

### Making a release

Simply create a release based on a tag with the format vMAJOR.MINOR.PATCH (all 3 elements are required). An Actions workflow will automatically run to update the alias tags of vMAJOR and vMAJOR.MINOR.


## License

Copyright 2022 KyoriPowered <https://kyori.net>

Get Gradle Version is released under the [GNU Lesser General Public License version 3.0](./COPYING.LESSER).

```
Copyright (c) 2022 KyoriPowered and contributors
This file is part of get-gradle-version.

get-gradle-version is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

get-gradle-version is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with get-gradle-version.  If not, see <https://www.gnu.org/licenses/>.
```

<!-- badge links -->

[actions-workflow-test]: https://github.com/KyoriPowered/get-gradle-version/actions?query=workflow%3ATest
[actions-workflow-test-badge]: https://img.shields.io/github/workflow/status/KyoriPowered/get-gradle-version/Test?label=Test&style=for-the-badge&logo=github

[release]: https://github.com/KyoriPowered/get-gradle-version/releases
[release-badge]: https://img.shields.io/github/v/release/KyoriPowered/get-gradle-version?style=for-the-badge&logo=github

[license]: COPYING.LESSER
[license-badge]: https://img.shields.io/github/license/KyoriPowered/get-gradle-version?style=for-the-badge
