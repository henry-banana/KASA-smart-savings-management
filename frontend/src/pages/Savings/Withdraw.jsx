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
  Wallet,
  ArrowUpCircle,
  Sparkles,
} from "lucide-react";
import {
  StarDecor,
  ReceiptIllustration,
} from "../../components/CuteComponents";
import { AccountInfoSkeleton } from "../../components/ui/loading-skeleton";
import {
  getAccountInfo,
  withdrawMoney,
  closeSavingAccount,
} from "../../services/transactionService";
import {
  formatVnNumber,
  formatBalance,
  formatPercentText,
} from "../../utils/numberFormatter";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import { getRegulations } from "@/services/regulationService";
import { RoleGuard } from "../../components/RoleGuard";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";

export default function Withdraw() {
  const [accountId, setAccountId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minWithdrawalDays, setMinWithdrawalDays] = useState(15);
  // Snapshot data for success modal to prevent clearing after reset
  const [receiptData, setReceiptData] = useState(null);

  // Regulations loading state
  const [regulationsError, setRegulationsError] = useState("");
  const [loadingRegulations, setLoadingRegulations] = useState(true);
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const [retryingServer, setRetryingServer] = useState(false);

  // Load regulations (minimum withdrawal days)
  useEffect(() => {
    const fetchRegulations = async () => {
      setLoadingRegulations(true);
      setRegulationsError("");
      try {
        const resp = await getRegulations();
        if (resp?.success && resp.data?.minimumTermDays !== undefined) {
          setMinWithdrawalDays(Number(resp.data.minimumTermDays));
        } else {
          setRegulationsError(
            "Failed to load minimum withdrawal days regulation"
          );
        }
      } catch (err) {
        console.error("Fetch regulations error:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerUnavailable(true);
        } else {
          setRegulationsError(err.message || "Failed to load regulations");
        }
      } finally {
        setLoadingRegulations(false);
      }
    };
    fetchRegulations();
  }, []);

  const calculateDaysDifference = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

      const daysSinceOpen = calculateDaysDifference(account.openDate);

      if (daysSinceOpen < minWithdrawalDays) {
        setError(
          `Account must be open for at least ${formatVnNumber(
            minWithdrawalDays
          )} days. Current: ${formatVnNumber(daysSinceOpen)} days`
        );
        return;
      }

      const newAccountInfo = {
        ...account,
        daysSinceOpen,
        term: account.typeSaving?.term || 0,
      };

      console.log("Setting account info:", newAccountInfo);

      setAccountInfo(newAccountInfo);

      // Auto-fill withdrawal amount for fixed-term accounts (not "No term")
      const typeName = account.typeSaving?.typeName || account.accountTypeName;
      if (typeName && typeName !== "No term") {
        setWithdrawAmount(Math.round(account.balance).toString());
      } else {
        setWithdrawAmount("");
      }
    } catch (err) {
      console.error("Account lookup error:", err);
      setError(err.message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 handleSubmit called");

    if (!accountInfo) {
      setError("Please lookup a valid account first");
      return;
    }

    const amount = Number(withdrawAmount);
    console.log("📝 Amount:", amount, "Balance:", accountInfo.balance);

    if (!withdrawAmount || amount <= 0) {
      setError("Please enter a valid withdrawal amount");
      return;
    }

    if (amount > accountInfo.balance) {
      setError("Insufficient balance");
      return;
    }

    // Determine if this is a close account operation (for fixed-term at maturity)
    let isClosing = false;

    // Check fixed-term withdrawal rules
    console.log(
      "🔍 Type name:",
      accountInfo.accountTypeName,
      "Maturity date:",
      accountInfo.maturityDate
    );

    if (accountInfo.accountTypeName !== "No term") {
      // Use calculated maturity check (which accounts for API response vs calculated discrepancies)
      if (!isFixedTermMatured()) {
        setError("Fixed-term accounts can only be withdrawn at maturity");
        return;
      }

      // For fixed-term at maturity, must withdraw full amount
      console.log(
        "🔢 Check amount match:",
        amount,
        "===",
        Math.round(accountInfo.balance),
        "?",
        amount === Math.round(accountInfo.balance)
      );

      if (Math.round(accountInfo.balance) !== amount) {
        setError(
          "Fixed-term accounts must withdraw the full balance at maturity"
        );
        return;
      }
      isClosing = true;
      console.log("✅ isClosing = true");
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("🚀 Submitting, isClosing:", isClosing);
      if (isClosing) {
        // Use close account API for fixed-term matured accounts
        console.log("📤 Calling closeSavingAccount with accountId:", accountId);
        await closeSavingAccount(accountId);
      } else {
        // Use regular withdraw API for no-term accounts
        console.log("📤 Calling withdrawMoney");
        await withdrawMoney(accountId, amount, false);
      }

      // Store snapshot for modal display
      setReceiptData({
        accountId,
        customerName: accountInfo.customerName,
        totalPayout: amount,
        initialBalance: accountInfo.initialBalance || 0,
        interestAmount: accountInfo.interestAmount || 0,
      });
      setShowSuccess(true);
      console.log("✅ Success! Showing modal");

      // Reset form (keep receipt data & calculated values)
      setTimeout(() => {
        setAccountId("");
        setWithdrawAmount("");
        setAccountInfo(null);
        setError("");
      }, 500);
    } catch (err) {
      console.error("❌ Withdraw error:", err);
      if (isServerUnavailable(err)) {
        setServerUnavailable(true);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
      console.log("🏁 handleSubmit finished");
    }
  };

  const isFixedTermMatured = () => {
    if (!accountInfo || accountInfo.term === 0) return false;

    const today = new Date();
    const openDate = new Date(accountInfo.openDate);

    // Calculate maturity date: openDate + term (in months)
    const maturityDate = new Date(openDate);
    maturityDate.setMonth(maturityDate.getMonth() + accountInfo.term);

    console.log("Debug isFixedTermMatured:", {
      today: today.toDateString(),
      openDate: openDate.toDateString(),
      maturityDate: maturityDate.toDateString(),
      term: accountInfo.term,
      isMatured: today >= maturityDate,
    });

    return today >= maturityDate;
  };

  const isFixedTermAccount = () => {
    return accountInfo && accountInfo.accountTypeName !== "No term";
  };

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
          {/* Cute Header */}
          <CardHeader className="bg-linear-to-r from-[#FFF7D6] to-[#FFE8F0] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute opacity-50 top-6 right-20 sm:right-32 text-amber-400"
              size={20}
            />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xs sm:rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                }}
              >
                <ArrowUpCircle
                  size={24}
                  className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                  <span className="truncate">Make Withdrawal</span>
                  <span className="shrink-0 text-xl sm:text-2xl">💵</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Withdraw money from a savings account
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4 sm:p-6 lg:p-8 sm:space-y-6">
            {/* Account Lookup Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Search size={18} className="sm:w-5 sm:h-5 text-[#F59E0B]" />
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Account Lookup
                </h3>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Input
                    value={accountId}
                    onChange={(e) => {
                      setAccountId(e.target.value);
                      setAccountInfo(null);
                      setError("");
                    }}
                    placeholder="Enter Saving Book ID, ID citizen number (e.g., 12345)"
                    className="h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#F59E0B] focus:ring-[#F59E0B] transition-all text-sm sm:text-base"
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
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-sm bg-[#F59E0B] hover:bg-[#E5930E] text-white text-sm sm:text-base"
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
                      "linear-gradient(135deg, #FFF7D6 0%, #FFE8F0 100%)",
                    borderColor: "#F59E0B40",
                  }}
                >
                  <StarDecor className="top-2 right-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Customer Name</p>
                      <p className="text-sm font-medium">
                        {accountInfo.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Saving Book Type</p>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        {accountInfo.accountTypeName}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Balance</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatBalance(accountInfo.balance ?? 0)}₫
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Open Date</p>
                      <p className="text-sm font-medium">
                        {formatDateToDDMMYYYY(accountInfo.openDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Days Since Open</p>
                      <p className="text-sm font-medium">
                        {accountInfo.daysSinceOpen} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Interest Rate</p>
                      <p className="text-sm font-medium">
                        {formatPercentText(
                          `${accountInfo.interestRate.toFixed(1)}% per month`
                        )}
                      </p>
                    </div>
                    {accountInfo.accountTypeName !== "No term" && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Maturity Date</p>
                          <p className="text-sm font-medium">
                            {formatDateToDDMMYYYY(accountInfo.maturityDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          {isFixedTermMatured() ? (
                            <Badge className="text-green-800 bg-green-100">
                              Matured
                            </Badge>
                          ) : (
                            <Badge className="text-yellow-800 bg-yellow-100">
                              Not Matured
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={20} className="text-[#F59E0B]" />
                  <h3 className="font-semibold text-gray-900">
                    Withdrawal Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount" className="text-gray-700">
                    Withdrawal Amount (VND) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="withdrawAmount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = Number(value);

                        // Prevent entering negative amounts
                        if (numValue < 0) {
                          setWithdrawAmount("");
                          return;
                        }

                        // Round to nearest integer (no decimal places)
                        const roundedValue = Math.round(numValue);

                        // Prevent entering amount greater than balance
                        if (accountInfo && roundedValue > accountInfo.balance) {
                          setWithdrawAmount(
                            Math.round(accountInfo.balance).toString()
                          );
                        } else {
                          setWithdrawAmount(roundedValue.toString());
                        }
                      }}
                      placeholder="Enter amount"
                      disabled={!accountInfo || isFixedTermAccount()}
                      min="0"
                      max={accountInfo?.balance || undefined}
                      step="1"
                      className="pl-8 h-14 text-lg rounded-sm border-gray-200 focus:border-[#F59E0B] focus:ring-[#F59E0B] transition-all"
                    />
                    <span className="absolute text-lg font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2">
                      ₫
                    </span>
                  </div>
                  {accountInfo && withdrawAmount && (
                    <div
                      className="p-6 border-2 rounded-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)",
                        borderColor: "#F59E0B20",
                      }}
                    >
                      {/* Show breakdown for fixed-term accounts only */}
                      {accountInfo.accountTypeName !== "No term" && (
                        <div className="space-y-4 pb-4 mb-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-base text-gray-500 font-normal">
                              Initial Balance:
                            </span>
                            <span className="text-base font-medium text-gray-800">
                              {formatBalance(accountInfo.initialBalance ?? 0)}₫
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-base text-gray-500 font-normal">
                              Interest Amount:
                            </span>
                            <span className="text-base font-medium text-green-600">
                              +{formatBalance(accountInfo.interestAmount ?? 0)}₫
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-700">
                          Total Payout:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatBalance(Number(withdrawAmount))}₫
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={
                    !accountInfo ||
                    !withdrawAmount ||
                    Number(withdrawAmount) <= 0 ||
                    (isFixedTermAccount() && !isFixedTermMatured()) ||
                    isSubmitting ||
                    serverUnavailable
                  }
                  className="flex-1 h-12 text-white rounded-md font-medium border border-gray-200 hover:border-gray-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background:
                      isFixedTermAccount() && !isFixedTermMatured()
                        ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                        : "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  }}
                >
                  <CheckCircle2 size={18} className="mr-2" />
                  {isFixedTermAccount()
                    ? "Close Savings Account"
                    : "Confirm Withdrawal"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-8 rounded-md border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                  onClick={() => {
                    setAccountId("");
                    setWithdrawAmount("");
                    setAccountInfo(null);
                    setError("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>

            {/* Helper Text */}
            <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
              <h5 className="mb-2 text-sm text-blue-900">Withdrawal Rules:</h5>
              <ul className="space-y-1 text-sm text-blue-800 list-disc list-inside">
                <li>
                  Account must be open for at least{" "}
                  {formatVnNumber(minWithdrawalDays)} days
                </li>
                <li>No-Term accounts: Partial withdrawals allowed</li>
                <li>
                  Fixed-Term accounts: Can only withdraw after the first
                  maturity date
                </li>
                <li>
                  Fixed-Term accounts: Must withdraw full balance after maturity
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md duration-300 rounded-sm animate-in fade-in-0 zoom-in-95">
            <DialogHeader>
              <div className="flex flex-col items-center mb-4">
                <div className="relative duration-500 animate-in zoom-in-0">
                  <div
                    className="flex items-center justify-center w-24 h-24 mb-4 rounded-md border border-gray-200 "
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    }}
                  >
                    <CheckCircle2
                      size={48}
                      className="text-white duration-700 animate-in zoom-in-50"
                    />
                  </div>
                  <Sparkles
                    className="absolute text-yellow-400 -top-2 -right-2 animate-pulse"
                    size={24}
                  />
                </div>
                <ReceiptIllustration size={80} />
              </div>
              <DialogTitle className="text-2xl text-center">
                Withdrawal Successful! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                The withdrawal has been processed successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <div
                className="p-6 space-y-3 duration-500 delay-200 border-2 rounded-sm animate-in slide-in-from-bottom-4"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF7D6 0%, #FFE8F0 100%)",
                  borderColor: "#F59E0B40",
                }}
              >
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Saving Book ID:</span>
                  <span className="font-semibold text-[#F59E0B]">
                    {receiptData?.accountId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-medium">
                    {receiptData?.customerName}
                  </span>
                </div>
                {receiptData?.initialBalance > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Initial Balance:
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatBalance(receiptData.initialBalance)}₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Interest Amount:
                      </span>
                      <span className="font-medium text-green-600">
                        +{formatBalance(receiptData.interestAmount)}₫
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700">
                    Total Payout:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatVnNumber(receiptData?.totalPayout || 0)}₫
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 text-white rounded-md font-medium border border-gray-200 hover:border-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
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
