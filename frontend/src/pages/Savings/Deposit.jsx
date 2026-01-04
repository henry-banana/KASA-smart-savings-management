import React, { useState, useEffect } from "react";
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
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Coins,
  ArrowDownCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { StarDecor, CoinsIllustration } from "../../components/CuteComponents";
import { AccountInfoSkeleton } from "../../components/ui/loading-skeleton";
import {
  getAccountInfo,
  depositMoney,
} from "../../services/transactionService";
import { formatVnNumber } from "../../utils/numberFormatter";
import { getRegulations } from "../../services/regulationService";
import { BUSINESS_RULES } from "@/constants/business";
import { RoleGuard } from "../../components/RoleGuard";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";

export default function Deposit() {
  const [accountId, setAccountId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Snapshot data for success modal (persist after reset)
  const [receiptData, setReceiptData] = useState(null);

  // Minimum balance from regulations (dynamic)
  const [minDeposit, setMinDeposit] = useState(null);
  const [regulationsError, setRegulationsError] = useState("");
  const [loadingRegulations, setLoadingRegulations] = useState(true);
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const [retryingServer, setRetryingServer] = useState(false);

  // Fetch regulations on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      setLoadingRegulations(true);
      setRegulationsError("");
      try {
        const resp = await getRegulations();
        if (resp.success && resp.data?.minimumBalance) {
          // Use API value, but ensure it's at least the minimum business rule
          const apiValue = resp.data.minimumBalance;
          const minValue = Math.max(apiValue, BUSINESS_RULES.MIN_DEPOSIT);
          setMinDeposit(minValue);
        } else {
          // Fallback to business rule if API fails
          setMinDeposit(BUSINESS_RULES.MIN_DEPOSIT);
          setRegulationsError("Using default minimum balance");
        }
      } catch (err) {
        console.error("Fetch regulations error:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerUnavailable(true);
        } else {
          // Fallback to business rule
          setMinDeposit(BUSINESS_RULES.MIN_DEPOSIT);
          setRegulationsError(err.message || "Failed to load regulations");
        }
      } finally {
        setLoadingRegulations(false);
      }
    };
    fetchRegulations();
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

  const handleAccountLookup = async () => {
    setError("");
    setAccountInfo(null);
    setIsLookingUp(true);

    try {
      const response = await getAccountInfo(accountId);
      const account = response.data;

      if (account.status?.toLowerCase() === "close") {
        setError("Saving book was closed");
        return;
      }

      if (account.accountTypeName !== "No term") {
        setError("Deposits are only allowed for No term savings books");
        return;
      }

      setAccountInfo(account);
    } catch (err) {
      console.error("Account lookup error:", err);
      setError(err.message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountInfo) {
      setError("Please lookup a valid account first");
      return;
    }

    const amount = Number(depositAmount);

    if (!depositAmount || amount <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }

    if (!minDeposit || amount < minDeposit) {
      setError(
        `Minimum balance amount is ${
          minDeposit ? formatVnNumber(minDeposit) : "..."
        }₫`
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await depositMoney(accountId, amount);
      // Calculate new balance: current balance + deposit amount
      const balanceAfter =
        response.data?.balanceAfter || accountInfo.balance + amount;
      setReceiptData({
        accountId,
        customerName: accountInfo.customerName,
        depositAmount: amount,
        newBalance: balanceAfter,
      });
      setShowSuccess(true);

      // Reset form (keep receipt snapshot)
      setTimeout(() => {
        setAccountId("");
        setDepositAmount("");
        setAccountInfo(null);
        setError("");
      }, 500);
    } catch (err) {
      console.error("Deposit error:", err);
      if (isServerUnavailable(err)) {
        setServerUnavailable(true);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allow={["teller"]}>
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden border border-gray-200 rounded-sm lg:rounded-sm">
          {/* Cute Header */}
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
                    "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
                }}
              >
                <ArrowDownCircle
                  size={24}
                  className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                  <span className="truncate">Make Deposit</span>
                  <span className="shrink-0 text-xl sm:text-2xl">💰</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Deposit money to savings account (Form BM2)
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-6 sm:p-6 lg:p-8">
            {/* Account Lookup Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Search size={18} className="sm:w-5 sm:h-5 text-[#1A4D8F]" />
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Account Lookup
                </h3>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Input
                    value={accountId}
                    onChange={(e) => {
                      setAccountId(e.target.value.toUpperCase());
                      setAccountInfo(null);
                      setError("");
                    }}
                    placeholder="Enter saving book ID (e.g., 12345)"
                    className="h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAccountLookup()
                    }
                    disabled={!!regulationsError || loadingRegulations}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAccountLookup}
                  disabled={
                    isLookingUp ||
                    !accountId ||
                    !!regulationsError ||
                    loadingRegulations
                  }
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-sm bg-[#1A4D8F] hover:bg-[#154171] text-white text-sm sm:text-base"
                >
                  <Search
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] sm:mr-2"
                  />
                  {loadingRegulations
                    ? "Loading..."
                    : isLookingUp
                    ? "Lookup..."
                    : "Lookup"}
                </Button>
              </div>

              {error && !accountInfo && (
                <div className="flex items-start gap-3 p-4 border-2 border-red-200 bg-red-50 rounded-sm">
                  <AlertCircle
                    size={20}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-red-700">Error</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {isLookingUp && <AccountInfoSkeleton />}

              {accountInfo && (
                <div
                  className="relative p-6 space-y-3 overflow-hidden border-2 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)",
                    borderColor: "#00AEEF40",
                  }}
                >
                  <StarDecor className="top-2 right-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Saving Book ID:
                    </span>
                    <span className="font-semibold text-[#1A4D8F]">
                      {accountInfo.bookId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Customer Name:
                    </span>
                    <span className="font-medium">
                      {accountInfo.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Saving Book Type:
                    </span>
                    <Badge className="text-blue-700 bg-blue-100 border-blue-200">
                      No term
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      Current Balance:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatVnNumber(accountInfo.balance ?? 0)}₫
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Deposit Form */}
            {accountInfo && (
              <form
                onSubmit={handleSubmit}
                className="pt-4 space-y-6 border-t border-gray-100"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins size={20} className="text-[#00AEEF]" />
                    <h3 className="font-semibold text-gray-900">
                      Deposit Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depositAmount" className="text-gray-700">
                      Deposit Amount (VND) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="depositAmount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => {
                          setDepositAmount(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter deposit amount"
                        className="pl-8 h-14 text-lg rounded-sm border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                      />
                      <span className="absolute text-lg font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2">
                        ₫
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <span>💡</span>{" "}
                      {loadingRegulations
                        ? "Loading minimum amount..."
                        : `Minimum amount: ${
                            formatVnNumber(minDeposit ?? 0) ?? "..."
                          }₫`}
                    </p>
                  </div>

                  {error && accountInfo && (
                    <div className="flex items-start gap-3 p-4 border-2 border-red-200 bg-red-50 rounded-sm">
                      <AlertCircle
                        size={20}
                        className="text-red-500 shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Quick Amount Buttons */}
                  {minDeposit && (
                    <div className="space-y-2">
                      <Label className="text-gray-700">Quick Amount:</Label>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[1, 5, 10, 50].map((multiplier) => {
                          const amount = minDeposit * multiplier;
                          const label =
                            amount >= 1000000
                              ? `${(amount / 1000000).toFixed(0)}M₫`
                              : `${(amount / 1000).toFixed(0)}K₫`;
                          return (
                            <button
                              key={multiplier}
                              type="button"
                              onClick={() =>
                                setDepositAmount(amount.toString())
                              }
                              className="h-12 rounded-xs border-2 border-gray-200 hover:border-[#00AEEF] hover:bg-[#E8F6FF] transition-all font-medium text-sm cursor-pointer"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !minDeposit || serverUnavailable}
                    className="flex-1 h-12 text-white rounded-md font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
                    }}
                  >
                    <CheckCircle2 size={18} className="mr-2" />
                    {isSubmitting ? "Processing..." : "Confirm Deposit"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-8 rounded-md border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                    onClick={() => {
                      setAccountId("");
                      setDepositAmount("");
                      setAccountInfo(null);
                      setError("");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md duration-300 rounded-sm animate-in fade-in-0 zoom-in-95">
            <DialogHeader>
              <div className="flex flex-col items-center mb-4">
                <div className="relative duration-500 animate-in zoom-in-0">
                  <div
                    className="flex items-center justify-center w-24 h-24 mb-4 rounded-md border border-gray-200"
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    }}
                  >
                    <TrendingUp
                      size={48}
                      className="text-white duration-700 animate-in zoom-in-50"
                    />
                  </div>
                  <Sparkles
                    className="absolute text-yellow-400 -top-2 -right-2 animate-pulse"
                    size={24}
                  />
                </div>
                <CoinsIllustration size={80} />
              </div>
              <DialogTitle className="text-2xl text-center">
                Deposit Successful! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                The deposit has been processed successfully
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <div
                className="p-6 space-y-3 duration-500 delay-200 border-2 rounded-sm animate-in slide-in-from-bottom-4"
                style={{
                  background:
                    "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)",
                  borderColor: "#00AEEF40",
                }}
              >
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Saving Book ID:</span>
                  <span className="font-semibold text-[#1A4D8F]">
                    {receiptData?.accountId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-medium">
                    {receiptData?.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deposit Amount:</span>
                  <span className="font-semibold text-green-600">
                    +{formatVnNumber(receiptData?.depositAmount || 0)}₫
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">New Balance:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatVnNumber(receiptData?.newBalance || 0)}₫
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowSuccess(false);
                setReceiptData(null);
              }}
              className="w-full h-12 text-white rounded-md font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
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
