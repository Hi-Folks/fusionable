# Fusionable

<p align=center>
    <i>
    **Fusionable** is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format
    </i>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/Hi-Folks/fusionable/refs/heads/main/fusionable-cover.png" alt="Fusionable is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format">
</p>

**Fusionable** is a JavaScript/TypeScript library designed for developers who work with Markdown as a content storage format. It provides a powerful and flexible API to parse, filter, and manage collections of Markdown files based on their metadata (frontmatter). With Fusionable, you can easily treat Markdown files as structured content collections, enabling efficient filtering, sorting, and retrieval for various applications, from documentation systems to content-driven websites.

## Why Fusionable?
Markdown is widely used for creating structured, lightweight, and readable content. However, Markdown alone lacks the tools for organizing, filtering, and retrieving files based on specific criteria—features that are essential for scaling projects or building complex content management workflows. Fusionable bridges this gap by adding structure and manageability to Markdown collections, so developers can take advantage of the following:

- Metadata-driven Organization: Fusionable reads the **frontmatter** (YAML metadata) in each Markdown file, making it easy to filter, sort, and group content collections based on properties like tags, categories, publish dates, or any custom fields.
- Content Management as Code: By treating Markdown files as structured data, Fusionable allows developers to use their Markdown files as a content database, with programmatic access for creating dynamic websites, static site generators, or custom documentation tools.
- Enhanced Content Retrieval: Fusionable simplifies accessing Markdown content collections with a fluent API, so you can filter, sort, and retrieve content effortlessly, all in one place.
- Flexibility and Extensibility: Fusionable’s API is built with flexibility in mind, supporting various filtering and sorting operations on Markdown collections, and making it an ideal tool for use in Node.js environments or other content pipelines.

## What is Fusionable?
Fusionable is a library that allows you to organize, filter, and query **collections of Markdown files**. It leverages frontmatter metadata in each file, enabling you to:

- Parse and extract content from Markdown files.
- Retrieve files or collections based on metadata fields.
- Sort and filter content collections dynamically with a fluent API.
- Use Markdown files as a structured content source for building dynamic content applications.

With Fusionable, Markdown files become more than simple documents; they become manageable, queryable data sources.

Example use cases for Fusionable

- Content-driven Websites: Manage and retrieve blog posts, news articles, or other structured content stored in Markdown format.
- Static Site Generation: Integrate Fusionable in static site generators to filter and sort Markdown content dynamically.
- Documentation Systems: Organize documentation sections by metadata like tags, dates, or custom categories.

## How to use Fusionable

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
