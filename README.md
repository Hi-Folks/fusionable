# Fusionable JS

<p align=center>
    <i>
    <strong>Fusionable JS</strong> is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format
    </i>
</p>

<p align=center>
    <a href="https://www.npmjs.com/package/fusionable">
        <img src="https://img.shields.io/npm/v/fusionable?style=for-the-badge&label=Version" alt="Latest Version on NPM"></a>
    <a href="https://www.npmjs.com/package/fusionable"
    ><img src="https://img.shields.io/npm/d18m/fusionable?style=for-the-badge" alt="Total Downloads"></a>
    <br />
    <img src="https://img.shields.io/npm/l/fusionable?style=for-the-badge" alt="Packagist License">
    <img src="https://img.shields.io/github/last-commit/hi-folks/fusionable?style=for-the-badge" alt="GitHub last commit">
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/Hi-Folks/fusionable/refs/heads/main/fusionable-cover.png" alt="Fusionable is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format">
</p>

**Fusionable** is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format. It provides a powerful and flexible API to parse, filter, and manage collections of Markdown files based on their metadata (frontmatter). With Fusionable, you can easily treat Markdown files as structured content collections, enabling efficient filtering, sorting, and retrieval for various applications, from documentation systems to content-driven websites.

> Fusionable is still under development. We have the version 0.0.*. Feel free to use it in your experiment but not for production. Based on your feedback, we are working hard to make it stable and production-ready.



An example of using Fusionable for handling Markdown content:

```javascript

let contents = new FusionCollection()
      .loadFromDir(`./src/content`) //load markdown files from a directory
      .where({ highlight: true }) // filtering
      .orderBy("date") // sorting markdown by `date` field
      .limit(3) // limiting the result
      .getItemsArray();

```

Once you read this README, you can explore more how to use Fusionable with SvelteKit, Nextjs, and Nuxt:

