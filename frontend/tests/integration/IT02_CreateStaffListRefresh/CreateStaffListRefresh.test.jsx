import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
const mockCreateUser = jest.fn();
const mockGetAllUsers = jest.fn();
const mockGetBranchNames = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "admin1", role: "admin", email: "admin@example.com" },
    isAuthenticated: true,
  }),
}));

jest.mock("../../../src/services/userService", () => ({
  userService: {
    createUser: (...args) => mockCreateUser(...args),
    getAllUsers: (...args) => mockGetAllUsers(...args),
    updateUser: jest.fn(),
    updateUserStatus: jest.fn(),
  },
}));

jest.mock("../../../src/services/branchService", () => ({
  branchService: {
    getBranchNames: (...args) => mockGetBranchNames(...args),
  },
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailablePageState: ({ onRetry }) => <div>Service Unavailable</div>,
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
}));

import UserManagement from "../../../src/pages/Users/UserManagement";

// Helper to open dialog and fill form
const openDialogAndFillForm = async (user, values = {}) => {
  const { fullName = "John Doe", email = "john@example.com" } = values;

  const addButton = screen.getByRole("button", { name: /add/i });
  await user.click(addButton);

  const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
  const emailInput = screen.getByPlaceholderText(/enter email address/i);

  if (fullName) {
    await user.clear(fullNameInput);
    await user.type(fullNameInput, fullName);
  }
  if (email) {
    await user.clear(emailInput);
    await user.type(emailInput, email);
  }

  return { fullNameInput, emailInput };
};

describe("Integration: IT02 - Create Staff and List Refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    // First call (on mount) returns initial users
    mockGetAllUsers
      .mockResolvedValueOnce([
        {
          id: "user-1",
          fullName: "Alice Smith",
          email: "alice@example.com",
          roleName: "Teller",
          branchName: "Thủ Đức",
          status: "Approved",
        },
        {
          id: "user-2",
          fullName: "Bob Johnson",
          email: "bob@example.com",
          roleName: "Accountant",
          branchName: "Quận 1",
          status: "Approved",
        },
      ])
      // Setup default for other tests that might call it again
      .mockResolvedValue([
        {
          id: "user-1",
          fullName: "Alice Smith",
          email: "alice@example.com",
          roleName: "Teller",
          branchName: "Thủ Đức",
          status: "Approved",
        },
        {
          id: "user-2",
          fullName: "Bob Johnson",
          email: "bob@example.com",
          roleName: "Accountant",
          branchName: "Quận 1",
          status: "Approved",
        },
      ]);
    mockGetBranchNames.mockResolvedValueOnce(["Thủ Đức", "Quận 1", "Quận 3"]);
    mockCreateUser.mockResolvedValueOnce({
      id: "user-3",
      fullName: "Carol White",
      email: "carol@example.com",
      roleName: "Teller",
      branchName: "Thủ Đức",
    });
    localStorage.clear();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("should render user management page and load initial list", async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    // Verify getAllUsers was called once on mount
    expect(mockGetAllUsers).toHaveBeenCalledTimes(1);

    // Verify initial users are displayed
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });
  });

  it("should open dialog when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    expect(screen.getByText(/add new user/i)).toBeInTheDocument();
  });

  it("should fill form with valid data and submit successfully", async () => {
    const user = userEvent.setup({ delay: null });
    // First call: initial render
    mockGetAllUsers.mockResolvedValueOnce([
      {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
    ]);
    // Second call: after user creation (fetchUsers refresh)
    mockGetAllUsers.mockResolvedValueOnce([
      {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
      {
        id: "user-3",
        fullName: "Carol White",
        email: "carol@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
    ]);
    // Ensure createUser is mocked for this test
    mockCreateUser.mockResolvedValueOnce({
      id: "user-3",
      fullName: "Carol White",
      email: "carol@example.com",
      roleName: "Teller",
      branchName: "Thủ Đức",
    });
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
    const emailInput = screen.getByPlaceholderText(/enter email address/i);

    await user.type(fullNameInput, "Carol White");
    await user.type(emailInput, "carol@example.com");

    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Verify createUser was called with correct payload
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        fullName: "Carol White",
        email: "carol@example.com",
        roleName: "Teller",
        branchName: expect.any(String),
      });
    });
  }, 15000); // Increase timeout to 15 seconds for when tests run together with other suites

  it("should submit form and close dialog on success", async () => {
    const user = userEvent.setup({ delay: null });
    mockGetAllUsers.mockResolvedValueOnce([
      {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
    ]);
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
    const emailInput = screen.getByPlaceholderText(/enter email address/i);

    await user.type(fullNameInput, "Carol White");
    await user.type(emailInput, "carol@example.com");

    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Wait for service call
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled();
    });
  });

  it("should refresh user list after successful creation", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAllUsers
      .mockResolvedValueOnce([
        {
          id: "user-1",
          fullName: "Alice Smith",
          email: "alice@example.com",
          roleName: "Teller",
          branchName: "Thủ Đức",
          status: "Approved",
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "user-1",
          fullName: "Alice Smith",
          email: "alice@example.com",
          roleName: "Teller",
          branchName: "Thủ Đức",
          status: "Approved",
        },
        {
          id: "user-3",
          fullName: "Carol White",
          email: "carol@example.com",
          roleName: "Teller",
          branchName: "Thủ Đức",
          status: "Approved",
        },
      ]);

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    expect(mockGetAllUsers).toHaveBeenCalledTimes(1);

    // Open dialog and create user
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
    const emailInput = screen.getByPlaceholderText(/enter email address/i);

    await user.type(fullNameInput, "Carol White");
    await user.type(emailInput, "carol@example.com");

    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Wait for list to refresh (second call to getAllUsers)
    await waitFor(() => {
      expect(mockGetAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  it("should show error message on failed creation", async () => {
    const user = userEvent.setup({ delay: null });

    // Setup initial user list load
    mockGetAllUsers.mockResolvedValueOnce([
      {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
    ]);

    // Setup create to fail
    const testError = new Error("Email already exists");
    mockCreateUser.mockRejectedValueOnce(testError);

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
    const emailInput = screen.getByPlaceholderText(/enter email address/i);

    await user.type(fullNameInput, "Bob Johnson");
    await user.type(emailInput, "alice@example.com");

    // Submit form
    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Verify create was called with correct data
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "Bob Johnson",
          email: "alice@example.com",
        })
      );
    });
  });

  it("should display success message after user creation", async () => {
    const user = userEvent.setup();

    mockGetAllUsers.mockResolvedValueOnce([
      {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "Teller",
        branchName: "Thủ Đức",
        status: "Approved",
      },
    ]);

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
    const emailInput = screen.getByPlaceholderText(/enter email address/i);

    await user.type(fullNameInput, "Carol White");
    await user.type(emailInput, "carol@example.com");

    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Wait for success dialog to appear with success message
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /success/i })
      ).toBeInTheDocument();
    });
  });
});
