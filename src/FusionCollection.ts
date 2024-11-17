import MarkdownParser from './MarkdownParser';
import FusionItem from './FusionItem';
import type { FusionFieldsType, FusionItemType } from './FusionItem';

import { readdirSync, statSync, readFileSync } from 'fs';

import path from 'path';

export type FusionSortType = {
  field: string;
  direction: string;
};
export type FusionFilterType = {
  field: string;
  operator: string;
  value: any;
};

export enum OperatorEnum {
  EQUALS = '===',
  EQUALS_LIGHT = '==',
  NOT_EQUALS = '!==',
  NOT_EQUALS_LIGHT = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
}

class FusionCollection {
  private items: FusionItem[] = [];

  private filters: FusionFilterType[] = [];
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

  /**
   * Adds a filter condition to the collection based on a specified field and value.
   *
   * @param {Object} criteria - An object with a single key-value pair specifying the field and value to filter by.
   * @returns {FusionCollection} The current instance for chaining.
   */
  where(criteria: any): FusionCollection {
    const filter: FusionFilterType = {
      field: Object.keys(criteria)[0],
      operator: OperatorEnum.EQUALS,
      value: Object.values(criteria)[0],
    };
    this.filters.push(filter);
    return this;
  }

  /**
   * Adds a filter condition to the collection to narrow down results based on a specified field, operator, and value.
   *
   * @param {string} field - The field to apply the filter on.
   * @param {OperatorEnum} [operator=OperatorEnum.EQUALS] - The comparison operator to use. Defaults to strict equality (`===`).
   *   Supported operators include `OperatorEnum.EQUALS`, `OperatorEnum.NOT_EQUALS`, `OperatorEnum.GREATER_THAN`, `OperatorEnum.LESS_THAN`,
   *   `OperatorEnum.GREATER_THAN_OR_EQUAL`, and `OperatorEnum.LESS_THAN_OR_EQUAL`.
   * @param {any} [value=true] - The value to compare the field against. Defaults to `true`.
   * @returns {FusionCollection} The current FusionCollection instance, allowing for chainable method calls.
   *
   * @example
   * // Filter items where "status" is "active"
   * collection.filter("status", OperatorEnum.EQUALS, "active");
   *
   * @example
   * // Filter items where "age" is greater than 18
   * collection.filter("age", OperatorEnum.GREATER_THAN, 18);
   *
   * @example
   * // Filter items where "highlight" is true (default operator and value)
   * collection.filter("highlight");
   */
  filter(
    field: string,
    operator?: OperatorEnum,
    value?: any,
  ): FusionCollection {
    if (typeof operator === 'undefined') {
      operator = OperatorEnum.EQUALS;
    }
    if (typeof value === 'undefined') {
      value = true;
    }
    const filter: FusionFilterType = {
      field: field,
      operator: String(operator),
      value: value,
    };
    this.filters.push(filter);
    return this;
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

  /**
   * Applies all stored filters, sorting, and limit constraints, returning a new filtered collection.
   *
   * @returns {FusionCollection} A new FusionCollection instance containing the processed items.
   *
   * @description
   * This method processes the collection by:
   * 1. Applying all added filters to include only items that meet all conditions.
   * 2. Sorting the items based on a specified field and direction, if provided.
   * 3. Limiting the number of items to the specified maximum.
   */
  get(): FusionCollection {
    let items = Array.from(this.items);

    if (this.filters.length > 0) {
      items = items.filter((file) =>
        this.filters.every((filter) => {
          const fieldValue = file.getField(filter.field);
          const filterValue = filter.value;

          // Apply the operator specified in the filter
          switch (filter.operator) {
            case OperatorEnum.EQUALS:
              return fieldValue === filterValue;
            case OperatorEnum.EQUALS_LIGHT:
              return fieldValue == filterValue;
            case OperatorEnum.GREATER_THAN:
              return fieldValue > filterValue;
            case OperatorEnum.LESS_THAN:
              return fieldValue < filterValue;
            case OperatorEnum.GREATER_THAN_OR_EQUAL:
              return fieldValue >= filterValue;
            case OperatorEnum.LESS_THAN_OR_EQUAL:
              return fieldValue <= filterValue;
            case OperatorEnum.NOT_EQUALS_LIGHT:
              return fieldValue != filterValue;
            case OperatorEnum.NOT_EQUALS:
              return fieldValue !== filterValue;
            default:
              console.warn(`Unsupported operator: ${filter.operator}`);
              return false; // Return false for unsupported operators
          }
        }),
      );
    }

    if (this.sortParam !== null) {
      items = [...items].sort((a, b) => {
        const aField = a.getField(this.sortParam?.field);
        const bField = b.getField(this.sortParam?.field);

        if (aField === undefined || bField === undefined) {
          return 0;
        }

        if (aField < bField) {
          return this.sortParam?.direction === 'asc' ? -1 : 1;
        }
        if (aField > bField) {
          return this.sortParam?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

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

  /**
   * Retrieves an array of raw item data from the collection.
   *
   * @returns {any[]} An array containing the raw data of each item in the collection.
   *
   * @description
   * Iterates through each item in the collection, extracting and returning
   * the raw data for each item as an array. Uses `getItem()` on each element to retrieve its data.
   */
  getItemsArray(): any[] {
    const retVal: any[] = [];
    this.getItems().forEach((element) => {
      retVal.push(element.getItem());
    });
    return retVal;
  }

  /**
   * Retrieves an array of metadata for each item in the collection.
   *
   * @returns {any[]} An array containing the metadata of each item in the collection.
   *
   * @description
   * For each item in the collection, creates a new `FusionItem` containing
   * the item's fields and source information. The metadata for each item is then retrieved
   * using `getItem()` and added to an array, which is returned.
   * You can use getMetadataArray instead of getItemsArray when you
   * just need the metadata (the frontmatter) for saving Bytes.
   */
  getMetadataArray(): any[] {
    const retVal: any[] = [];
    this.getItems().forEach((element) => {
      const meta = new FusionItem();
      meta.set(element.getFields(), '', element.getSource());
      retVal.push(meta.getItem());
    });
    return retVal;
  }

  /**
   * Retrieves a single item from the collection by its slug.
   *
   * @param {string} slug - The unique slug identifier for the item to retrieve.
   * @returns {FusionItem | null} The item matching the slug, or `null` if no match is found.
   */
  getOneBySlug(slug: string): FusionItem | null {
    // Find the first item where the slug matches
    const item = this.items.find(
      (element) => element.getField('slug') === slug,
    );
    return item || null;
  }

  /**
   * Retrieves a single item from the collection by its filename.
   *
   * @param {string} filename - The filename for the item to retrieve (for example `post-1.md`).
   * @returns {FusionItem | null} The item matching the filename, or `null` if no match is found.
   */
  getOneByFilename(filename: string): FusionItem | null {
    // Find the first item where the filename matches
    const item = this.items.find(
      (element) => element.getSource().split('/').reverse()[0] === filename,
    );
    return item || null;
  }
}

export default FusionCollection;
