import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SessionProvider, useSession } from "../../../context/AuthContext";
import { getOrders } from "../../../services/getOrders";
import { MemoryRouter } from "react-router-dom";
import { Orders } from "..";

// Mocking external dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../services/getOrders");
vi.mock("../../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../../context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockNavigate = vi.fn();
const mockGetOrders = getOrders as jest.MockedFunction<typeof getOrders>;

const mockOrders = [
  {
    id: "1",
    orderDate: "2023-01-01T00:00:00Z",
    status: "completed",
    customer: { name: "John Doe", email: "john@example.com" },
    products: [
      { id: "1", name: "Product 1", quantity: 2, price: 10 },
      { id: "2", name: "Product 2", quantity: 1, price: 20 },
    ],
    paymentMethod: "credit_card",
    total: 40,
  },
];

const renderOrders = (userRole: string | null) => {
  const mockUser = userRole ? { role: userRole } : null;
  (useSession as jest.Mock).mockReturnValue({ user: mockUser });
  
  return render(
    <SessionProvider>
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    </SessionProvider>
  );
};

describe("Orders Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    renderOrders("visualizer");
    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    mockGetOrders.mockRejectedValue(new Error("Failed to fetch orders"));
    renderOrders("visualizer");

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch orders/i)).toBeInTheDocument();
    });
  });

  it("renders orders for a regular user", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    renderOrders("visualizer");

    await waitFor(() => {
      expect(screen.getByText(/order history/i)).toBeInTheDocument();
      expect(screen.getByText(/order #1/i)).toBeInTheDocument();
      expect(screen.queryByText(/orders summary/i)).not.toBeInTheDocument();
    });
  });

  it("renders orders and OrderSummary for a superadmin", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    renderOrders("superadmin");

    await waitFor(() => {
      expect(screen.getByText(/order history/i)).toBeInTheDocument();
      expect(screen.getByText(/order #1/i)).toBeInTheDocument();
      expect(screen.getByText(/orders summary/i)).toBeInTheDocument();
    });
  });

  it("redirects to login if no user is present", () => {
    renderOrders(null);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});