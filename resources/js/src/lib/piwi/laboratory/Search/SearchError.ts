export default class SearchError extends Error {
  constructor(public errors: Record<string, string>) {
    super('Search failed');
    this.name = 'SearchError';

    // Maintain proper stack trace (only needed for V8/Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SearchError);
    }
  }
}
