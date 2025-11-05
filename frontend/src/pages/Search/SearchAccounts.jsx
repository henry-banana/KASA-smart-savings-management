import React, { useState } from 'react';
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
import { Search, FileDown, Eye } from 'lucide-react';

// Mock data
const mockAccountsData = [
  { id: 'SA12345', customer: 'Nguyen Van A', type: 'No Term', openDate: '2025-01-15', balance: 5000000, status: 'Active' },
  { id: 'SA12346', customer: 'Tran Thi B', type: '3 Months', openDate: '2025-02-01', balance: 10000000, status: 'Active' },
  { id: 'SA12347', customer: 'Le Van C', type: 'No Term', openDate: '2025-03-10', balance: 7500000, status: 'Active' },
  { id: 'SA12348', customer: 'Pham Thi D', type: '6 Months', openDate: '2024-12-20', balance: 15000000, status: 'Active' },
  { id: 'SA12349', customer: 'Hoang Van E', type: 'No Term', openDate: '2025-01-25', balance: 3000000, status: 'Closed' },
  { id: 'SA12350', customer: 'Nguyen Thi F', type: '3 Months', openDate: '2025-02-15', balance: 8000000, status: 'Active' },
  { id: 'SA12351', customer: 'Vo Van G', type: '6 Months', openDate: '2024-11-10', balance: 20000000, status: 'Active' },
  { id: 'SA12352', customer: 'Tran Van H', type: 'No Term', openDate: '2025-03-01', balance: 4500000, status: 'Active' }
];

export default function SearchAccounts({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredAccounts = mockAccountsData.filter(account => {
    const matchesSearch = 
      account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setShowDetails(true);
  };

  const handleExport = (format) => {
    // Mock export functionality
    alert(`Exporting ${filteredAccounts.length} accounts to ${format.toUpperCase()}...`);
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'no-term':
        return { borderColor: '#1A4D8F', color: '#00AEEF' };
      case '3-months':
        return { borderColor: '#1A4D8F', color: '#1A4D8F' };
      case '6-months':
        return { borderColor: '#1A4D8F', color: '#8B5CF6' };
      default:
        return { borderColor: '#1A4D8F', color: '#6B7280' };
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'no-term':
        return 'No Term';
      case '3-months':
        return '3 Months';
      case '6-months':
        return '6 Months';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Accounts (BM4)</CardTitle>
          <CardDescription>Search and filter savings accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Account ID or Customer Name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeFilter">Savings Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="no-term">No Term</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleExport('pdf')}
                variant="outline"
              >
                <FileDown size={16} className="mr-2" />
                Export PDF
              </Button>
              <Button 
                onClick={() => handleExport('excel')}
                variant="outline"
              >
                <FileDown size={16} className="mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results ({filteredAccounts.length} accounts found)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Open Date</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      No accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.customer}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={getTypeBadgeColor(account.type)}
                        >
                          {getTypeLabel(account.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.openDate}</TableCell>
                      <TableCell>₫{account.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(account)}
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>
              Complete information for account {selectedAccount?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Account ID</h4>
                  <p className="text-sm">{selectedAccount.id}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Status</h4>
                  <Badge 
                    className={selectedAccount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {selectedAccount.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Customer Name</h4>
                  <p className="text-sm">{selectedAccount.customer}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Account Type</h4>
                  <Badge 
                    variant="outline"
                    style={getTypeBadgeColor(selectedAccount.type)}
                  >
                    {getTypeLabel(selectedAccount.type)}
                  </Badge>
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Open Date</h4>
                  <p className="text-sm">{selectedAccount.openDate}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-500">Current Balance</h4>
                  <p className="text-sm">₫{selectedAccount.balance.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 text-sm">Recent Transactions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">2025-10-20: Deposit</span>
                    <span className="text-green-600">+₫1,000,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">2025-10-10: Deposit</span>
                    <span className="text-green-600">+₫500,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{selectedAccount.openDate}: Account Opened</span>
                    <span className="text-blue-600">₫{selectedAccount.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowDetails(false)}
                className="w-full text-white"
                style={{ backgroundColor: '#1A4D8F' }}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
