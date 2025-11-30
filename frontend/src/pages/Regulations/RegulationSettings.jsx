import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getRegulations,
  updateRegulations,
} from "@/services/regulationService";
import {
  getInterestRates,
  getChangeHistory,
  updateInterestRates,
} from "@/services/regulationService";
import {
  createTypeSaving,
  deleteTypeSaving,
  resetTypeSavingDefaults,
  getAllTypeSavings,
} from "@/services/typeSavingService";
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
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  CheckCircle2,
  AlertTriangle,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { StarDecor } from "../../components/CuteComponents";
import { RoleGuard } from "../../components/RoleGuard";

export default function RegulationSettings() {
  const { user } = useAuth();
  const [minDeposit, setMinDeposit] = useState("100000");
  const [minWithdrawalDays, setMinWithdrawalDays] = useState("15");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCreateTypeSaving, setShowCreateTypeSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTypeSavings, setSelectedTypeSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [typeSavingForm, setTypeSavingForm] = useState({
    typename: "",
    term: "",
    interestRate: "",
  });

  // Fetch regulations on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        setLoading(true);

        // Fetch basic regulations
        const response = await getRegulations();
        if (response.success && response.data) {
          setMinDeposit(String(response.data.minimumDepositAmount));
          setMinWithdrawalDays(String(response.data.minimumTermDays));
        }

        // Fetch interest rates - now using getInterestRates instead of getAllTypeSavings
        try {
          const ratesResponse = await getInterestRates();
          if (ratesResponse.success && ratesResponse.data) {
            setInterestRates(ratesResponse.data);
          } else {
            // Fallback: if getInterestRates fails, try getAllTypeSavings
            const typesResponse = await getAllTypeSavings();
            if (typesResponse.success && typesResponse.data) {
              const formattedRates = typesResponse.data.map((ts) => ({
                typeSavingId: ts.typeSavingId,
                typeName: ts.typeName,
                rate: ts.interestRate,
                term: ts.term,
                editable: true,
              }));
              setInterestRates(formattedRates);
            }
          }
        } catch (err) {
          console.error("Failed to fetch interest rates:", err);
          // Try fallback to getAllTypeSavings
          try {
            const typesResponse = await getAllTypeSavings();
            if (typesResponse.success && typesResponse.data) {
              const formattedRates = typesResponse.data.map((ts) => ({
                typeSavingId: ts.typeSavingId,
                typeName: ts.typeName,
                rate: ts.interestRate,
                term: ts.term,
                editable: true,
              }));
              setInterestRates(formattedRates);
            }
          } catch (fallbackErr) {
            console.error(
              "Failed to fetch type savings as fallback:",
              fallbackErr
            );
          }
        }

        // Fetch change history
        try {
          const historyResponse = await getChangeHistory();
          if (historyResponse.success && historyResponse.data) {
            setChangeHistory(historyResponse.data);
          }
        } catch (err) {
          console.error("Failed to fetch change history:", err);
        }
      } catch (err) {
        console.error("Failed to fetch regulations:", err);
        setError("Failed to load regulations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();
  }, []);

  const [interestRates, setInterestRates] = useState([]);

  const [changeHistory, setChangeHistory] = useState([]);

  const handleUpdateRate = (index, newRate) => {
    const updated = [...interestRates];
    updated[index].rate = newRate;
    setInterestRates(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    try {
      setShowConfirm(false);
      setLoading(true);

      const payload = {
        minimumDepositAmount: Number(minDeposit),
        minimumTermDays: Number(minWithdrawalDays),
      };

      const response = await updateRegulations(payload);

      if (response.success && response.data) {
        // Update local state from response
        setMinDeposit(String(response.data.minimumDepositAmount));
        setMinWithdrawalDays(String(response.data.minimumTermDays));
        // Persist interest rate changes
        try {
          const ratesToUpdate = interestRates.map((r) => ({
            typeSavingId: r.typeSavingId,
            typeName: r.typeName,
            rate: Number(r.rate),
            term: Number(r.term ?? 0),
            editable: r.editable,
          }));
          const rateUpdateResp = await updateInterestRates(ratesToUpdate);
          if (rateUpdateResp.success) {
            setInterestRates(rateUpdateResp.data);
          }
        } catch (e) {
          console.error("Failed to update interest rates:", e);
          setError("Failed to update interest rates");
        }
        setSuccessMessage("Regulations updated successfully");
        setShowSuccess(true);

        // Refresh change history from API
        try {
          const historyResponse = await getChangeHistory();
          if (historyResponse.success && historyResponse.data) {
            setChangeHistory(historyResponse.data);
          }
        } catch (err) {
          console.error("Failed to refresh change history:", err);
          // Fallback: add a placeholder entry
          setChangeHistory((prev) => [
            {
              date: new Date().toISOString().split("T")[0],
              user: user.username,
              field: "Regulations",
              oldValue: "Previous",
              newValue: "Updated",
            },
            ...prev,
          ]);
        }
      } else {
        setError(response.message || "Failed to update regulations");
      }
    } catch (err) {
      console.error("Failed to update regulations:", err);
      setError("Failed to update regulations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allow={["admin"]}>
      <div className="space-y-4 sm:space-y-6">
        {/* Settings Form */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-2xl lg:rounded-3xl">
          <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32"
              size={20}
            />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                <Settings
                  size={24}
                  className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 mb-2 text-2xl">
                  Regulation Settings (QĐ6)
                  <span className="text-2xl">⚙️</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Configure system-wide regulations and rules
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 border-2 border-red-200 rounded-2xl bg-red-50">
                <p className="flex items-center gap-2 text-sm text-red-900">
                  <AlertTriangle size={16} />
                  {error}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-200 rounded-full border-t-purple-600 animate-spin"></div>
                  <p className="text-gray-600">Loading regulations...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-900">
                      Basic Regulations
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="minDeposit" className="text-gray-700">
                        Minimum Deposit (VND)
                      </Label>
                      <Input
                        id="minDeposit"
                        type="number"
                        value={minDeposit}
                        onChange={(e) => setMinDeposit(e.target.value)}
                        className="border-gray-200 h-11 rounded-xl"
                      />
                      <p className="text-xs text-gray-500">
                        Minimum amount to open account or deposit
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="minWithdrawalDays"
                        className="text-gray-700"
                      >
                        Minimum Withdrawal Period (Days)
                      </Label>
                      <Input
                        id="minWithdrawalDays"
                        type="number"
                        value={minWithdrawalDays}
                        onChange={(e) => setMinWithdrawalDays(e.target.value)}
                        className="border-gray-200 h-11 rounded-xl"
                      />
                      <p className="text-xs text-gray-500">
                        Minimum days before withdrawal allowed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interest Rates */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">
                        Interest Rates by Account Type
                      </h4>
                    </div>
                    {selectedTypeSavings.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {selectedTypeSavings.length} selected
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTypeSavings([])}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden border rounded-2xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                          <TableHead className="w-12 font-semibold">
                            <Checkbox
                              checked={
                                selectedTypeSavings.length ===
                                  interestRates.length &&
                                interestRates.length > 0
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTypeSavings(
                                    interestRates.map(
                                      (item) => item.typeSavingId
                                    )
                                  );
                                } else {
                                  setSelectedTypeSavings([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="font-semibold">
                            Savings Account Type
                          </TableHead>
                          <TableHead className="font-semibold">
                            Term (months)
                          </TableHead>
                          <TableHead className="font-semibold">
                            Interest Rate (% per month)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interestRates.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-[#F8F9FC] transition-colors"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedTypeSavings.includes(
                                  item.typeSavingId
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTypeSavings([
                                      ...selectedTypeSavings,
                                      item.typeSavingId,
                                    ]);
                                  } else {
                                    setSelectedTypeSavings(
                                      selectedTypeSavings.filter(
                                        (id) => id !== item.typeSavingId
                                      )
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.typeName}
                            </TableCell>
                            <TableCell className="w-36">
                              <Input
                                type="number"
                                step="1"
                                value={item.term ?? 0}
                                onChange={(e) => {
                                  const updated = [...interestRates];
                                  updated[index] = {
                                    ...updated[index],
                                    term: Number(e.target.value),
                                  };
                                  setInterestRates(updated);
                                }}
                                className="w-28 h-10 border-gray-200 rounded-xl"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.rate}
                                onChange={(e) =>
                                  handleUpdateRate(index, e.target.value)
                                }
                                className="w-32 h-10 border-gray-200 rounded-xl"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateTypeSaving(true)}
                    className="h-12 px-8 font-medium text-white shadow-lg rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    }}
                    disabled={loading}
                  >
                    Create Regulations
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedTypeSavings.length === 0) {
                        setError(
                          "Please select at least one savings type to delete"
                        );
                        setTimeout(() => setError(null), 3000);
                        return;
                      }
                      setShowDeleteConfirm(true);
                    }}
                    className="h-12 px-8 font-medium text-white shadow-lg rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                    }}
                    disabled={loading || selectedTypeSavings.length === 0}
                  >
                    Delete Regulations ({selectedTypeSavings.length})
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 px-8 font-medium text-white shadow-lg rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Regulations"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-8 border-gray-200 rounded-xl"
                    disabled={loading}
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await resetTypeSavingDefaults();
                        const ratesResp = await getInterestRates();
                        if (ratesResp.success) {
                          setInterestRates(ratesResp.data);
                        }
                        setSelectedTypeSavings([]);
                        setSuccessMessage("Reset to default successfully");
                        setShowSuccess(true);
                      } catch (e) {
                        setError(e.message || "Failed to reset defaults");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Reset to Default
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Current Regulations Summary */}
        {!loading && (
          <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
            <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
              <CardTitle className="text-xl">
                Current Regulations Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6"></CardContent>
          </Card>
        )}

        {/* Current Regulations Summary */}
        {!loading && (
          <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
            <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
              <CardTitle className="text-xl">
                Current Regulations Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div
                  className="p-6 border-2 border-blue-100 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                  }}
                >
                  <h5 className="mb-4 text-sm font-semibold text-blue-900">
                    Deposit & Withdrawal Regulations
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        Minimum Deposit:
                      </span>
                      <span className="text-sm font-semibold text-blue-900">
                        ₫{Number(minDeposit).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        Minimum Holding Period:
                      </span>
                      <span className="text-sm font-semibold text-blue-900">
                        {minWithdrawalDays} days
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 border-2 border-green-100 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                  }}
                >
                  <h5 className="mb-4 text-sm font-semibold text-green-900">
                    Interest Rates
                  </h5>
                  <div className="space-y-3">
                    {interestRates.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-green-800">
                          {item.typeName}:
                        </span>
                        <span className="text-sm font-semibold text-green-900">
                          {item.rate}% per month
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Change History */}
        {!loading && (
          <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
            <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  }}
                >
                  <History size={20} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Change History</CardTitle>
                  <CardDescription>
                    Track all regulation changes by administrators
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-hidden border rounded-2xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">
                        Changed By
                      </TableHead>
                      <TableHead className="font-semibold">Field</TableHead>
                      <TableHead className="font-semibold">Old Value</TableHead>
                      <TableHead className="font-semibold">New Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeHistory.map((change, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-[#F8F9FC] transition-colors"
                      >
                        <TableCell className="font-medium">
                          {change.date}
                        </TableCell>
                        <TableCell>{change.user}</TableCell>
                        <TableCell>{change.field}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          {change.oldValue}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {change.newValue}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  }}
                >
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    Confirm Regulation Change
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Are you sure you want to update system regulations? This
                    will affect all future transactions.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 border-2 border-yellow-200 rounded-2xl bg-yellow-50">
                <p className="flex items-center gap-2 text-sm text-yellow-900">
                  <AlertTriangle size={16} />
                  Changes will take effect immediately and apply to all
                  accounts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={confirmUpdate}
                className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                Confirm Change
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-200 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                  }}
                >
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">
                {successMessage || "Regulations Updated!"}
              </DialogTitle>
              <DialogDescription className="text-base text-center">
                {successMessage
                  ? "Operation completed successfully."
                  : "System regulations have been successfully updated."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 space-y-2 border border-gray-200 rounded-2xl bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">
                  Updated regulations:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                  <li>
                    Minimum Deposit: ₫{Number(minDeposit).toLocaleString()}
                  </li>
                  <li>Minimum Withdrawal Period: {minWithdrawalDays} days</li>
                  {interestRates.map((item, index) => (
                    <li key={index}>
                      Interest Rate {item.typeName}: {item.rate}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 font-medium text-white shadow-lg rounded-xl"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                  }}
                >
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    Delete Savings Types
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Are you sure you want to delete the selected savings types?
                    This action cannot be undone.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 border-2 border-red-200 rounded-2xl bg-red-50">
                <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-red-900">
                  <AlertTriangle size={16} />
                  You are about to delete {selectedTypeSavings.length} savings
                  type(s):
                </p>
                <ul className="space-y-2 text-sm text-red-800">
                  {selectedTypeSavings.map((id) => {
                    const item = interestRates.find(
                      (rate) => rate.typeSavingId === id
                    );
                    return item ? (
                      <li key={id} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="font-medium">{item.typeName}</span>
                        <span className="text-xs text-red-600">
                          ({item.rate}% per month)
                        </span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              <div className="p-4 border-2 border-yellow-200 rounded-2xl bg-yellow-50">
                <p className="flex items-center gap-2 text-sm text-yellow-900">
                  <AlertTriangle size={16} />
                  Warning: Deleting savings types may affect existing accounts
                  using these types.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={async () => {
                  try {
                    setShowDeleteConfirm(false);
                    setLoading(true);
                    setError(null);

                    // Delete each selected type saving
                    const deletePromises = selectedTypeSavings.map((id) =>
                      deleteTypeSaving(id)
                    );
                    await Promise.all(deletePromises);

                    setSuccessMessage(
                      `Successfully deleted ${selectedTypeSavings.length} savings type(s)!`
                    );
                    setSelectedTypeSavings([]);
                    setShowSuccess(true);

                    // Refresh interest rates list
                    try {
                      const ratesResponse = await getInterestRates();
                      if (ratesResponse.success && ratesResponse.data) {
                        setInterestRates(ratesResponse.data);
                      }
                    } catch (err) {
                      console.error("Failed to refresh interest rates:", err);
                    }
                  } catch (err) {
                    setError(err.message || "Failed to delete savings types");
                    console.error("Error deleting type savings:", err);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                }}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-200 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Type Saving Dialog */}
        <Dialog
          open={showCreateTypeSaving}
          onOpenChange={setShowCreateTypeSaving}
        >
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                  }}
                >
                  <Settings size={24} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    Create New Savings Type
                  </DialogTitle>
                  <DialogDescription>
                    Add a new savings account type to the system
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="typename" className="text-gray-700">
                  Type Name
                </Label>
                <Input
                  id="typename"
                  value={typeSavingForm.typename}
                  onChange={(e) =>
                    setTypeSavingForm({
                      ...typeSavingForm,
                      typename: e.target.value,
                    })
                  }
                  placeholder="e.g., 3 Months, 6 Months"
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term" className="text-gray-700">
                  Term (Months)
                </Label>
                <Input
                  id="term"
                  type="number"
                  value={typeSavingForm.term}
                  onChange={(e) =>
                    setTypeSavingForm({
                      ...typeSavingForm,
                      term: e.target.value,
                    })
                  }
                  placeholder="0 for No Term, or number of months"
                  className="border-gray-200 h-11 rounded-xl"
                />
                <p className="text-xs text-gray-500">
                  Enter 0 for no term (flexible)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate" className="text-gray-700">
                  Interest Rate (% per month)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={typeSavingForm.interestRate}
                  onChange={(e) =>
                    setTypeSavingForm({
                      ...typeSavingForm,
                      interestRate: e.target.value,
                    })
                  }
                  placeholder="e.g., 0.5 for 0.5%"
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);

                    // Call API POST /api/typesaving
                    const response = await createTypeSaving({
                      typename: typeSavingForm.typename,
                      term: Number(typeSavingForm.term),
                      interestRate: Number(typeSavingForm.interestRate),
                    });

                    if (response.success) {
                      setSuccessMessage(
                        `Savings type "${response.data.typeName}" created successfully!`
                      );
                      setShowCreateTypeSaving(false);
                      setShowSuccess(true);

                      // Reset form
                      setTypeSavingForm({
                        typename: "",
                        term: "",
                        interestRate: "",
                      });

                      // Refresh interest rates list
                      try {
                        const ratesResponse = await getInterestRates();
                        if (ratesResponse.success && ratesResponse.data) {
                          setInterestRates(ratesResponse.data);
                        }
                      } catch (err) {
                        console.error("Failed to refresh interest rates:", err);
                      }
                    }
                  } catch (err) {
                    setError(err.message || "Failed to create savings type");
                    console.error("Error creating type saving:", err);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                }}
                disabled={loading}
              >
                Create Type
              </Button>
              <Button
                onClick={() => {
                  setShowCreateTypeSaving(false);
                  setTypeSavingForm({
                    typename: "",
                    term: "",
                    interestRate: "",
                  });
                }}
                variant="outline"
                className="flex-1 h-12 border-gray-200 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
