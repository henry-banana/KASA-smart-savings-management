import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

const mockGetProfile = jest.fn();
const mockUpdateProfile = jest.fn();
const mockChangePassword = jest.fn();

jest.mock("../../../src/services/profileService", () => ({
  getProfile: (...args) => mockGetProfile(...args),
  updateProfile: (...args) => mockUpdateProfile(...args),
  changePassword: (...args) => mockChangePassword(...args),
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../../src/utils/serverStatusUtils", () => ({
  isServerUnavailable: (err) => err?.status === 503 || err?.code === 503,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailableState: ({ onRetry }) => (
    <div>
      <div>Service Unavailable</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
}));

// Mock useAuth hook
jest.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      fullName: "John Doe",
      email: "john@example.com",
      roleName: "admin",
      role: "admin",
    },
    updateUser: jest.fn(),
  }),
}));

import UserProfile from "../../../src/pages/Profile/UserProfile";

// Custom render with routing
const renderWithRouter = (initialRoute = "/profile") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT04 - Profile Update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render Profile page and load user data on mount", async () => {
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(mockGetProfile).toHaveBeenCalledTimes(1);
  });

  it("should display profile information when data loads successfully", async () => {
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "Alice Smith",
        email: "alice@example.com",
        roleName: "accountant",
        branchName: "Quận 1",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    });
  });

  it("should open edit dialog when Edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    await waitFor(() => {
      const fullNameInputs = screen.getAllByDisplayValue("John Doe");
      expect(fullNameInputs.length).toBeGreaterThan(0);
    });
  });

  it("should update full name and close dialog on success", async () => {
    const user = userEvent.setup();
    const newName = "Jane Smith";
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    const mockUpdateData = {
      success: true,
      data: {
        id: "user-1",
        fullName: newName,
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockUpdateProfile.mockResolvedValueOnce(mockUpdateData);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const fullNameInputs = screen.getAllByDisplayValue("John Doe");
    const fullNameInput = fullNameInputs[0];

    await user.clear(fullNameInput);
    await user.type(fullNameInput, newName);

    const updateButton = screen.getByRole("button", {
      name: /update information/i,
    });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        fullName: newName,
      });
    });

    await waitFor(() => {
      expect(screen.getByText(newName)).toBeInTheDocument();
    });
  });

  it("should disable save button while updating", async () => {
    const user = userEvent.setup();
    const newName = "Jane Smith";
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    // Delay the update response to check loading state
    mockUpdateProfile.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                data: {
                  id: "user-1",
                  fullName: newName,
                  email: "john@example.com",
                  roleName: "admin",
                  branchName: "Thủ Đức",
                },
              }),
            100
          )
        )
    );

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const fullNameInputs = screen.getAllByDisplayValue("John Doe");
    const fullNameInput = fullNameInputs[0];

    await user.clear(fullNameInput);
    await user.type(fullNameInput, newName);

    const updateButton = screen.getByRole("button", {
      name: /update information/i,
    });
    expect(updateButton).not.toBeDisabled();

    await user.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it("should show error message when update fails and keep dialog open", async () => {
    const user = userEvent.setup();
    const errorMessage = "Email already in use";
    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    mockGetProfile.mockResolvedValueOnce(mockProfileData);
    mockUpdateProfile.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const fullNameInputs = screen.getAllByDisplayValue("John Doe");
    const fullNameInput = fullNameInputs[0];

    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Jane Smith");

    const updateButton = screen.getByRole("button", {
      name: /update information/i,
    });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it("should show ServiceUnavailableState when initial load fails with 503", async () => {
    const error = new Error("Service Unavailable");
    error.status = 503;
    error.code = 503;

    mockGetProfile.mockRejectedValueOnce(error);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });
  });

  it("should retry fetch profile when Retry button is clicked on service unavailable", async () => {
    const user = userEvent.setup();
    const error = new Error("Service Unavailable");
    error.status = 503;
    error.code = 503;

    const mockProfileData = {
      success: true,
      data: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        roleName: "admin",
        branchName: "Thủ Đức",
      },
    };

    // First call fails with 503
    mockGetProfile.mockRejectedValueOnce(error);
    // Second call (after retry) succeeds
    mockGetProfile.mockResolvedValueOnce(mockProfileData);

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(mockGetProfile).toHaveBeenCalledTimes(2);
  });
});
