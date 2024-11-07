import MarkdownParser from './MarkdownParser';
import FusionItem from './FusionItem';
import type { FusionFieldsType, FusionItemType } from './FusionItem';

import fs from 'fs';
import path from 'path';

class FusionCollection {
  private items: FusionItem[] = [];

  addFusionItem(
    fields: FusionFieldsType,
    content: string,
    source: string = '',
  ) {
    const item = new FusionItem();
    item.set(fields, content, source);
    this.items.push(item);
    return this;
  }

  setFusionItems(items: FusionItem[]) {
    this.items = items;
    return this;
  }

  addMarkdownString(
    fileContent: string,
    source: string = '',
  ): FusionCollection {
    const parser = new MarkdownParser();
    const res = parser.loadMarkdownString(fileContent, source);
    this.addFusionItem(res.fields, res.content, source);
    return this;
  }

  loadFromDir(currentPath: string, subfolders: boolean = false) {
    const items = fs.readdirSync(currentPath);
    const mdparse = new MarkdownParser();
    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        // If item is a directory, recurse if `recursive` is true
        if (subfolders) {
          this.loadFromDir(fullPath, subfolders);
        }
      } else if (path.extname(item).toLowerCase() === '.md') {
        // If item is a Markdown file, parse it
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        this.addMarkdownString(fileContent, fullPath);
      }
    });
    return this;
  }

  // where method to filter files based on frontmatter fields
  where(criteria: any): FusionCollection {
    const filteredItems = this.items.filter((file) =>
      Object.entries(criteria).every(
        ([key, value]) => file.getField(key) === value,
      ),
    );
    const result = new FusionCollection();
    result.setFusionItems(filteredItems);
    return result;
  }

  // orderBy method to sort files based on frontmatter fields
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): FusionCollection {
    const sortedFiles = [...this.items].sort((a, b) => {
      const aField = a.getField(field);
      const bField = b.getField(field);

      if (aField === undefined || bField === undefined) {
        return 0;
      }

      if (aField < bField) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aField > bField) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const result = new FusionCollection();
    result.setFusionItems(sortedFiles);
    return result;
  }

  /**
   * Limits the number of items in the collection to the specified count.
   *
   * @param {number} count - The maximum number of items to include in the returned collection.
   * @returns {FusionCollection} A new instance of FusionCollection containing up to the specified number of items.
   *
   * @example
   * const limitedCollection = collection.limit(5);
   * console.log(limitedCollection.getItems()); // Outputs an array with a maximum of 5 items
   *
   */
  limit(count: number): FusionCollection {
    const items = this.items.slice(0, count);
    const result = new FusionCollection();
    result.setFusionItems(items);
    return result;
  }

  // Get the list of files
  getItems(): FusionItem[] {
    return this.items;
  }

  // Get the list markdown data as array
  getItemsArray(): any[] {
    let retVal: any[] = [];
    this.getItems().forEach((element) => {
      retVal.push(element.getItem());
    });
    return retVal;
  }
}

export default FusionCollection;
