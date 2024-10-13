import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Users } from "..";
import { SessionProvider } from "../../../context/AuthContext";
import { getUsers, createUser, deleteUser } from "../../../services/getUsers";
import { MemoryRouter } from "react-router-dom";

// Mocking external dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../services/getUsers");

const mockNavigate = vi.fn();
const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

const mockUsers = [
  { id: '1', username: 'admin', role: 'superadmin' },
  { id: '2', username: 'viewer', role: 'visualizer' },
];

const renderUsers = (user: { role: string } | null) => {
  return render(
    <SessionProvider>
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    </SessionProvider>
  );
};

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    renderUsers({ role: "superadmin" });
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    mockGetUsers.mockRejectedValue(new Error("Failed to fetch users"));
    renderUsers({ role: "superadmin" });

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
    });
  });

  it("renders users for a superadmin", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);
    renderUsers({ role: "superadmin" });

    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument();
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
      expect(screen.getByText(/viewer/i)).toBeInTheDocument();
    });
  });

  it("creates a new user", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);
    mockCreateUser.mockResolvedValue({ id: '3', username: 'newuser', role: 'visualizer' });
    renderUsers({ role: "superadmin" });

    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/role/i), { target: { value: 'visualizer' } });
    fireEvent.click(screen.getByText(/create user/i));

    await waitFor(() => {
      expect(screen.getByText(/newuser/i)).toBeInTheDocument();
    });
  });

  it("deletes a user", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);
    renderUsers({ role: "superadmin" });

    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/delete user/i)[0]);

    await waitFor(() => {
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
    });
  });

  it("redirects to login if no user is present", () => {
    renderUsers(null);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});