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

```bash
$ listal-bot -h

listal-bot

  Download all images from listal page.

Usage

  Usage listal-bot -u <url> -o <dir> [options]

  Options -u and -o are required.

Options

  -u, --url <url|name>              listal url to download (e.g. http://www.listal.com/<name>), or simply <name>
  -o, --output <dir>                output directory (will be created if does not exist)
  -a, --append-name                 append name extracted from url to output directory
  -l, --limit-to                    download only from single page (-l 5), range of pages (-l 3:6), from page to
                                    the end (-l 7:) or from the start to page (-l :12)
  -x, --overwrite                   overwrite existing files (by default only new files are downloaded)
  -h, --help                        show this help
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

### Re-downloading already downloaded images

By default program skips images that you already have in specified directory.
Add `-x` argument to force redownload all images and overwrite existing ones.

Example:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -x
Downloading all images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

### Automatically creating subdirectories

By default `listal-bot` downloads images directly into the directory specified
with `-o` option, but you can ask it to create subdirectory based on name extracted
from listal url. Use `-a` option to do that:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./my-picture-collection -a
Created destination directory ./my-picture-collection/marilyn-monroe
Downloading new images of "marilyn-monroe"
 15% [=====>                         ] Done 1113 of 7418 (errors: 0)
```

### Downloading only specified pages

By default `listal-bot` examines all the numbered pages that belong to given subject page.
If you want to download images only from given subset of pages, use `-l` option, which
allows to specify single page, or range of pages.

Examples:

To download only most recent images (from first 5 pages):

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -l :5
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 20% [======>                        ] Done 20 of 100 (errors: 0)
```

To download only oldest images:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -l 370:
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 59% [==================>            ] Done 22 of 37 (errors: 0)
```

To download images only from one specific page:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -l 17
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 75% [=======================>       ] Done 15 of 20 (errors: 0)
```

Or from specific range of pages:

```bash
$ listal-bot -u http://www.listal.com/marilyn-monroe -o ./mm-pictures -l 17:21
Created destination directory ./mm-pictures
Downloading new images of "marilyn-monroe"
 29% [=========>                     ] Done 29 of 100 (errors: 0)
```

Note that only one page range can be specified. You can download more images by running
the program multiple times with different `-l` parameter values.

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
