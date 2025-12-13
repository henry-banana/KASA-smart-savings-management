import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { formatVnNumber } from "../../utils/numberFormatter";
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
import { getInterestRates, getRegulations } from "@/services/regulationService";
import { customerService } from "../../services/customerService";
import { RoleGuard } from "../../components/RoleGuard";
import { useAuthContext } from "../../contexts/AuthContext";

export default function OpenAccount() {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    customerName: "",
    idCard: "",
    address: "",
    savingsType: "",
    initialDeposit: "",
    openDate: new Date().toISOString().split("T")[0],
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

  // Minimum balance from regulations (dynamic)
  const [minBalance, setMinBalance] = useState(null);
  const [regulationsError, setRegulationsError] = useState("");
  const [loadingRegulations, setLoadingRegulations] = useState(true);

  // Customer lookup state
  const [isLookingUpCustomer, setIsLookingUpCustomer] = useState(false);
  const [lookupStatus, setLookupStatus] = useState("idle"); // 'idle' | 'found' | 'not_found' | 'error'
  const idCardInputRef = useRef(null);

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
        setErrors((prev) => ({ ...prev, idCard: "" }));
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
    setFormData((prev) => ({ ...prev, customerName: "", address: "" }));
    setTimeout(() => {
      idCardInputRef.current?.focus();
    }, 0);
  };

  // Placeholder handler for opening customer registration form
  const handleOpenRegisterCustomerForm = () => {
    console.log(
      "[TODO] Open customer registration form for ID:",
      formData.idCard
    );
    // TODO: Implement customer registration form/flow
    // This could navigate to a registration page or open a registration modal
    setShowRegisterCustomerDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.customerName)
      newErrors.customerName = "Please enter customer name";
    if (!formData.idCard) newErrors.idCard = "Please enter ID card number";
    if (!formData.address) newErrors.address = "Please enter address";
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
            savingsType: "",
            initialDeposit: "",
            openDate: new Date().toISOString().split("T")[0],
          });
        }, 500);
      } catch (err) {
        console.error("Create saving book error:", err);
        setErrorMessage(err.message || "Failed to open account.");
        setShowError(true);
        setErrors({ submit: err.message });
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
          setMinBalance(resp.data.minimumBalance);
        } else {
          setRegulationsError("Cannot load minimum balance rule");
        }
      } catch (err) {
        console.error("Fetch regulations error:", err);
        setRegulationsError(err.message || "Cannot load minimum balance rule");
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
        const resp = await getInterestRates();
        if (resp.success && Array.isArray(resp.data)) {
          const mapped = resp.data.map((ts) => ({
            id: ts.typeSavingId,
            name: ts.typeName,
            description:
              ts.term === 0
                ? "Flexible withdrawal"
                : `Fixed term ${formatVnNumber(ts.term)} month${
                    ts.term > 1 ? "s" : ""
                  }`,
            interestRate: ts.rate,
            term: ts.term,
            emoji:
              ts.term === 0
                ? "🔄"
                : ts.term === 3
                ? "📅"
                : ts.term === 6
                ? "⭐"
                : "🔥",
            color:
              ts.term === 0
                ? "from-[#1A4D8F] to-[#2563A8]"
                : ts.term === 3
                ? "from-[#00AEEF] to-[#33BFF3]"
                : ts.term === 6
                ? "from-[#60A5FA] to-[#93C5FD]"
                : "from-[#10B981] to-[#34D399]",
          }));
          setSavingTypes(mapped);
        }
      } catch (e) {
        console.error("Failed to load saving types", e);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

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
                  <span className="truncate">Open New Savings Account</span>
                  <span className="shrink-0 text-xl sm:text-2xl">🏦</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Create a new savings account for customer (Form BM1)
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
                          onChange={(e) =>
                            setFormData({ ...formData, idCard: e.target.value })
                          }
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
                    {lookupStatus === "not_found" &&
                      !showRegisterCustomerDialog && (
                        <p className="flex items-center gap-1 text-xs text-amber-600 sm:text-sm">
                          <span className="text-xs">⚠</span> Customer not found
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
                        className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 bg-gray-50 text-gray-600 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base cursor-not-allowed"
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
                </div>
              </div>

              {/* Savings Details Section */}
              <div className="pt-4 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Coins size={18} className="sm:w-5 sm:h-5 text-[#00AEEF]" />
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    Savings Account Details
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Savings Type * (Select one)
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initialDeposit: e.target.value,
                          })
                        }
                        placeholder={
                          minBalance
                            ? `Minimum: ${formatVnNumber(minBalance)}`
                            : "Enter amount"
                        }
                        disabled={!!regulationsError || loadingRegulations}
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
                        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                        size={16}
                      />
                      <Input
                        id="openDate"
                        type="date"
                        value={formData.openDate}
                        onChange={(e) =>
                          setFormData({ ...formData, openDate: e.target.value })
                        }
                        disabled
                        className="pl-10 text-sm border-gray-200 h-11 sm:h-12 rounded-sm bg-gray-50 sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:gap-4 sm:pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !minBalance || !!regulationsError}
                  className="flex-1 h-11 sm:h-12 text-white rounded-md font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                  }}
                >
                  <CheckCircle2
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] mr-2"
                  />
                  {isSubmitting ? "Processing..." : "Confirm Open Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm border-gray-300 rounded-md h-11 sm:h-12 sm:px-8 hover:bg-gray-50 sm:text-base"
                  onClick={() => {
                    setFormData({
                      customerName: "",
                      idCard: "",
                      address: "",
                      savingsType: "",
                      initialDeposit: "",
                      openDate: new Date().toISOString().split("T")[0],
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
                Account Opened Successfully! 🎉
              </DialogTitle>
              <DialogDescription className="text-sm text-center sm:text-base">
                Your new savings account has been created
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
                    Account Code:
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
                    {createdAccountData?.openDate}
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
                Failed to Open Account
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
                onClick={handleOpenRegisterCustomerForm}
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
      </div>
    </RoleGuard>
  );
}
