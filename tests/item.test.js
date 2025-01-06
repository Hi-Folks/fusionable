import { expect, test } from 'bun:test';
import FusionItem from '../src/FusionItem';

test('Fusion Item set', () => {
  const f = new FusionItem();
  f.set({ title: 'AAA' }, 'Hello', './test.md');
  expect(f.getContent()).toBe('Hello');
  expect(f.getField('title')).toBe('AAA');
  expect(f.getField('not exists')).toBeUndefined();
  expect(f.getSource()).toBe('./test.md');
  expect(f.getName()).toBe('test');
  expect(f.getFilename()).toBe('test.md');

  f.set({ title: 'AAA' }, 'Hello', './something/test.test.md');
  expect(f.getContent()).toBe('Hello');
  expect(f.getField('title')).toBe('AAA');
  expect(f.getField('not exists')).toBeUndefined();
  expect(f.getSource()).toBe('./something/test.test.md');
  expect(f.getName()).toBe('test.test');
  expect(f.getFilename()).toBe('test.test.md');
});
