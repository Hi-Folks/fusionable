import { expect, test } from 'bun:test';
import FusionItem from '../src/FusionItem';
import FusionCollection, { OperatorEnum } from '../src/FusionCollection';

test('Fusion Item initialized', () => {
  const f = new FusionItem();
  expect(f.getContent()).toBe('');
  expect(f.getFields()).toBeEmptyObject();
  expect(f.getField('Not exists')).toBeUndefined();
});

test('Fusion Item set', () => {
  const f = new FusionItem();
  f.set({ title: 'AAA' }, 'Hello', './test.md');
  expect(f.getContent()).toBe('Hello');
  expect(f.getField('title')).toBe('AAA');
  expect(f.getField('not exists')).toBeUndefined();
  expect(f.getSource()).toBe('./test.md');
});

test('Fusion Collection', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  expect(f.getItems()).toHaveLength(3);
  expect(f.where({ highlight: true }).getItems()).toHaveLength(1);
  expect(f.where({ highlight: true }).orderBy('date').getItems()).toHaveLength(
    1,
  );
});

test('Fusion Collection Sorting', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  expect(f.getItems()).toHaveLength(3);
  expect(f.orderBy('date').getItems()).toHaveLength(3);
  expect(f.orderBy('date').getItems()[0].getField('title')).toBe('Post Three');
  expect(f.orderBy('date', 'desc').getItems()[0].getField('title')).toBe(
    'Post Two',
  );
});

test('Fusion Collection Limiting', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  expect(f.getItems()).toHaveLength(3);
  expect(f.limit(2).getItems()).toHaveLength(2);
  expect(f.limit(1).getItems()).toHaveLength(1);
});

test('Fusion Collection getItemsArray', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  expect(f.getItemsArray()).toBeArray();
  expect(f.getItemsArray()).toHaveLength(3);
  expect(f.getItemsArray()[0]).toBeTypeOf('object');
  expect(f.getItemsArray()[0]).toHaveProperty('fields');
  expect(f.getItemsArray()[0].fields).toMatchObject({ title: 'Post One' });
});

test('Fusion Collection getMetadataArray', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  let meta = f.getMetadataArray();
  expect(meta).toBeArray();
  expect(meta).toHaveLength(3);
  expect(meta[0]).toBeTypeOf('object');
  expect(meta[0]).toHaveProperty('fields');
  expect(meta[0].fields).toMatchObject({ title: 'Post One' });
  expect(meta[0].content).toBe('');
  expect(meta[0].source).toBeString();
  expect(meta[0].source).toBe('tests/data/post-1.md');
});

test('Fusion Collection getOneBySlug', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  let item = f.getOneBySlug('post-1');
  expect(item).toBeObject();
  expect(item.getField('slug')).toBe('post-1');
  expect(item.getSource()).toBe('tests/data/post-1.md');
});

test('Fusion Collection getOneByFilename', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  let item = f.getOneByFilename('post-1.md');
  expect(item).toBeObject();
  expect(item.getField('slug')).toBe('post-1');
  expect(item.getSource()).toBe('tests/data/post-1.md');

  const item1 = new FusionCollection()
    .loadFromDir('./tests/data/')
    .getOneByFilename('post-1.md');
  expect(item1).toBeObject();
  expect(item1.getField('slug')).toBe('post-1');
  expect(item1.getSource()).toBe('tests/data/post-1.md');
});

test('Fusion Collection filter', () => {
  const f = new FusionCollection();
  f.loadFromDir('./tests/data/');
  expect(f.getItems()).toHaveLength(3);
  expect(f.filter('highlight').getItems()).toHaveLength(1);
  expect(f.orderBy('date').getItems()).toHaveLength(1);
  f.resetParams();
  expect(f.getItems()).toHaveLength(3);
  expect(
    f
      .filter('date', OperatorEnum.GREATER_THAN_OR_EQUAL, '2023-01-01')
      .getItems(),
  ).toHaveLength(2);
  expect(f.filter('highlight').getItems()).toHaveLength(1);
  f.resetParams();
  expect(f.getItems()).toHaveLength(3);
  expect(f.filter('highlight').getItems()).toHaveLength(1);
  expect(
    f
      .filter('date', OperatorEnum.GREATER_THAN_OR_EQUAL, '2023-01-01')
      .getItems(),
  ).toHaveLength(1);
});
