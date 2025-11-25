import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
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
import { Search, FileDown, Eye, Sparkles, Filter, PiggyBank } from 'lucide-react';
import { StarDecor, CuteEmptyState } from '../../components/CuteComponents';
import { TableSkeleton } from '../../components/ui/loading-skeleton';
import { searchSavingBooks } from '../../services/savingBookService';
import { RoleGuard } from '../../components/RoleGuard';

export default function SearchAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts when filters change
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await searchSavingBooks(searchTerm, typeFilter, statusFilter);
        setAccounts(response.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchAccounts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter, statusFilter]);

  const filteredAccounts = accounts;

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setShowDetails(true);
  };

  const handleExport = (format) => {
    // Mock export functionality
    alert(`Exporting ${filteredAccounts.length} accounts to ${format.toUpperCase()}...`);
  };

  const getTypeLabel = (type) => {
    const labels = {
      'no-term': 'No Term',
      '3-months': '3 Months',
      '6-months': '6 Months'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'no-term': 'bg-blue-100 text-blue-700 border-blue-200',
      '3-months': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      '6-months': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <RoleGuard allow={['teller', 'accountant']}>
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl rounded-2xl lg:rounded-3xl">
        {/* Cute Header */}
        <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32" size={20} />
          
          <div className="relative z-10 flex items-start gap-3 sm:gap-4">
            <div 
              className="flex items-center justify-center shrink-0 w-12 h-12 shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <Search size={24} className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                <span className="truncate">Search Accounts</span>
                <span className="shrink-0-xl sm:text-2xl">🔍</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Search and manage savings accounts (Form BM4)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4 sm:p-6 lg:p-8 sm:space-y-6">
          {/* Search & Filter Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Filter size={18} className="sm:w-5 sm:h-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Search Filters</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-sm text-gray-700 sm:text-base">Search</Label>
                <div className="relative">
                  <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={16} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Account code or customer name..."
                    className="pl-10 h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6] transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700 sm:text-base">Account Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-sm border-gray-200 h-11 sm:h-12 rounded-xl sm:text-base">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="no-term">No Term</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-[#8B5CF6]">{filteredAccounts.length}</span> savings accounts
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-200 rounded-xl hover:bg-gray-50"
                onClick={() => handleExport('excel')}
              >
                <FileDown size={16} className="mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-hidden border border-gray-200 rounded-2xl">
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
                    <TableHead className="font-semibold">Account Code</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Open Date</TableHead>
                    <TableHead className="font-semibold text-right">Balance</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-[#F8F9FC] transition-colors">
                      <TableCell className="font-medium text-[#8B5CF6]">{account.id}</TableCell>
                      <TableCell>{account.customer}</TableCell>
                      <TableCell>
                        <Badge className={`${getTypeBadgeColor(account.type)} border`}>
                          {getTypeLabel(account.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.openDate}</TableCell>
                      <TableCell className="font-semibold text-right">
                        ₫{account.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {account.status === 'active' ? (
                          <Badge className="text-green-700 bg-green-100 border border-green-200">
                            Active
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
                          className="rounded-xl hover:bg-[#F3E8FF]"
                        >
                          <Eye size={16} className="mr-1" />
                          Chi Tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="flex items-center justify-center shadow-lg w-14 h-14 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <PiggyBank size={28} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Savings Account Details</DialogTitle>
                <DialogDescription>Detailed account information</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-3">
              <div 
                className="p-6 space-y-3 border-2 rounded-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, #F3E8FF 0%, #E8F6FF 100%)',
                  borderColor: '#8B5CF640'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Code:</span>
                  <span className="font-semibold text-lg text-[#8B5CF6]">{selectedAccount.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-medium">{selectedAccount.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Type:</span>
                  <Badge className={`${getTypeBadgeColor(selectedAccount.type)} border`}>
                    {getTypeLabel(selectedAccount.type)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Opening Date:</span>
                  <span className="font-medium">{selectedAccount.openDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  {selectedAccount.status === 'active' ? (
                    <Badge className="text-green-700 bg-green-100 border border-green-200">
                      ✓ Active
                    </Badge>
                  ) : (
                    <Badge className="text-gray-700 bg-gray-100 border border-gray-200">
                      Closed
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700">Balance:</span>
                  <span className="text-xl font-bold text-green-600">
                    ₫{selectedAccount.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => setShowDetails(false)}
            className="w-full h-12 font-medium text-white rounded-full shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </RoleGuard>
  );
}
