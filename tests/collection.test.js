import { expect, test } from 'bun:test';
import FusionItem from '../src/FusionItem';
import FusionCollection from '../src/FusionCollection';

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
