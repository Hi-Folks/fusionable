import { expect, test } from 'bun:test';

import FusionCollection from '../src/FusionCollection';

test('Fusion Collection no frontmatter', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/no-frontmatter');
  expect(f.getItems()).toHaveLength(3);
  let filename = 'post-1.md';
  let post = f.getOneByFilename(filename);

  expect(post).toBeTypeOf('object');
  expect(post.getContent()).toBeString();
  expect(post.getSource()).toBeString();
  expect(post.getSource()).toInclude('post-');
  expect(post.getSource()).toBe('tests/data/no-frontmatter/post-1.md');
});
