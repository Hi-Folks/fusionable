import {
  getFilenameFromPath,
  getFilenameNoExtensionFromPath,
} from './FusionUtil';

export type FusionFieldsType = { [key: string]: any };
export interface FusionItemType {
  fields: FusionFieldsType;
  content: string;
  source: string;
  name: string;
  filename: string;
}

class FusionItem {
  private item: FusionItemType = {
    fields: {},
    content: '',
    source: '',
    name: '',
    filename: '',
  };

  constructor() {
    this.set({}, '', '');
  }

  set(fields: FusionFieldsType, content: string, source: string): FusionItem {
    this.item = {
      fields: fields,
      content: content,
      source: source,
      name: getFilenameNoExtensionFromPath(source),
      filename: getFilenameFromPath(source),
    };
    return this;
  }

  getContent(): string {
    return this.item.content;
  }

  getSource(): string {
    return this.item.source;
  }

  getFields(): FusionFieldsType {
    return this.item.fields;
  }

  getField(fieldName: any): any {
    return this.item.fields[fieldName];
  }
  getItem(): FusionItemType {
    return this.item;
  }

  getName(): string {
    return this.item.name;
  }

  getFilename(): string {
    return this.item.filename;
  }
}
export default FusionItem;
