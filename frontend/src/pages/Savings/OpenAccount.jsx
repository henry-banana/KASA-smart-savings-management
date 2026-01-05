import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { formatVnNumber, formatBalance } from "../../utils/numberFormatter";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  CheckCircle2,
  PiggyBank,
  User as UserIcon,
  CreditCard,
  MapPin,
  Calendar,
  Coins,
  Sparkles,
  Heart,
  Loader2,
  Search,
} from "lucide-react";
import {
  StarDecor,
  PiggyBankIllustration,
} from "../../components/CuteComponents";
import { createSavingBook } from "../../services/savingBookService";
import { getAllTypeSavings } from "@/services/typeSavingService";
import { getRegulations } from "@/services/regulationService";
import { sortSavingsTypeItems } from "@/utils/savingsTypeSort";
import { BUSINESS_RULES } from "@/constants/business";
import { customerService } from "../../services/customerService";
import { RoleGuard } from "../../components/RoleGuard";
import { useAuthContext } from "../../contexts/AuthContext";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";

export default function OpenAccount() {
  const { user } = useAuthContext();

  // Helper function to get today's date in local timezone (YYYY-MM-DD format)
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    customerName: "",
    idCard: "",
    address: "",
    savingBookCode: "",
    savingsType: "",
    initialDeposit: "",
    openDate: getTodayDateString(),
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [accountCode, setAccountCode] = useState("");
  const [createdAccountData, setCreatedAccountData] = useState(null); // Save created data
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegisterCustomerDialog, setShowRegisterCustomerDialog] =
    useState(false);
  const [showRegisterCustomerFormDialog, setShowRegisterCustomerFormDialog] =
    useState(false);
  const [registerCustomerForm, setRegisterCustomerForm] = useState({
    citizenId: "",
    fullName: "",
    street: "",
    district: "",
    province: "",
  });
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [registerCustomerErrors, setRegisterCustomerErrors] = useState({});
  const [registerSubmitError, setRegisterSubmitError] = useState("");

  // Minimum balance from regulations (dynamic)
  const [minBalance, setMinBalance] = useState(null);
  const [regulationsError, setRegulationsError] = useState("");
  const [loadingRegulations, setLoadingRegulations] = useState(true);

  // Customer lookup state
  const [isLookingUpCustomer, setIsLookingUpCustomer] = useState(false);
  const [lookupStatus, setLookupStatus] = useState("idle"); // 'idle' | 'found' | 'not_found' | 'error'
  const idCardInputRef = useRef(null);

  // Server availability state
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const [retryingServer, setRetryingServer] = useState(false);

  // Handle customer lookup by ID
  const handleLookupCustomer = async () => {
    // Validate citizenId is not empty
    if (!formData.idCard.trim()) {
      setErrors((prev) => ({
        ...prev,
        idCard: "Please enter ID citizen number first",
      }));
      return;
    }

    // Validate citizenId format - must be exactly 12 digits
    const citizenIdPattern = /^\d{12}$/;
    if (!citizenIdPattern.test(formData.idCard.trim())) {
      setErrors((prev) => ({
        ...prev,
        idCard: "Invalid citizen ID's length. It should be 12 digits.",
      }));
      return;
    }

    setIsLookingUpCustomer(true);
    setLookupStatus("idle");

    try {
      // Call customer service to lookup by citizen ID
      const response = await customerService.searchCustomerByCitizenId(
        formData.idCard
      );

      // Check if customer found
      if (response.success && response.data) {
        const customer = response.data;
        setFormData((prev) => ({
          ...prev,
          customerName: customer.fullname || "",
          address: customer.address || "",
        }));
        setLookupStatus("found");
        setErrors((prev) => ({
          ...prev,
          idCard: "",
          customerName: "",
          address: "",
        }));
      } else {
        // Customer not found (should not reach here due to service throwing error)
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          address: "",
        }));
        setLookupStatus("not_found");
        setShowRegisterCustomerDialog(true);
      }
    } catch (err) {
      console.error("Customer lookup error:", err);
      // Check if it's a "not found" error
      if (err.message === "Customer not found") {
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          address: "",
        }));
        setLookupStatus("not_found");
        setShowRegisterCustomerDialog(true);
      } else {
        // Other errors
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          address: "",
        }));
        setLookupStatus("error");
        setErrors((prev) => ({
          ...prev,
          idCard: err.message || "Failed to lookup customer. Please try again.",
        }));
      }
    } finally {
      setIsLookingUpCustomer(false);
    }
  };

  const handleCloseRegisterCustomerDialog = () => {
    setShowRegisterCustomerDialog(false);
    // Ensure customer fields stay cleared and return focus to ID input
    setFormData((prev) => ({
      ...prev,
      customerName: "",
      address: "",
      savingBookCode: "",
    }));
    setLookupStatus("idle");
    setTimeout(() => {
      idCardInputRef.current?.focus();
    }, 0);
  };

  const handleRegisterNow = () => {
    setShowRegisterCustomerDialog(false);
    setRegisterCustomerForm((prev) => ({
      ...prev,
      citizenId: formData.idCard || "",
    }));
    setShowRegisterCustomerFormDialog(true);
  };

  const handleSubmitRegisterCustomer = async () => {
    const errors = {};
    if (!registerCustomerForm.fullName?.trim())
      errors.fullName = "Full name is required";
    if (!registerCustomerForm.street?.trim())
      errors.street = "Street is required";
    if (!registerCustomerForm.district?.trim())
      errors.district = "District is required";
    if (!registerCustomerForm.province?.trim())
      errors.province = "Province is required";

    setRegisterCustomerErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmittingRegister(true);
    try {
      setRegisterSubmitError("");
      const response = await customerService.createCustomer({
        fullName: registerCustomerForm.fullName,
        citizenId: registerCustomerForm.citizenId,
        street: registerCustomerForm.street,
        district: registerCustomerForm.district,
        province: registerCustomerForm.province,
      });

      const created = response?.data?.customer || response?.data;
      const composedAddress = created?.address
        ? created.address
        : [created?.street, created?.district, created?.province]
            .filter(Boolean)
            .join(", ");

      setFormData((prev) => ({
        ...prev,
        customerName:
          created?.fullName || created?.fullname || prev.customerName,
        address: composedAddress || prev.address,
      }));
      setLookupStatus("found");
      setShowRegisterCustomerFormDialog(false);
    } catch (err) {
      setRegisterSubmitError(
        err?.message || "Failed to create customer. Please try again."
      );
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.customerName)
      newErrors.customerName = "Please enter customer name";
    if (!formData.idCard) newErrors.idCard = "Please enter ID card number";
    if (!formData.address) newErrors.address = "Please enter address";
    // Saving Book ID is optional - if provided, validate format
    if (formData.savingBookCode) {
      if (!/^\d+$/.test(formData.savingBookCode)) {
        newErrors.savingBookCode = "Saving Book ID must contain only numbers";
      } else if (formData.savingBookCode.length > 10) {
        newErrors.savingBookCode = "Saving Book ID must not exceed 10 digits";
      }
    }
    if (!formData.savingsType)
      newErrors.savingsType = "Please select savings type";
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = "Please enter amount";
    } else if (!minBalance || Number(formData.initialDeposit) < minBalance) {
      newErrors.initialDeposit = `Minimum amount is ${
        minBalance ? formatVnNumber(minBalance) : "..."
      }₫`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await createSavingBook({
          ...formData,
          employeeId: user?.userId || user?.id || "NV001",
        });
        setAccountCode(response.data.bookId || response.data.accountCode);
        // Save created data before resetting form
        setCreatedAccountData({ ...formData });
        setShowSuccess(true);

        // Reset form after short delay
        setTimeout(() => {
          setFormData({
            customerName: "",
            idCard: "",
            address: "",
            savingBookCode: "",
            savingsType: "",
            initialDeposit: "",
            openDate: getTodayDateString(),
          });
        }, 500);
      } catch (err) {
        console.error("Create saving book error:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerUnavailable(true);
        } else {
          // Handle duplicate book ID error
          const isDuplicateBookID =
            err.message?.includes("duplicate") ||
            err.message?.includes("unique constraint") ||
            err.status === 409;

          if (isDuplicateBookID) {
            const friendlyMsg = formData.savingBookCode
              ? `⚠️ Saving Book ID "${formData.savingBookCode}" already exists! Please try with a different ID or leave it blank to auto-generate.`
              : `⚠️ Saving Book ID already exists! Please try again.`;
            setErrorMessage(friendlyMsg);
            setErrors({
              savingBookCode:
                "This ID is already in use. Try a different one or leave blank for auto-generation.",
            });
          } else {
            setErrorMessage(err.message || "Failed to open saving book.");
            setErrors({ submit: err.message });
          }
          setShowError(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const [savingTypes, setSavingTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Watch citizenId changes and clear lookup results if changed after successful lookup
  useEffect(() => {
    if (lookupStatus === "found") {
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        address: "",
      }));
      setLookupStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idCard]);

  // Fetch regulations (minDeposit) on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      setLoadingRegulations(true);
      setRegulationsError("");
      try {
        const resp = await getRegulations();
        if (resp.success && resp.data?.minimumBalance) {
          // Use API value directly - no fallback to business rule
          setMinBalance(resp.data.minimumBalance);
        } else {
          // If API doesn't return data, use fallback
          setMinBalance(BUSINESS_RULES.MIN_INITIAL_DEPOSIT);
          setRegulationsError("Using default minimum balance");
        }
      } catch (err) {
        console.error("Fetch regulations error:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerUnavailable(true);
        } else {
          // Fallback to business rule
          setMinBalance(BUSINESS_RULES.MIN_INITIAL_DEPOSIT);
          setRegulationsError(
            err.message || "Cannot load minimum balance rule"
          );
        }
      } finally {
        setLoadingRegulations(false);
      }
    };
    fetchRegulations();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const resp = await getAllTypeSavings();
        if (resp.success && Array.isArray(resp.data)) {
          const mapped = resp.data
            .filter((ts) => ts.isActive) // Only show active types
            .map((ts) => ({
              id: ts.typeSavingId,
              name: ts.typeName,
              typeName: ts.typeName, // Add for sorting compatibility
              description:
                ts.term === 1 && ts.typeName === "No term"
                  ? "Flexible withdrawal"
                  : `Fixed term ${formatVnNumber(ts.term)} month${
                      ts.term > 1 ? "s" : ""
                    }`,
              interestRate: ts.interestRate,
              term: ts.term,
              emoji:
                ts.typeName === "No term"
                  ? "🔄"
                  : ts.term === 3
                  ? "📅"
                  : ts.term === 6
                  ? "⭐"
                  : "🔥",
              color:
                ts.typeName === "No term"
                  ? "from-[#1A4D8F] to-[#2563A8]"
                  : ts.term === 3
                  ? "from-[#00AEEF] to-[#33BFF3]"
                  : ts.term === 6
                  ? "from-[#60A5FA] to-[#93C5FD]"
                  : "from-[#10B981] to-[#34D399]",
            }));

          // Sort by savings type order
          const sortedTypes = sortSavingsTypeItems(mapped);
          setSavingTypes(sortedTypes);
        }
      } catch (e) {
        console.error("Failed to load saving types", e);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Show full-page error state if server unavailable
  if (serverUnavailable) {
    return (
      <RoleGuard allow={["teller"]}>
        <ServiceUnavailableState
          variant="page"
          loading={retryingServer}
          onRetry={() => {
            setRetryingServer(true);
            setServerUnavailable(false);
            const checkServer = async () => {
              try {
                await getRegulations();
                window.location.reload();
              } catch (err) {
                if (isServerUnavailable(err)) {
                  setServerUnavailable(true);
                }
              } finally {
                setRetryingServer(false);
              }
            };
            checkServer();
          }}
        />
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allow={["teller"]}>
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden border border-gray-200 rounded-sm lg:rounded-sm">
          {/* Cute Header with Gradient */}
          <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute opacity-50 top-6 right-20 sm:right-32 text-cyan-300"
              size={20}
            />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xs sm:rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                }}
              >
                <PiggyBank
                  size={24}
                  className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                  <span className="truncate">Open New Saving Book</span>
                  <span className="shrink-0 text-xl sm:text-2xl">🏦</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Create a new saving book for customer
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Customer Info Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <UserIcon
                    size={18}
                    className="sm:w-5 sm:h-5 text-[#1A4D8F]"
                  />
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    Customer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="idCard"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      ID Citizen Number *
                    </Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <CreditCard
                          className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                          size={16}
                        />
                        <Input
                          id="idCard"
                          ref={idCardInputRef}
                          value={formData.idCard}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              idCard: e.target.value,
                            });
                            // Clear error when user starts typing
                            if (errors.idCard) {
                              setErrors((prev) => ({ ...prev, idCard: "" }));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleLookupCustomer();
                            }
                          }}
                          placeholder="Enter ID citizen number"
                          className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleLookupCustomer}
                        disabled={isLookingUpCustomer}
                        className="h-11 sm:h-12 px-4 sm:px-6 rounded-sm bg-[#1A4D8F] hover:bg-[#154171] text-white text-sm sm:text-base"
                      >
                        {isLookingUpCustomer ? (
                          <Loader2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] sm:mr-2 animate-spin"
                          />
                        ) : (
                          <Search
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] sm:mr-2"
                          />
                        )}
                        {isLookingUpCustomer ? "Looking up..." : "Lookup"}
                      </Button>
                    </div>
                    {errors.idCard && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span> {errors.idCard}
                      </p>
                    )}
                    {lookupStatus === "found" && !errors.idCard && (
                      <p className="flex items-center gap-1 text-xs text-green-600 sm:text-sm">
                        <span className="text-xs">✓</span> Customer found
                      </p>
                    )}
                    {lookupStatus === "error" && (
                      <p className="flex items-center gap-1 text-xs text-red-600 sm:text-sm">
                        <span className="text-xs">✕</span> Lookup failed. Please
                        try again
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="customerName"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Customer Name *
                    </Label>
                    <div className="relative">
                      <UserIcon
                        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                        size={16}
                      />
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                        placeholder="Customer name will appear after lookup"
                        disabled
                        className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 bg-gray-50 text-gray-600 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base cursor-not-allowed opacity-60"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span>{" "}
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Address *
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute text-gray-400 left-3 top-3"
                        size={16}
                      />
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Customer address will appear after lookup"
                        rows={3}
                        disabled
                        className="pl-10 rounded-sm border-gray-200 bg-gray-50 text-gray-600 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                    {errors.address && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Saving Book ID */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="savingBookCode"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Saving Book ID
                    </Label>
                    <div className="relative flex-1">
                      <CreditCard
                        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                        size={16}
                      />
                      <Input
                        id="savingBookCode"
                        type="text"
                        placeholder="(Optional) Leave blank to auto-generate"
                        value={formData.savingBookCode || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers
                          const numericValue = value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setFormData({
                            ...formData,
                            savingBookCode: numericValue,
                          });
                          // Clear error when user starts typing
                          if (errors.savingBookCode) {
                            setErrors((prev) => ({
                              ...prev,
                              savingBookCode: "",
                            }));
                          }
                        }}
                        className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                      />
                    </div>
                    {errors.savingBookCode && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span>{" "}
                        {errors.savingBookCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Savings Details Section */}
              <div className="pt-4 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Coins size={18} className="sm:w-5 sm:h-5 text-[#00AEEF]" />
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    Saving Book Details
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Saving Book Type * (Select one)
                  </Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    {loadingTypes && (
                      <div className="col-span-3 text-sm text-gray-500">
                        Loading types...
                      </div>
                    )}
                    {!loadingTypes &&
                      savingTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, savingsType: type.id });
                            setErrors({ ...errors, savingsType: "" });
                          }}
                          className={`relative p-4 rounded-sm border-2 transition-all duration-200 text-left group cursor-pointer ${
                            formData.savingsType === type.id
                              ? "border-[#00AEEF] bg-linear-to-br " +
                                type.color +
                                " text-white border border-gray-200 scale-105"
                              : "border-gray-200 bg-white hover:border-[#00AEEF] hover:scale-[1.02]"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-2xl">{type.emoji}</span>
                            {formData.savingsType === type.id && (
                              <CheckCircle2 size={20} className="text-white" />
                            )}
                          </div>
                          <div
                            className={`text-2xl font-bold mb-1 ${
                              formData.savingsType === type.id
                                ? "text-white"
                                : "text-[#1A4D8F]"
                            }`}
                          >
                            {formatVnNumber(type.interestRate, {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 2,
                              noFloor: true,
                            })}
                            %
                          </div>
                          <div
                            className={`text-sm font-semibold mb-0.5 ${
                              formData.savingsType === type.id
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {type.name}
                          </div>
                          <div
                            className={`text-xs ${
                              formData.savingsType === type.id
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            {type.description}
                          </div>
                        </button>
                      ))}
                  </div>
                  {errors.savingsType && (
                    <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                      <span className="text-xs">⚠️</span> {errors.savingsType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="initialDeposit"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Initial Deposit (VND) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="initialDeposit"
                        type="number"
                        value={formData.initialDeposit}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = Number(value);

                          // Prevent entering negative amounts
                          if (numValue < 0) {
                            setFormData({
                              ...formData,
                              initialDeposit: "",
                            });
                            return;
                          }

                          setFormData({
                            ...formData,
                            initialDeposit: value,
                          });
                          // Clear error when user starts typing
                          if (errors.initialDeposit) {
                            setErrors((prev) => ({
                              ...prev,
                              initialDeposit: "",
                            }));
                          }
                        }}
                        placeholder={
                          minBalance
                            ? `Minimum: ${formatVnNumber(minBalance)}`
                            : "Enter amount"
                        }
                        disabled={!!regulationsError || loadingRegulations}
                        min="0"
                        className="pl-7 sm:pl-8 h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                      />
                      <span className="absolute text-sm font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2 sm:text-base">
                        ₫
                      </span>
                    </div>
                    {errors.initialDeposit && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span>{" "}
                        {errors.initialDeposit}
                      </p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <span>💡</span>{" "}
                      {loadingRegulations
                        ? "Loading minimum amount..."
                        : regulationsError
                        ? regulationsError
                        : `Minimum amount: ${
                            minBalance ? formatVnNumber(minBalance) : "..."
                          }₫`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="openDate"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Opening Date
                    </Label>
                    <div className="relative">
                      <Calendar
                        className="absolute text-gray-400 left-3 top-3"
                        size={16}
                      />
                      <Input
                        id="openDate"
                        type="text"
                        value={formatDateToDDMMYYYY(formData.openDate)}
                        disabled
                        readOnly
                        className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 bg-gray-50 text-gray-600 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:gap-4 sm:pt-6">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !minBalance ||
                    !!regulationsError ||
                    serverUnavailable
                  }
                  className="flex-1 h-11 sm:h-12 text-white rounded-md font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                  }}
                >
                  <CheckCircle2
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] mr-2"
                  />
                  {isSubmitting ? "Processing..." : "Confirm Open Saving Book"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm border rounded-md border-gray-300 bg-white text-gray-700 h-11 sm:h-12 sm:px-8 sm:text-base transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                  onClick={() => {
                    setFormData({
                      customerName: "",
                      idCard: "",
                      address: "",
                      savingBookCode: "",
                      savingsType: "",
                      initialDeposit: "",
                      openDate: getTodayDateString(),
                    });
                    setErrors({});
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 🎉 Cute Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="rounded-sm sm:rounded-sm max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                <div className="relative duration-500 animate-in zoom-in-0">
                  <div
                    className="flex items-center justify-center w-20 h-20 mb-3 rounded-md border border-gray-200 sm:w-24 sm:h-24 sm:mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    }}
                  >
                    <CheckCircle2
                      size={40}
                      className="text-white duration-700 sm:w-12 sm:h-12 animate-in zoom-in-50"
                    />
                  </div>
                  <Sparkles
                    className="absolute text-yellow-400 -top-2 -right-2 animate-pulse"
                    size={20}
                  />
                  <Heart
                    className="absolute text-pink-400 -bottom-2 -left-2 animate-bounce"
                    size={16}
                    fill="currentColor"
                  />
                </div>
                <PiggyBankIllustration size={60} className="sm:w-20" />
              </div>
              <DialogTitle className="text-xl text-center sm:text-2xl">
                Saving Book Opened Successfully! 🎉
              </DialogTitle>
              <DialogDescription className="text-sm text-center sm:text-base">
                Your new saving book has been created
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-3 sm:py-4">
              <div
                className="p-4 space-y-2 duration-500 delay-200 border-2 sm:p-6 rounded-sm sm:space-y-3 animate-in slide-in-from-bottom-4"
                style={{
                  background:
                    "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)",
                  borderColor: "#00AEEF40",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    Saving Book ID:
                  </span>
                  <span className="font-semibold text-base sm:text-lg text-[#1A4D8F] truncate">
                    {accountCode}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="shrink-0 text-xs text-gray-600 sm:text-sm">
                    Customer:
                  </span>
                  <span className="text-sm font-medium text-right truncate sm:text-base">
                    {createdAccountData?.customerName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="shrink-0 text-xs text-gray-600 sm:text-sm">
                    Type:
                  </span>
                  <span className="text-sm font-medium text-right capitalize truncate sm:text-base">
                    {
                      savingTypes.find(
                        (t) => t.id === createdAccountData?.savingsType
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    Amount:
                  </span>
                  <span className="text-sm font-semibold text-green-600 truncate sm:text-base">
                    {formatVnNumber(createdAccountData?.initialDeposit || 0)}₫
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    Opening Date:
                  </span>
                  <span className="text-sm font-medium sm:text-base">
                    {formatDateToDDMMYYYY(createdAccountData?.openDate)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-11 sm:h-12 text-white rounded-md font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

        {/* Error Dialog for failed account opening */}
        <Dialog open={showError} onOpenChange={setShowError}>
          <DialogContent className="rounded-sm sm:rounded-sm max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                <div
                  className="flex items-center justify-center w-20 h-20 mb-3 rounded-md border border-gray-200 sm:w-24 sm:h-24 sm:mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #F87171 0%, #FBBF24 100%)",
                  }}
                >
                  <Heart size={40} className="text-white animate-bounce" />
                </div>
                <PiggyBankIllustration size={60} className="sm:w-20" />
              </div>
              <DialogTitle className="text-xl text-center sm:text-2xl text-red-600">
                Failed to Open saving book
              </DialogTitle>
              <DialogDescription className="text-sm text-center sm:text-base text-red-500">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setShowError(false)}
              className="w-full h-11 sm:h-12 text-white rounded-md font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #F87171 0%, #FBBF24 100%)",
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

        {/* Customer Not Found Dialog */}
        <Dialog
          open={showRegisterCustomerDialog}
          onOpenChange={setShowRegisterCustomerDialog}
        >
          <DialogContent className="rounded-sm sm:rounded-sm max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                <div
                  className="flex items-center justify-center w-20 h-20 mb-3 rounded-md border border-gray-200 sm:w-24 sm:h-24 sm:mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  }}
                >
                  <UserIcon size={40} className="text-white sm:w-12 sm:h-12" />
                </div>
              </div>
              <DialogTitle className="text-xl text-center sm:text-2xl text-gray-900">
                Customer not found
              </DialogTitle>
              <DialogDescription className="text-sm text-center sm:text-base text-gray-600">
                This customer has not registered personal information in our
                service yet. Would you like to register now?
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2 sm:gap-4">
              <Button
                type="button"
                onClick={handleRegisterNow}
                className="w-full h-11 sm:h-12 text-white rounded-md font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                }}
              >
                Register now
              </Button>
              <Button
                onClick={handleCloseRegisterCustomerDialog}
                variant="outline"
                className="w-full h-11 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base hover:bg-gray-50"
              >
                Not now
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Register Customer Form Dialog (placeholder) */}
        <Dialog
          open={showRegisterCustomerFormDialog}
          onOpenChange={setShowRegisterCustomerFormDialog}
        >
          <DialogContent className="rounded-sm sm:rounded-sm max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl text-center sm:text-2xl text-gray-900">
                Register Customer
              </DialogTitle>
              <DialogDescription className="text-sm text-center sm:text-base text-gray-600">
                Enter customer details to register. Citizen ID is pre-filled and
                read-only.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 sm:text-base">
                  Citizen ID
                </Label>
                <Input
                  value={registerCustomerForm.citizenId}
                  readOnly
                  disabled
                  className="h-11 sm:h-12 rounded-sm border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 sm:text-base">
                  Full name
                </Label>
                <Input
                  value={registerCustomerForm.fullName}
                  onChange={(e) =>
                    setRegisterCustomerForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                  className="h-11 sm:h-12 rounded-sm border-gray-200"
                />
                {registerCustomerErrors.fullName && (
                  <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                    <span className="text-xs">⚠️</span>{" "}
                    {registerCustomerErrors.fullName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 sm:text-base">
                  Street
                </Label>
                <Input
                  value={registerCustomerForm.street}
                  onChange={(e) =>
                    setRegisterCustomerForm((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  placeholder="Enter street address"
                  className="h-11 sm:h-12 rounded-sm border-gray-200"
                />
                {registerCustomerErrors.street && (
                  <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                    <span className="text-xs">⚠️</span>{" "}
                    {registerCustomerErrors.street}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    District
                  </Label>
                  <Input
                    value={registerCustomerForm.district}
                    onChange={(e) =>
                      setRegisterCustomerForm((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                    placeholder="District"
                    className="h-11 sm:h-12 rounded-sm border-gray-200"
                  />
                  {registerCustomerErrors.district && (
                    <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                      <span className="text-xs">⚠️</span>{" "}
                      {registerCustomerErrors.district}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Province
                  </Label>
                  <Input
                    value={registerCustomerForm.province}
                    onChange={(e) =>
                      setRegisterCustomerForm((prev) => ({
                        ...prev,
                        province: e.target.value,
                      }))
                    }
                    placeholder="Province"
                    className="h-11 sm:h-12 rounded-sm border-gray-200"
                  />
                  {registerCustomerErrors.province && (
                    <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                      <span className="text-xs">⚠️</span>{" "}
                      {registerCustomerErrors.province}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {registerSubmitError && (
              <p className="text-sm sm:text-base text-red-600">
                {registerSubmitError}
              </p>
            )}

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                onClick={handleSubmitRegisterCustomer}
                disabled={isSubmittingRegister}
                className="flex-1 h-11 sm:h-12 px-4 sm:px-6 text-white rounded-md font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                }}
              >
                {isSubmittingRegister ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </span>
                ) : (
                  "Create customer"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 sm:h-12 px-4 sm:px-6 border-gray-300 rounded-md text-sm sm:text-base hover:bg-gray-50"
                onClick={() => setShowRegisterCustomerFormDialog(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
