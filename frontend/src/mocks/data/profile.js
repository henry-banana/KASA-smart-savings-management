/**
 * Mock data for Current User Profile
 * This represents the currently logged-in user's profile with extended information
 *
 * IMPORTANT: This profile is dynamically synced with mockUserAccounts during login.
 * Do not hard-code a default user here - it will be set via setCurrentUser().
 */

import { findUserByUsername, updateUserAccount } from "./users.js";

// Ensure profile is synced with mockUserAccounts
// This will be set dynamically based on who is logged in
export let currentUserProfile = null;

/**
 * Get current user profile
 * @returns {Object} Current user profile
 */
export const getCurrentProfile = () => {
  // Ensure profile is synced with mockUserAccounts
  if (!currentUserProfile) {
    // If no profile is set, try to load from localStorage or default to first user
    const savedUser =
      typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
    } else {
      // Fallback to first teller user
      const defaultUser = findUserByUsername("teller1");
      if (defaultUser) {
        setCurrentUser(defaultUser);
      }
    }
  }
  return currentUserProfile ? { ...currentUserProfile } : null;
};

/**
 * Update current user profile
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated profile
 */
export const updateCurrentProfile = (updates) => {
  // Only allow updating specific fields
  const allowedFields = ["fullName"];
  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  currentUserProfile = {
    ...currentUserProfile,
    ...filteredUpdates,
  };

  // Persist changes back to the underlying mock user account so that
  // after logout/login (which re-syncs from mockUserAccounts) the updates remain.
  if (currentUserProfile?.id) {
    updateUserAccount(currentUserProfile.id, filteredUpdates);
    // Keep localStorage in sync if available
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedStored = { ...parsed, ...filteredUpdates };
        localStorage.setItem("user", JSON.stringify(updatedStored));
      }
    }
  }

  return { ...currentUserProfile };
};

/**
 * Set the current user (called when user logs in)
 * Ensure profile is synced with mockUserAccounts
 *
 * @param {Object} userData - User data from authentication or mockUserAccounts
 */
export const setCurrentUser = (userData) => {
  // If userData has a userid, look up the full user record from mockUserAccounts
  let fullUserData = userData;

  if (userData.userid || userData.username) {
    const username = userData.userid || userData.username;
    const accountData = findUserByUsername(username);

    if (accountData) {
      // Use the full account data from mockUserAccounts as the source of truth
      fullUserData = accountData;
    }
  }

  // Map mockUserAccounts fields to canonical profile fields (OpenAPI contract)
  // Keep only 5 core fields (id, fullName, email, roleName, branchName)
  // Note: password is NEVER included in profile
  currentUserProfile = {
    id: fullUserData.employeeid || fullUserData.id,
    fullName: fullUserData.fullName,
    email: fullUserData.email,
    roleName: fullUserData.role || fullUserData.roleName,
    branchName: fullUserData.branchName || "Bình Dương",
  };

  return currentUserProfile;
};
