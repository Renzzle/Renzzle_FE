// Preserve diagnostic fields only for callers that explicitly request them.
export class ApiError extends Error {
  constructor(message: string, public readonly code?: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}
