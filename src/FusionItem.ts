export type FusionFieldsType = Array<any>;
export interface FusionItemType {
  fields: FusionFieldsType;
  content: string;
  source: string;
}

class FusionItem {
  private item: FusionItemType = {
    fields: [],
    content: '',
    source: '',
  };

  constructor() {
    this.set([], '', '');
  }

  set(fields: FusionFieldsType, content: string, source: string): FusionItem {
    this.item = {
      fields: fields,
      content: content,
      source: source,
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

  getField(fieldName: any): FusionFieldsType {
    return this.item.fields[fieldName];
  }
  getItem() {
    return this.item;
  }
}
export default FusionItem;
