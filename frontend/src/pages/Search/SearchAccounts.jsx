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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
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
  Search,
  Eye,
  Sparkles,
  Filter,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { StarDecor, CuteEmptyState } from "../../components/CuteComponents";
import { TableSkeleton } from "../../components/ui/loading-skeleton";
import {
  searchSavingBooks,
  getSavingBookById,
} from "../../services/savingBookService";
import { getAllTypeSavings } from "../../services/typeSavingService";
import { RoleGuard } from "../../components/RoleGuard";
import { getTypeBadgeColor, getTypeLabel } from "../../utils/typeColorUtils";
import { formatVnNumber, formatBalance } from "../../utils/numberFormatter";
import { sortSavingsTypes } from "../../utils/savingsTypeSort";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";

export default function SearchAccounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountTypeOptions, setAccountTypeOptions] = useState([
    { value: "all", label: "All" },
  ]);
  const [serverError, setServerError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Fixed at 10
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Saving Book type options on mount
  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = await getAllTypeSavings();
        if (response.success && response.data) {
          const options = [
            { value: "all", label: "All" },
            ...response.data.map((ts) => {
              // Use typeSavingId as the filter value to match typeId parameter
              return {
                value: ts.typeSavingId,
                label: ts.typeName,
              };
            }),
          ];
          setAccountTypeOptions(sortSavingsTypes(options));
        }
      } catch (err) {
        console.error("Failed to fetch Saving Book types:", err);
      }
    };
    fetchAccountTypes();
  }, []);

  // Fetch accounts when filters or page changes
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setServerError(null);
      try {
        const response = await searchSavingBooks(
          searchTerm,
          typeFilter,
          statusFilter,
          page,
          pageSize
        );
        setAccounts(response.data || []);
        setTotal(response.total || 0);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error("Search error:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerError(err);
        }
        setAccounts([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchAccounts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter, statusFilter, page, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  // Show full-page error state if server unavailable
  if (serverError) {
    return (
      <RoleGuard allowedRoles={["manager", "employee"]}>
        <ServiceUnavailableState
          variant="page"
          onRetry={() => {
            setServerError(null);
            setAccounts([]);
            setTotal(0);
            setTotalPages(1);
          }}
        />
      </RoleGuard>
    );
  }

  const filteredAccounts = accounts;

  const handleViewDetails = async (account) => {
    setDetailsLoading(true);
    try {
      // Get full details from API
      const response = await getSavingBookById(
        account.accountCode || account.bookId
      );
      setSelectedAccount(response.data);
      setShowDetails(true);
    } catch (err) {
      console.error("Failed to fetch account details:", err);
      // Fallback to showing search result data if API fails
      setSelectedAccount(account);
      setShowDetails(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleFirstPage = () => {
    if (page > 1) {
      setPage(1);
    }
  };

  const handleLastPage = () => {
    if (page < totalPages) {
      setPage(totalPages);
    }
  };

  // Use shared utilities for consistent color mapping across app

  return (
    <RoleGuard allow={["teller", "accountant"]}>
      <div className="space-y-4 sm:space-y-6">
        <Card className="overflow-hidden border border-gray-200 rounded-sm lg:rounded-sm">
          {/* Cute Header */}
          <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32"
              size={20}
            />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xs sm:rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                <Search
                  size={24}
                  className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                  <span className="truncate">Search Saving Books</span>
                  <span className="shrink-0-xl sm:text-2xl">🔍</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Search and manage savings accounts
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4 sm:p-6 lg:p-8 sm:space-y-6">
            {/* Search & Filter Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Filter size={18} className="sm:w-5 sm:h-5 text-[#8B5CF6]" />
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Search Filters
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Search
                  </Label>
                  <div className="relative">
                    <Search
                      className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                      size={16}
                    />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Saving Book ID, Citizen number or Name..."
                      className="pl-10 h-11 sm:h-12 rounded-sm border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6] transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Saving Book type
                  </Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 sm:text-base">
                    Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="close">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-600">
                  Found{" "}
                  <span className="font-semibold text-[#8B5CF6]">
                    {formatVnNumber(total)}
                  </span>{" "}
                  savings accounts • Page {page} of {totalPages}
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-hidden border border-gray-200">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} columns={7} />
                </div>
              ) : filteredAccounts.length === 0 ? (
                <CuteEmptyState
                  icon="piggy"
                  title="No results found"
                  description="Try adjusting your filters or search keywords"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                      <TableHead className="font-semibold">
                        Saving Book ID
                      </TableHead>
                      <TableHead className="font-semibold">
                        Citizen ID
                      </TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Open Date</TableHead>
                      <TableHead className="font-semibold text-right">
                        Balance
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow
                        key={account.bookId}
                        className="hover:bg-[#F8F9FC] transition-colors"
                      >
                        <TableCell className="font-medium text-[#8B5CF6]">
                          {account.accountCode || account.bookId}
                        </TableCell>
                        <TableCell>{account.citizenId || "-"}</TableCell>
                        <TableCell>{account.customerName}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getTypeBadgeColor(
                              account.accountTypeName
                            )} border`}
                          >
                            {getTypeLabel(account.accountTypeName)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDateToDDMMYYYY(account.openDate)}
                        </TableCell>
                        <TableCell className="font-semibold text-right">
                          {formatBalance(account.balance ?? 0)}₫
                        </TableCell>
                        <TableCell>
                          {account.status?.toLowerCase() === "open" ? (
                            <Badge className="text-green-700 bg-green-100 border border-green-200">
                              Open
                            </Badge>
                          ) : (
                            <Badge className="text-gray-700 bg-gray-100 border border-gray-200">
                              Closed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(account)}
                            className="rounded-xs border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                          >
                            <Eye size={16} className="mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && filteredAccounts.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, total)} of {formatVnNumber(total)}{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirstPage}
                    disabled={page === 1 || loading}
                    aria-label="First page"
                    className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page === 1 || loading}
                    aria-label="Previous page"
                    className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Prev
                  </Button>
                  <span className="text-sm font-medium text-gray-700 px-3">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page === totalPages || loading}
                    aria-label="Next page"
                    className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLastPage}
                    disabled={page === totalPages || loading}
                    aria-label="Last page"
                    className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md rounded-sm">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center border border-gray-200 w-14 h-14 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  }}
                >
                  <PiggyBank size={28} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    Savings Account Details
                  </DialogTitle>
                  <DialogDescription>
                    Detailed account information
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {detailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin">Loading details...</div>
              </div>
            ) : selectedAccount ? (
              <div className="space-y-4">
                <div
                  className="p-6 space-y-3 border-2 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #F3E8FF 0%, #E8F6FF 100%)",
                    borderColor: "#8B5CF640",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Saving Book ID:
                    </span>
                    <span className="font-semibold text-lg text-[#8B5CF6]">
                      {selectedAccount.accountCode || selectedAccount.bookId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Citizen ID:</span>
                    <span className="font-medium">
                      {selectedAccount.citizenId || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="font-medium">
                      {selectedAccount.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Saving Book type:
                    </span>
                    <Badge
                      className={`${getTypeBadgeColor(
                        selectedAccount.typeSaving?.typeName ||
                          selectedAccount.accountTypeName
                      )} border`}
                    >
                      {getTypeLabel(
                        selectedAccount.typeSaving?.typeName ||
                          selectedAccount.accountTypeName
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Opening Date:</span>
                    <span className="font-medium">
                      {formatDateToDDMMYYYY(selectedAccount.openDate)}
                    </span>
                  </div>
                  {selectedAccount.typeSaving?.term > 0 &&
                    selectedAccount.maturityDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Maturity Date:
                        </span>
                        <span className="font-medium">
                          {formatDateToDDMMYYYY(selectedAccount.maturityDate)}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {selectedAccount.status?.toLowerCase() === "open" ? (
                      <Badge className="text-green-700 bg-green-100 border border-green-200">
                        ✓ Open
                      </Badge>
                    ) : (
                      <Badge className="text-gray-700 bg-gray-100 border border-gray-200">
                        Closed
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Initial Balance:
                    </span>
                    <span className="font-medium">
                      {formatBalance(selectedAccount.initialBalance || 0)}₫
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Interest Amount:
                    </span>
                    <span className="font-medium text-green-600">
                      +{formatBalance(selectedAccount.interestAmount || 0)}₫
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700">
                      Current Balance:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatBalance(selectedAccount.balance ?? 0)}₫
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <Button
              onClick={() => setShowDetails(false)}
              className="w-full h-12 font-medium text-white rounded-sm border border-gray-200"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
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