- **SvelteKit**: [How to Build a Content-Driven Static Site with Markdown, SvelteKit and Fusionable](https://dev.to/robertobutti/how-to-build-a-content-driven-static-site-with-markdown-sveltekit-and-fusionable-347f)
- **Next.js**: [Building a website using Markdown content with Next.js App Router and Fusionable](https://dev.to/robertobutti/building-a-website-using-markdown-content-with-nextjs-app-router-and-fusionable-4kj7)
- **Nuxt**: [Build a static website with Markdown content, using Nuxt and Fusionable (server API approach)](https://dev.to/robertobutti/build-a-static-website-with-markdown-content-using-nuxt-and-fusionable-server-api-approach-2o65)

## What is Fusionable?
Fusionable is a library that allows you to organize, filter, and query **collections of Markdown files**. It leverages frontmatter metadata in each file, enabling you to:

- Parse and extract content from Markdown files.
- Retrieve files or collections based on metadata fields.
- Sort and filter content collections dynamically with a fluent API.
- Use Markdown files as a structured content source for building dynamic content applications.

With Fusionable, Markdown files have become more than simple documents; they have become manageable, queryable data sources.

Example use cases for Fusionable

- Content-driven Websites: Manage and retrieve blog posts, news articles, or other structured content stored in Markdown format.
- Static Site Generation: Integrate Fusionable in static site generators to dynamically filter and sort Markdown content.
- Documentation Systems: Organize documentation sections by metadata like tags, dates, or custom categories.

## How to use Fusionable

To install the Fusionable JS package:

```bash
bun add fusionable
```

Or, if you are using NPM and Node, you can install it via the `npm` command:

```bash
npm i fusionable
```

Then, you can create your Markdown files, for example, in the `./src/content` directory:

```markdown
---
title: "Post One"
description: This is the first post
date: "2020-01-01"
highlight: true
tags: ["typescript", "markdown"]
cover: https://picsum.photos/seed/post-1/400/200
---
## Hello
Content of the *first post*.

```

You can parse, load, filter, and sort the content via:

```javascript
import FusionCollection from "fusionable/FusionCollection"
let contents = new FusionCollection()
      .loadFromDir(`./src/content`)
      .where({ highlight: true })
      .orderBy("date")
      .limit(3)
      .getItemsArray();
```

Or, you can simply get one content via the slug field in the Frontmatter:

```javascript
const item = new FusionCollection()
  .loadFromDir('./tests/data/')
  .getOneBySlug('post-1');
```



## FusionCollection API

The `FusionCollection` class provides a flexible, chainable API for loading, filtering, sorting, limiting, and retrieving data. Below is a breakdown of the main methods available.

### Method for loading a set of Markdown files from a directory: `loadFromDir()`

Loads content from a specified directory and initializes the collection with items found in that directory.

Parameter:
- `directoryPath` (`string`): The path to the directory from which to load content.
It returns: The `FusionCollection` instance allows for method chaining.

Example:

```javascript
// loadFromDir(directoryPath: string): FusionCollection
let collection = new FusionCollection().loadFromDir(`./src/content`);
```

### Method for filtering markdown content:  `filter()`

Adds a filter condition to refine the collection based on a specific field, comparison operator, and value.

Parameters:
- `field`: (`string`) — The field to apply the filter on.
- `operator`: (`OperatorEnum`, optional) — The comparison operator. Defaults to strict equality (`===`). Options include:
  - OperatorEnum.EQUALS (===)
  - OperatorEnum.NOT_EQUALS (!==)
  - OperatorEnum.GREATER_THAN (>)
  - OperatorEnum.LESS_THAN (<)
  - OperatorEnum.GREATER_THAN_OR_EQUAL (>=)
  - OperatorEnum.LESS_THAN_OR_EQUAL (<=)
- `value`: (`any`, optional) — The value to compare the field against. Defaults to `true`.

It returns the `FusionCollection` instance allows for method chaining.

Example:

```javascript
// Filter items where "status" is "active"
collection.filter("status", OperatorEnum.EQUALS, "active");

// Filter items where "age" is greater than 18
collection.filter("age", OperatorEnum.GREATER_THAN, 18);

// Filter items where "highlight" is true (using default operator and value)
collection.filter("highlight");

```

### Method for sorting Markdown content: `orderBy()`

Specifies the field and direction for sorting the collection.

Parameters:
- `field` (`string`): The name of the field to sort by.
- `direction` (`'asc' | 'desc'`, default `'asc'`): The sort direction, either `'asc'` for ascending or `'desc'` for descending.
It returns: The `FusionCollection` instance, allowing for method chaining.

Example:

```javascript
// orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): FusionCollection
collection.orderBy("date", "desc");
```

### Method for limiting the number of Markdown content `limit()`

Limits the number of items in the collection to the specified count.

Parameter:
- `count` (`number`): The maximum number of items to include in the collection.
It returns: The `FusionCollection` instance, allowing for method chaining.

Example:

```javascript
// limit(count: number): FusionCollection
collection.limit(3);
```

### Method for getting an array of content `getItemsArray()`

Retrieves an array of raw item data from the collection after applying any specified filters, sorting, and limits.

It returns: An array containing the raw data of each item in the collection (`any[]`).

Example:

```javascript
// getItemsArray(): any[]
let itemsArray = collection.getItemsArray();
```

### Method for getting array of metadata  `getMetadataArray()`

After applying any specified filters, sorting, and limits, retrieve an array of raw item data from the collection. The difference to `getItemsArray()` is that the `getMetadataArray()` method excludes the markdown content and includes only the metadata. This method is useful if you need only metadata.

It returns: An array containing the raw data of each item in the collection (`any[]`).

Example:

```javascript
// getMetadataArray(): any[]
let metadataArray = collection.getMetadataArray();
```


### Method for getting one element by slug  `getOneBySlug()`

Retrieves a single item from the collection by its slug.

Parameter:
- `slug` (`string`) - The unique slug identifier for the item to retrieve.

It returns: the item matching the slug, or `null` if no match is found. (`FusionItem`).

Example:

```javascript
const item = new FusionCollection()
  .loadFromDir('./tests/data/')
  .getOneBySlug('post-1');
// So, you can access to some information/content:
item.getContent(); // the markdown content
item.getFields(); // the frontmatter fields
item.getField("title"); // the title frontmatter field
```

The strong assumption here is that you have the `slug` field in your frontmatter sections, for example:

```markdown
---
title: "Post One"
slug: "post-1"
date: "2023-01-01"
tags: ["typescript", "markdown"]
---
## Hello
Content of the *first post*.
```

## Why Fusionable?

Markdown is widely used for creating structured, lightweight, and readable content. However, Markdown alone lacks the tools for organizing, filtering, and retrieving files based on specific criteria—features that are essential for scaling projects or building complex content management workflows. Fusionable bridges this gap by adding structure and manageability to Markdown collections, so developers can take advantage of the following:

- Metadata-driven Organization: Fusionable reads the **frontmatter** (YAML metadata) in each Markdown file, making it easy to filter, sort, and group content collections based on properties like tags, categories, publish dates, or any custom fields.
- Content Management as Code: By treating Markdown files as structured data, Fusionable allows developers to use them (their Markdown files) as a content database, with programmatic access for creating dynamic websites, static site generators, or custom documentation tools.
- Enhanced Content Retrieval: Fusionable simplifies accessing Markdown content collections with a fluent API, so you can filter, sort, and retrieve content effortlessly, all in one place.
- Flexibility and Extensibility: Fusionable’s API is built with flexibility in mind. It supports various filtering and sorting operations on Markdown collections, making it ideal for use with JavaScript frameworks or other content pipelines.

## Contributing

If you are interested in contributing to Fusionable, you are welcome! You could evaluate the following:

- Improve the documentation in the readme
- Write a post about Fusionable
- Contributing to the source code, fixing an issue, or implementing a new feature. For that, my suggestion is to read [the contributing file](https://github.com/Hi-Folks/fusionable/blob/main/CONTRIBUTING.md)

## References

> This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
