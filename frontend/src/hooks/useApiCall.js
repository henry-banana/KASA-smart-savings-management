import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { ERROR_MESSAGES } from '@/constants/messages';

/**
 * Custom hook for standardized API error handling
 * Usage:
 * const { execute, loading, error } = useApiCall();
 * const result = await execute(apiFunction, arg1, arg2);
 */
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunc, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunc(...args);
      return result;
      
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      
      logger.error('API call failed', {
        function: apiFunc.name,
        args,
        error: err
      });
      
      setError(errorMessage);
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { 
    execute, 
    loading, 
    error, 
    reset,
    setError // For manual error setting
  };
};

/**
 * Hook for handling multiple API calls with individual states
 */
export const useApiCalls = (apiCalls = {}) => {
  const [states, setStates] = useState(
    Object.keys(apiCalls).reduce((acc, key) => ({
      ...acc,
      [key]: { loading: false, error: null, data: null }
    }), {})
  );

  const execute = useCallback(async (key, ...args) => {
    if (!apiCalls[key]) {
      throw new Error(`API call '${key}' not found`);
    }

    try {
      setStates(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null }
      }));

      const result = await apiCalls[key](...args);
      
      setStates(prev => ({
        ...prev,
        [key]: { loading: false, error: null, data: result }
      }));

      return result;

    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      
      logger.error(`API call '${key}' failed`, { args, error: err });
      
      setStates(prev => ({
        ...prev,
        [key]: { loading: false, error: errorMessage, data: null }
      }));

      throw err;
    }
  }, [apiCalls]);

  return { states, execute };
};
