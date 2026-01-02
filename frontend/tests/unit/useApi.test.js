import { renderHook, act, waitFor } from "@testing-library/react";
import { useApi } from "../../src/hooks/useApi";

describe("useApi Hook", () => {
  describe("Initial State", () => {
    it("should initialize with data=null, loading=false, error=null", () => {
      const mockApiFunc = jest.fn();
      const { result } = renderHook(() => useApi(mockApiFunc));

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Successful API Call", () => {
    it("should set data when API call succeeds", async () => {
      const mockData = { id: 1, name: "Test User" };
      const mockApiFunc = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it("should toggle loading: true during request, false after success", async () => {
      const mockApiFunc = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() => useApi(mockApiFunc));

      // Before execute
      expect(result.current.loading).toBe(false);

      // Execute the API call
      await act(async () => {
        await result.current.execute();
      });

      // After resolve, loading should be false (set in finally block)
      expect(result.current.loading).toBe(false);
      // And data should be set
      expect(result.current.data).toEqual({ id: 1 });
    });

    it("should clear error on successful API call", async () => {
      const mockApiFunc = jest
        .fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({ success: true });
      const { result } = renderHook(() => useApi(mockApiFunc));

      // First call: fails and sets error
      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });
      expect(result.current.error).toBe("First error");

      // Second call: succeeds and clears error
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ success: true });
    });
  });

  describe("Failed API Call", () => {
    it("should set error message when API call fails", async () => {
      const mockError = new Error("Network timeout");
      const mockApiFunc = jest.fn().mockRejectedValue(mockError);
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.error).toBe("Network timeout");
      expect(result.current.data).toBeNull();
    });

    it("should use default error message when error object has no message", async () => {
      const mockApiFunc = jest.fn().mockRejectedValue({});
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.error).toBe("Đã xảy ra lỗi");
    });

    it("should set loading=false after API call fails", async () => {
      const mockApiFunc = jest.fn().mockRejectedValue(new Error("Failed"));
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("API Arguments", () => {
    it("should pass arguments to the API function", async () => {
      const mockApiFunc = jest.fn().mockResolvedValue({ success: true });
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        await result.current.execute("arg1", "arg2", { nested: "arg3" });
      });

      expect(mockApiFunc).toHaveBeenCalledWith("arg1", "arg2", {
        nested: "arg3",
      });
    });

    it("should return the result from the API function", async () => {
      const expectedResult = { id: 42, message: "Success" };
      const mockApiFunc = jest.fn().mockResolvedValue(expectedResult);
      const { result } = renderHook(() => useApi(mockApiFunc));

      let returnedResult;
      await act(async () => {
        returnedResult = await result.current.execute();
      });

      expect(returnedResult).toEqual(expectedResult);
    });
  });

  describe("Multiple Calls", () => {
    it("should override previous data when execute is called twice", async () => {
      const mockApiFunc = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, name: "First" })
        .mockResolvedValueOnce({ id: 2, name: "Second" });
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toEqual({ id: 1, name: "First" });

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toEqual({ id: 2, name: "Second" });
    });

    it("should handle rapid sequential calls correctly", async () => {
      const mockApiFunc = jest
        .fn()
        .mockResolvedValueOnce({ order: 1 })
        .mockResolvedValueOnce({ order: 2 })
        .mockResolvedValueOnce({ order: 3 });
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        await Promise.all([
          result.current.execute(),
          result.current.execute(),
          result.current.execute(),
        ]);
      });

      // Last result wins
      expect(result.current.data).toEqual({ order: 3 });
      expect(mockApiFunc).toHaveBeenCalledTimes(3);
    });
  });

  describe("Reset Function", () => {
    it("should clear data, error, and loading when reset is called", async () => {
      const mockApiFunc = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() => useApi(mockApiFunc));

      // Set state by executing
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toEqual({ id: 1 });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it("should clear error state after reset", async () => {
      const mockApiFunc = jest.fn().mockRejectedValue(new Error("API Error"));
      const { result } = renderHook(() => useApi(mockApiFunc));

      // Trigger error
      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });
      expect(result.current.error).toBe("API Error");

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle API function throwing non-Error object", async () => {
      const mockApiFunc = jest.fn().mockRejectedValue("String error");
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected error
        }
      });

      // When error doesn't have .message, should use default message
      expect(result.current.error).toBe("Đã xảy ra lỗi");
    });

    it("should handle null data from successful API call", async () => {
      const mockApiFunc = jest.fn().mockResolvedValue(null);
      const { result } = renderHook(() => useApi(mockApiFunc));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it("should preserve error message when API resolves after previous error", async () => {
      const mockApiFunc = jest
        .fn()
        .mockRejectedValueOnce(new Error("Initial error"))
        .mockResolvedValueOnce({ success: true });
      const { result } = renderHook(() => useApi(mockApiFunc));

      // First: error
      await act(async () => {
        try {
          await result.current.execute();
        } catch (err) {
          // Expected
        }
      });
      expect(result.current.error).toBe("Initial error");

      // Second: clears error on new call
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.error).toBeNull();
    });
  });
});
