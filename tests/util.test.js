import {
  getFilenameFromPath,
  getFilenameNoExtensionFromPath,
} from '../src/FusionUtil';
import { expect, test } from 'bun:test';

test('getFilenameFromPath', () => {
  expect(getFilenameFromPath('src/content/test.md')).toBe('test.md');
});

test('getFilenameNoExtensionFromPath', () => {
  expect(getFilenameNoExtensionFromPath('src/content/test.md')).toBe('test');
});
