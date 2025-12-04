import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
} from "lucide-react";
import {
  StarDecor,
  PiggyBankIllustration,
} from "../../components/CuteComponents";
import { createSavingBook } from "../../services/savingBookService";
import { getInterestRates, getRegulations } from "@/services/regulationService";
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

  // Minimum balance from regulations (dynamic)
  const [minBalance, setMinBalance] = useState(null);
  const [regulationsError, setRegulationsError] = useState("");
  const [loadingRegulations, setLoadingRegulations] = useState(true);

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
      newErrors.initialDeposit = `Minimum amount is ₫${
        minBalance ? minBalance.toLocaleString() : "..."
      }`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await createSavingBook({
          ...formData,
          employeeId: user?.userId || user?.id || "NV001",
        });
        setAccountCode(response.data.accountCode);
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
                : `Fixed term ${ts.term} month${ts.term > 1 ? "s" : ""}`,
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
        <Card className="overflow-hidden border border-gray-200 rounded-2xl lg:rounded-3xl">
          {/* Cute Header with Gradient */}
          <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute opacity-50 top-6 right-20 sm:right-32 text-cyan-300"
              size={20}
            />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl"
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
                        placeholder="Enter full name"
                        className="pl-10 h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span>{" "}
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="idCard"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      ID Citizen Number *
                    </Label>
                    <div className="relative">
                      <CreditCard
                        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                        size={16}
                      />
                      <Input
                        id="idCard"
                        value={formData.idCard}
                        onChange={(e) =>
                          setFormData({ ...formData, idCard: e.target.value })
                        }
                        placeholder="Enter ID citizen number"
                        className="pl-10 h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                      />
                    </div>
                    {errors.idCard && (
                      <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                        <span className="text-xs">⚠️</span> {errors.idCard}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
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
                      placeholder="Enter full address"
                      rows={3}
                      className="pl-10 rounded-2xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                    />
                  </div>
                  {errors.address && (
                    <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                      <span className="text-xs">⚠️</span> {errors.address}
                    </p>
                  )}
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
                          className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group cursor-pointer ${
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
                            {type.interestRate}%
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
                      <span className="absolute text-sm font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2 sm:text-base">
                        ₫
                      </span>
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
                            ? `Minimum: ${minBalance.toLocaleString()}`
                            : "Enter amount"
                        }
                        disabled={!!regulationsError || loadingRegulations}
                        className="pl-7 sm:pl-8 h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                      />
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
                        : `Minimum amount: ₫${
                            minBalance?.toLocaleString() ?? "..."
                          }`}
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
                        className="pl-10 text-sm border-gray-200 h-11 sm:h-12 rounded-2xl bg-gray-50 sm:text-base"
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
                  className="flex-1 h-11 sm:h-12 text-white rounded-full font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
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
                  className="text-sm border-gray-300 rounded-full h-11 sm:h-12 sm:px-8 hover:bg-gray-50 sm:text-base"
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
          <DialogContent className="rounded-2xl sm:rounded-3xl max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                <div className="relative duration-500 animate-in zoom-in-0">
                  <div
                    className="flex items-center justify-center w-20 h-20 mb-3 rounded-full border border-gray-200 sm:w-24 sm:h-24 sm:mb-4"
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
                className="p-4 space-y-2 duration-500 delay-200 border-2 sm:p-6 rounded-2xl sm:space-y-3 animate-in slide-in-from-bottom-4"
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
                    ₫
                    {Number(
                      createdAccountData?.initialDeposit || 0
                    ).toLocaleString()}
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
              className="w-full h-11 sm:h-12 text-white rounded-full font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
          <DialogContent className="rounded-2xl sm:rounded-3xl max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
            <DialogHeader>
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                <div
                  className="flex items-center justify-center w-20 h-20 mb-3 rounded-full border border-gray-200 sm:w-24 sm:h-24 sm:mb-4"
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
              className="w-full h-11 sm:h-12 text-white rounded-full font-medium border border-gray-200 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #F87171 0%, #FBBF24 100%)",
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
