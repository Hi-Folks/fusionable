import FusionCollection from './src/FusionCollection';
import MarkdownParser  from './src/MarkdownParser';

// Assume we have some Markdown content with frontmatter
const fileContent1 = `---
title: "Post One"
date: "2023-01-01"
tags: ["typescript", "markdown"]
---
Content of the first post.`;

const fileContent2 = `---
title: "Post Two"
date: "2023-02-01"
tags: ["typescript", "tutorial"]
---
Content of the second post.`;

// Initialize the parser and load files
const collection = new FusionCollection();
collection.addMarkdownString(fileContent1);
collection.addMarkdownString(fileContent2);

// Filter where title is "Post One"
const filtered = collection.where({ title: "Post One" });
console.log("Filtered files:", filtered.getItems());

// Sort by date in descending order
const sorted = collection.orderBy("date", "desc");
console.log("Sorted files:", sorted.getItems());


const collectionDir = new FusionCollection();
collectionDir.loadFromDir("./tests/data");
const filteredDir = collectionDir.where({ title: "Post One" }).orderBy("date", "desc");
console.log("Filtered files:", filteredDir.getItems());
