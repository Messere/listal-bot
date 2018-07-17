# Listal-bot

`Listal-bot` is a simple command line tool that allows to download all images
from given [Listal](http://www.listal.com) page:

```text
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

## Usage

```text
listal-bot

  Download all images from listal page.

Usage

  Usage listal-bot -u <url> -o <dir> [options]

  Options -u and -o are required.

Options

  -u, --url <url|name>         listal url to download (e.g. http://www.listal.com/<name>), or simply <name>
  -o, --output <dir>           output directory (will be created if does not exist)
  -h, --help                   show this help
  -x, --overwrite              overwrite existing files (by default only new files are downloaded)
  -t, --timeout <seconds>      image download timeout in seconds
  -c, --concurrency <number>   number of concurrent image downloads
  -r, --retries <number>       maximum number of retries after image download error

```

Arguments `-u` (url or name to download) and `-o` (output directory) are mandatory.

Example:

```bash
listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

By default program skips images that you already have in specified directory.
Add `-x` argument to force redownload all images and overwrite existing ones.

Example:

```bash
listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -x
Downloading all images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

## Installation

```bash
npm install listal-bot -g
```

## Development

Make sure you have `Node` and `npm` installed
([https://nodejs.org/](https://nodejs.org/))

Download the code and install dependencies

```bash
git clone https://github.com/Messere/listal-bot.git
cd listal-bot
npm install
```

`Listal-bot` is written in [TypeScript](https://www.typescriptlang.org/), for all your
hacking pleasures.

To compile the code run

```bash
npm run compile
```

To check if your code is clean and conforming to standards, run

```bash
npm run lint
```

To run automated testsuite (written with the help of
[Jasmine](https://jasmine.github.io/) testing framework), run

```bash
npm run test
```
