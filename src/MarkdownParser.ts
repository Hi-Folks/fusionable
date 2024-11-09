import matter from 'gray-matter';

import type { FusionItemType } from './FusionItem';

type FrontmatterFields = Array<any>;

interface MarkdownFile {
  fields: Record<string, FrontmatterFields>;
  content: string;
  source: string;
}

class MarkdownParser {
  // Load files and parse frontmatter
  loadMarkdownString(fileContent: string, source: string = ''): FusionItemType {
    const res: any = matter(fileContent);
    return {
      fields: res.data,
      content: res.content,
      source: source,
    };
  }
}

export default MarkdownParser;
