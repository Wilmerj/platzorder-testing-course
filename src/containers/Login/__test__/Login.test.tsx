import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { getAuth } from "../../../services/getAuth";
import { SessionProvider } from "../../../context/AuthContext";
import { Login } from "..";

// Mocking external dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../services/getAuth");

const mockNavigate = vi.fn();
const mockGetAuth = getAuth as jest.MockedFunction<typeof getAuth>;

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    );
  };

  it("renders login form correctly", () => {
    renderLogin();

    expect(screen.getByRole("heading", { level: 1, name: /Platz order/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    renderLogin();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("testpass");
  });

  it("calls getAuth and navigates on successful login", async () => {
    mockGetAuth.mockResolvedValue({ success: true });
    renderLogin();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "validuser" } });
    fireEvent.change(passwordInput, { target: { value: "validpass" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockGetAuth).toHaveBeenCalledWith("validuser", "validpass");
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });

  it("displays error message on failed login", async () => {
    mockGetAuth.mockRejectedValue(new Error("Invalid credentials"));
    renderLogin();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "invaliduser" } });
    fireEvent.change(passwordInput, { target: { value: "invalidpass" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});