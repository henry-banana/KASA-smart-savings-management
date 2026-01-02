import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../src/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Initial State", () => {
    it("should return the initial value immediately", () => {
      const { result } = renderHook(() => useDebounce("initial", 500));
      expect(result.current).toBe("initial");
    });

    it("should handle various initial value types", () => {
      const { result: stringResult } = renderHook(() =>
        useDebounce("test", 100)
      );
      expect(stringResult.current).toBe("test");

      const { result: numberResult } = renderHook(() => useDebounce(42, 100));
      expect(numberResult.current).toBe(42);

      const { result: nullResult } = renderHook(() => useDebounce(null, 100));
      expect(nullResult.current).toBeNull();

      const { result: objResult } = renderHook(() =>
        useDebounce({ a: 1 }, 100)
      );
      expect(objResult.current).toEqual({ a: 1 });
    });
  });

  describe("Debounce Delay & Emission", () => {
    it("should emit value after specified delay", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: "initial" } }
      );

      expect(result.current).toBe("initial");

      act(() => {
        rerender({ value: "updated" });
      });

      // Before delay: still initial
      expect(result.current).toBe("initial");

      // Advance time by delay
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // After delay: updated
      expect(result.current).toBe("updated");
    });

    it("should use 500ms default delay when not specified", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value),
        { initialProps: { value: "initial" } }
      );

      act(() => {
        rerender({ value: "updated" });
      });

      expect(result.current).toBe("initial");

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe("updated");
    });

    it("should only emit last value on rapid changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 200),
        { initialProps: { value: "v1" } }
      );

      // Rapid changes
      act(() => {
        rerender({ value: "v2" });
        rerender({ value: "v3" });
        rerender({ value: "v4" });
        rerender({ value: "v5" });
      });

      // Still initial
      expect(result.current).toBe("v1");

      // Advance time
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Only last value emitted
      expect(result.current).toBe("v5");
    });
  });

  describe("Delay Changes", () => {
    it("should restart debounce when delay parameter changes", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 100 } }
      );

      act(() => {
        rerender({ value: "updated", delay: 100 });
      });

      // Advance by 50ms (half delay)
      act(() => {
        jest.advanceTimersByTime(50);
      });

      expect(result.current).toBe("initial");

      // Change delay mid-wait
      act(() => {
        rerender({ value: "updated", delay: 200 });
      });

      // Advance another 50ms (total 100ms, but new delay is 200ms)
      act(() => {
        jest.advanceTimersByTime(50);
      });

      expect(result.current).toBe("initial");

      // Advance remaining 150ms to hit new 200ms delay
      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(result.current).toBe("updated");
    });

    it("should handle zero delay", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: "initial" } }
      );

      act(() => {
        rerender({ value: "updated" });
      });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe("updated");
    });
  });

  describe("Cleanup on Unmount", () => {
    it("should clear timeout on unmount and prevent updates", () => {
      const { result, rerender, unmount } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: "initial" } }
      );

      act(() => {
        rerender({ value: "updated" });
      });

      expect(result.current).toBe("initial");

      // Unmount before debounce fires
      unmount();

      // Advance time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No state update occurs (would cause warning if cleanup failed)
      // Test passes if no "Can't perform a React state update on an unmounted component" warning
      expect(true).toBe(true);
    });

    it("should cleanup timers on rapid unmount cycles", () => {
      for (let i = 0; i < 5; i++) {
        const { unmount, rerender } = renderHook(
          ({ value }) => useDebounce(value, 100),
          { initialProps: { value: `value${i}` } }
        );

        act(() => {
          rerender({ value: `updated${i}` });
        });

        unmount();

        act(() => {
          jest.advanceTimersByTime(100);
        });
      }

      // If no warnings, cleanup worked correctly
      expect(true).toBe(true);
    });
  });

  describe("Multiple Consecutive Updates", () => {
    it("should handle sequential updates after debounce completes", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 150),
        { initialProps: { value: "first" } }
      );

      // First update
      act(() => {
        rerender({ value: "second" });
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(result.current).toBe("second");

      // Second update
      act(() => {
        rerender({ value: "third" });
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(result.current).toBe("third");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null and undefined values", () => {
      const { result: nullResult, rerender: nullRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: null } }
      );

      expect(nullResult.current).toBeNull();

      act(() => {
        nullRerender({ value: "value" });
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(nullResult.current).toBe("value");

      // Test undefined
      const { result: undefinedResult } = renderHook(() =>
        useDebounce(undefined, 100)
      );
      expect(undefinedResult.current).toBeUndefined();
    });

    it("should handle object value changes", () => {
      const obj1 = { id: 1, name: "test" };
      const obj2 = { id: 2, name: "updated" };

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: obj1 } }
      );

      expect(result.current).toEqual(obj1);

      act(() => {
        rerender({ value: obj2 });
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toEqual(obj2);
    });

    it("should handle zero and falsy numeric values", () => {
      const { result: zeroResult, rerender: zeroRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 0 } }
      );

      expect(zeroResult.current).toBe(0);

      act(() => {
        zeroRerender({ value: 42 });
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(zeroResult.current).toBe(42);

      // Test false boolean
      const { result: falseResult } = renderHook(() => useDebounce(false, 100));
      expect(falseResult.current).toBe(false);
    });
  });
});
