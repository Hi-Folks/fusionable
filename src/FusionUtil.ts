export function getFilenameFromPath(path: string) {
  return path.split('/').reverse()[0];
}

export function getFilenameNoExtensionFromPath(path: string) {
  const filename = getFilenameFromPath(path);
  if (typeof filename !== 'string') {
    throw new Error('Input must be a string (getFilenameNoExtensionFromPath)');
  }

  const lastDotIndex = filename.lastIndexOf('.');

  // If there's no dot or the dot is at the start, return the filename as-is
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename;
  }

  return filename.slice(0, lastDotIndex);
}
