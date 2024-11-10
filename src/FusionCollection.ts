import MarkdownParser from './MarkdownParser';
import FusionItem from './FusionItem';
import type { FusionFieldsType, FusionItemType } from './FusionItem';

import { readdirSync, statSync, readFileSync } from 'fs';

import path from 'path';

export type FusionSortType = {
  field: string;
  direction: string;
};

class FusionCollection {
  private items: FusionItem[] = [];

  private filters: any[] = [];
  private sortParam: FusionSortType | null = null;
  private howmany: number = -1;

  resetParams() {
    this.filters = [];
    this.sortParam = null;
    this.howmany = -1;
  }

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
    const items = readdirSync(currentPath);
    const mdparse = new MarkdownParser();
    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        // If item is a directory, recurse if `recursive` is true
        if (subfolders) {
          this.loadFromDir(fullPath, subfolders);
        }
      } else if (path.extname(item).toLowerCase() === '.md') {
        // If item is a Markdown file, parse it
        const fileContent = readFileSync(fullPath, 'utf-8');
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

  /**
   * Specifies the field and direction for sorting the collection.
   *
   * @param {string} field - The name of the field to sort by.
   * @param {'asc' | 'desc'} [direction='asc'] - The sort direction, either 'asc' for ascending or 'desc' for descending.
   * @returns {FusionCollection} The current instance for chaining.
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): FusionCollection {
    this.sortParam = {
      field: field,
      direction: direction,
    };
    return this;
  }

  /**
   * Set the limits the number of items in the collection to the specified count.
   *
   * @param {number} count - The maximum number of items to include in the returned collection.
   * @returns {FusionCollection} The instance of FusionCollection with the limit set.
   *
   * @example
   * const limitedCollection = collection.limit(5);
   * console.log(limitedCollection.getItems()); // Outputs an array with a maximum of 5 items
   *
   */
  limit(count: number): FusionCollection {
    this.howmany = count;
    return this;
  }

  get(): FusionCollection {
    let items = Array.from(this.items);

    // ------ SORTING
    if (this.sortParam !== null) {
      items = [...items].sort((a, b) => {
        const aField = a.getField(this.sortParam.field);
        const bField = b.getField(this.sortParam.field);

        if (aField === undefined || bField === undefined) {
          return 0;
        }

        if (aField < bField) {
          return this.sortParam.direction === 'asc' ? -1 : 1;
        }
        if (aField > bField) {
          return this.sortParam.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // ======= END SORTING

    if (this.howmany >= 0) {
      items = items.slice(0, this.howmany);
    }
    const resultFusionCollection = new FusionCollection();
    resultFusionCollection.setFusionItems(items);
    return resultFusionCollection;
  }

  // Get the list of files
  getItems(): FusionItem[] {
    return this.get().items;
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
