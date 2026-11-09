export const supportedLocales = ['ru', 'en', 'it'];
export function resolveLocale({ search = '', languages, language, pathname = '' } = {}) {
  const explicit = new URLSearchParams(search).get('lang');
  if (supportedLocales.includes(explicit)) return explicit;
  const pageLocale = pathname.match(/\/(ru|en|it)\.html$/)?.[1];
  if (pageLocale) return pageLocale;
  const preferences = Array.isArray(languages) && languages.length ? languages : [language];
  for (const preference of preferences) {
    const primary = typeof preference === 'string' ? preference.toLowerCase().split(/[-_]/)[0] : '';
    if (supportedLocales.includes(primary)) return primary;
  }
  return 'ru';
}
export function localizedUrl(href, locale) {
  const hashAt = href.indexOf('#');
  const hash = hashAt < 0 ? '' : href.slice(hashAt);
  const pathQuery = hashAt < 0 ? href : href.slice(0, hashAt);
  const queryAt = pathQuery.indexOf('?');
  const path = queryAt < 0 ? pathQuery : pathQuery.slice(0, queryAt);
  const query = new URLSearchParams(queryAt < 0 ? '' : pathQuery.slice(queryAt + 1));
  query.set('lang', supportedLocales.includes(locale) ? locale : 'ru');
  return `${path}?${query}${hash}`;
}
export function translate(dictionary, key, ...values) {
  const text = dictionary.ui[key];
  if (text === undefined) throw new Error(`Missing translation: ${key}`);
  return text.replace(/\{(\d+)\}/g, (_, index) => String(values[index] ?? ''));
}
