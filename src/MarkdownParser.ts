import matter from 'gray-matter';

import type { FusionItemType } from './FusionItem';
import {
  getFilenameFromPath,
  getFilenameNoExtensionFromPath,
} from './FusionUtil';

class MarkdownParser {
  // Load frontmatter and markdown content as string and parse frontmatter
  loadMarkdownString(fileContent: string, source: string = ''): FusionItemType {
    const res: matter.GrayMatterFile<string> = matter(fileContent);
    return {
      fields: res.data,
      content: res.content,
      source: source,
      name: getFilenameNoExtensionFromPath(source),
      filename: getFilenameFromPath(source),
    };
  }
}

export default MarkdownParser;
