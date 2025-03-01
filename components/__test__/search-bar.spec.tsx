import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("SearchBar Component", () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    mockGet.mockReturnValue("");
  });

  it("should render the search input", () => {
    render(<SearchBar />);

    expect(
      screen.getByPlaceholderText("Search for movies..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("should initialize with query from URL", () => {
    mockGet.mockReturnValue("test query");

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "Search for movies...",
    ) as HTMLInputElement;
    expect(input.value).toBe("test query");
  });

  it("should update input value when typing", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "Search for movies...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "new search" } });

    expect(input.value).toBe("new search");
  });

  it("should navigate to search results when form is submitted", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "Search for movies...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "avatar" } });

    const form = input.closest("form");
    fireEvent.submit(form!);

    expect(mockPush).toHaveBeenCalledWith("/?query=avatar");
  });

  it("should navigate to home when form is submitted with empty query", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "Search for movies...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "  " } });

    const form = input.closest("form");
    fireEvent.submit(form!);

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
