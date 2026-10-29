export const MAX_BUNDLE_TITLE_LENGTH = 120;

export function suggestBundleTitle(input = '', primaryTag = '') {
  const words = typeof input === 'string' ? input.trim().replace(/\s+/g, ' ') : '';
  // Short requests make recognizable names; longer requests use their main theme.
  const candidate = words && words.length <= 60 && words.split(' ').length <= 6
    ? words : typeof primaryTag === 'string' ? primaryTag.replace(/[_-]+/g, ' ').trim() : '';
  return candidate ? candidate.charAt(0).toUpperCase() + candidate.slice(1) : 'A saved moment';
}
