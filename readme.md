# Listal-bot

`Listal-bot` is a simple command line tool that allows to download all images
from given [Listal](http://www.listal.com) page:

```text
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

## Installation

Make sure you have `Node` and `npm` installed.
([https://nodejs.org/](https://nodejs.org/))

Latest version is published to npm repository, install it using

```bash
npm install listal-bot -g
```

## Usage

```text
listal-bot

  Download all images from listal page.

Usage

  Usage listal-bot -u <url> -o <dir> [options]

  Options -u and -o are required.

Options

  -u, --url <url|name>              listal url to download (e.g. http://www.listal.com/<name>), or simply <name>
  -o, --output <dir>                output directory (will be created if does not exist)
  -a, --append-name                 append name extracted from url to output directory
  -h, --help                        show this help
  -x, --overwrite                   overwrite existing files (by default only new files are downloaded)
  -t, --timeout <seconds>           image download timeout in seconds (default: 10)
  -c, --concurrency <number>        number of concurrent image downloads (default: 15)
  -p, --page-concurrency <number>   number of concurrent page downloads (default: 5)
  -r, --retries <number>            maximum number of retries after image download error (default: 5)

```

Arguments `-u` (url or name to download) and `-o` (output directory) are mandatory.

Example:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

By default program skips images that you already have in specified directory.
Add `-x` argument to force redownload all images and overwrite existing ones.

Example:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -x
Downloading all images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

By default `listal-bot` downloads images directly into the directory specified
with `-o` option, but you can ask it to create subdirectory based on name extracted
from listal url. Use `-a` option to do that:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./my-picture-collection -a
Created destination directory ./my-picture-collection/marilyn-monroe
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

## Development

Download the code and install dependencies

```bash
git clone https://github.com/Messere/listal-bot.git
cd listal-bot
npm install
```

`Listal-bot` is written in [TypeScript](https://www.typescriptlang.org/), for all your
hacking pleasures.

To compile the code, run

```bash
npm run compile
```

After that, main executable javascript is `dist/index.js`.

To check if your code is clean and conforming to standards, run

```bash
npm run lint
```

To run automated testsuite (written with the help of
[Jasmine](https://jasmine.github.io/) testing framework), run

```bash
npm test
```
