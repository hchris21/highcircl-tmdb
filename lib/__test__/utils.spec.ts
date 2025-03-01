import { formatDate, formatRuntime } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("formatDate", () => {
    it("should format date string correctly", () => {
      expect(formatDate("2023-01-15")).toBe("January 15, 2023");
    });
  });

  describe("formatRuntime", () => {
    it("should format runtime in hours and minutes", () => {
      expect(formatRuntime(125)).toBe("2h 5m");
      expect(formatRuntime(60)).toBe("1h 0m");
      expect(formatRuntime(30)).toBe("30m");
    });

    it("should only show minutes when less than an hour", () => {
      expect(formatRuntime(45)).toBe("45m");
    });
  });
});
