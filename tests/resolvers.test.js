const resolvers = require("../src/resolvers");

describe("resolvers", () => {
  test("feed", () => {
    const result = resolvers.Query.feed(null, null, {
      models: { Post: { findMany: () => ["hello"] } },
    });

    expect(result).toEqual(['hello'])
  });
});
