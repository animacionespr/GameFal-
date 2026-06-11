import {
  cn,
  formatDate,
  formatRelativeTime,
  slugify,
  truncate,
  getInitials,
  getStatusColor,
  getStatusLabel,
  getPhaseProgress,
  isValidUrl,
  generateId,
} from "@/lib/utils";

describe("cn (class merger)", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "skip", "include")).toBe("base include");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });
});

describe("truncate", () => {
  it("returns original if under limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });
});

describe("getInitials", () => {
  it("extracts initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("handles single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("limits to 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});

describe("getStatusColor", () => {
  it("returns correct color for completed", () => {
    expect(getStatusColor("completed")).toContain("green");
  });

  it("returns correct color for failed", () => {
    expect(getStatusColor("failed")).toContain("red");
  });

  it("returns fallback for unknown status", () => {
    expect(getStatusColor("unknown")).toContain("gray");
  });
});

describe("getStatusLabel", () => {
  it("returns human readable label", () => {
    expect(getStatusLabel("generating_code")).toBe("Generating Code");
  });

  it("returns status itself for unknown", () => {
    expect(getStatusLabel("custom_status")).toBe("custom_status");
  });
});

describe("getPhaseProgress", () => {
  it("returns 0 for pending", () => {
    expect(getPhaseProgress("pending")).toBe(0);
  });

  it("returns 100 for completed", () => {
    expect(getPhaseProgress("completed")).toBe(100);
  });

  it("returns intermediate value for in-progress", () => {
    const progress = getPhaseProgress("generating_code");
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });
});

describe("isValidUrl", () => {
  it("validates correct URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
});

describe("generateId", () => {
  it("generates non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});
