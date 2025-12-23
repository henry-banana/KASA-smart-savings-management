import { jest } from "@jest/globals";

/**
 * Mock Supabase Client
 */
export const createMockSupabaseClient = () => {
  const mockClient = {};

  // List of Supabase chain methods
  const chainMethods = [
    "from", "select", "insert", "update", "delete", "upsert",
    "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike",
    "in", "is", "or", "order", "limit", "range"
  ];

  // Setup all chain methods to return mockClient
  chainMethods.forEach((method) => {
    mockClient[method] = jest.fn().mockReturnValue(mockClient);
  });

  // Methods that return promise or final value
  mockClient.single = jest.fn();
  mockClient.maybeSingle = jest.fn();

  return mockClient;
};

export function resetSupabaseMock(mockSupabase) {
  const chainMethods = [
    "from", "select", "insert", "update", "delete", "upsert",
    "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike",
    "in", "is", "or", "order", "limit", "range"
  ];
  chainMethods.forEach((method) => {
    if (mockSupabase[method]) {
      mockSupabase[method].mockReturnValue(mockSupabase);
    }
  });
}

/**
 * Mock successful response
 */
export const mockSuccessResponse = (data) => ({
  data,
  error: null,
  status: 200,
  statusText: "OK",
});

/**
 * Mock error response
 */
export const mockErrorResponse = (message, code = "PGRST000") => ({
  data: null,
  error: {
    message,
    code,
    details: null,
    hint: null,
  },
  status: 400,
  statusText: "Bad Request",
});

/**
 * Mock not found response
 */
export const mockNotFoundResponse = () => ({
  data: null,
  error: {
    message: "No rows found",
    code: "PGRST116",
    details: null,
    hint: null,
  },
  status: 404,
  statusText: "Not Found",
});

/**
 * Mock Supabase with predefined responses
 */
export class MockSupabaseBuilder {
  constructor() {
    this.chain = [];
    this.responses = new Map();
  }

  mockTable(tableName) {
    this.currentTable = tableName;
    return this;
  }

  mockSelect(response) {
    this.responses.set(`${this.currentTable}_select`, response);
    return this;
  }

  mockInsert(response) {
    this.responses.set(`${this.currentTable}_insert`, response);
    return this;
  }

  mockUpdate(response) {
    this.responses.set(`${this.currentTable}_update`, response);
    return this;
  }

  mockDelete(response) {
    this.responses.set(`${this.currentTable}_delete`, response);
    return this;
  }

  build() {
    const mockClient = createMockSupabaseClient();

    // Setup from() to return appropriate chain
    mockClient.from.mockImplementation((table) => {
      this.currentTable = table;
      return mockClient;
    });

    // Setup select
    mockClient.select.mockImplementation(() => {
      const response = this.responses.get(`${this.currentTable}_select`);
      if (response) {
        mockClient.single.mockResolvedValue(response);
        mockClient.maybeSingle.mockResolvedValue(response);
        return Promise.resolve(response);
      }
      return mockClient;
    });

    // Setup insert
    mockClient.insert.mockImplementation(() => {
      const response = this.responses.get(`${this.currentTable}_insert`);
      if (response) {
        mockClient.select.mockResolvedValue(response);
        mockClient.single.mockResolvedValue(response);
      }
      return mockClient;
    });

    // Setup update
    mockClient.update.mockImplementation(() => {
      const response = this.responses.get(`${this.currentTable}_update`);
      if (response) {
        mockClient.select.mockResolvedValue(response);
        mockClient.single.mockResolvedValue(response);
      }
      return mockClient;
    });

    // Setup delete
    mockClient.delete.mockImplementation(() => {
      const response = this.responses.get(`${this.currentTable}_delete`);
      if (response) {
        mockClient.select.mockResolvedValue(response);
        mockClient.single.mockResolvedValue(response);
      }
      return mockClient;
    });

    return mockClient;
  }
}

// Example usage:
// const mockSupabase = new MockSupabaseBuilder()
//   .mockTable('customer')
//   .mockSelect(mockSuccessResponse([{ customerid: 1, fullname: 'Test' }]))
//   .mockInsert(mockSuccessResponse({ customerid: 1 }))
//   .build();
