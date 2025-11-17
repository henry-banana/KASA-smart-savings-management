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
import { Search, FileDown, Eye, Sparkles, Filter, PiggyBank } from 'lucide-react';
import { StarDecor, CuteEmptyState } from '../../components/CuteComponents';

// Mock data
const mockAccountsData = [
  { id: 'SA12345', customer: 'Nguyễn Văn A', type: 'no-term', openDate: '2025-01-15', balance: 5000000, status: 'active' },
  { id: 'SA12346', customer: 'Trần Thị B', type: '3-months', openDate: '2024-11-15', balance: 10000000, status: 'active' },
  { id: 'SA12347', customer: 'Lê Văn C', type: 'no-term', openDate: '2025-10-01', balance: 8000000, status: 'active' },
  { id: 'SA12348', customer: 'Phạm Thị D', type: '6-months', openDate: '2024-08-20', balance: 15000000, status: 'active' },
  { id: 'SA12349', customer: 'Hoàng Văn E', type: 'no-term', openDate: '2025-02-10', balance: 3500000, status: 'active' },
  { id: 'SA12350', customer: 'Nguyễn Thị F', type: '3-months', openDate: '2024-12-01', balance: 7500000, status: 'active' },
  { id: 'SA12351', customer: 'Vũ Văn G', type: '6-months', openDate: '2024-09-15', balance: 20000000, status: 'closed' },
  { id: 'SA12352', customer: 'Đỗ Thị H', type: 'no-term', openDate: '2025-03-20', balance: 4200000, status: 'active' },
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

  const getTypeLabel = (type) => {
    const labels = {
      'no-term': 'Không Kỳ Hạn',
      '3-months': '3 Tháng',
      '6-months': '6 Tháng'
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
    <div className="space-y-6">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        {/* Cute Header */}
        <CardHeader className="bg-gradient-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-purple-400 opacity-50" size={24} />
          
          <div className="flex items-start gap-4 relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <Search size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                Tra Cứu Sổ Tiết Kiệm
                <span className="text-2xl">🔍</span>
              </CardTitle>
              <CardDescription className="text-base">
                Tìm kiếm và xem chi tiết thông tin sổ tiết kiệm
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Search & Filter Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-[#8B5CF6]" />
              <h3 className="font-semibold text-gray-900">Bộ Lọc Tìm Kiếm</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2">
                <Label className="text-gray-700">Tìm Kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mã sổ hoặc tên khách hàng..."
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Loại Sổ</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="no-term">Không Kỳ Hạn</SelectItem>
                    <SelectItem value="3-months">3 Tháng</SelectItem>
                    <SelectItem value="6-months">6 Tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Trạng Thái</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Đang Hoạt Động</SelectItem>
                    <SelectItem value="closed">Đã Đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-[#8B5CF6]">{filteredAccounts.length}</span> sổ tiết kiệm
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-xl border-gray-200 hover:bg-gray-50"
                onClick={() => handleExport('excel')}
              >
                <FileDown size={16} className="mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {filteredAccounts.length === 0 ? (
              <CuteEmptyState
                icon="piggy"
                title="Không tìm thấy kết quả"
                description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#F8F9FC] to-white hover:bg-gradient-to-r">
                    <TableHead className="font-semibold">Mã Sổ</TableHead>
                    <TableHead className="font-semibold">Khách Hàng</TableHead>
                    <TableHead className="font-semibold">Loại Sổ</TableHead>
                    <TableHead className="font-semibold">Ngày Mở</TableHead>
                    <TableHead className="font-semibold text-right">Số Dư</TableHead>
                    <TableHead className="font-semibold">Trạng Thái</TableHead>
                    <TableHead className="font-semibold text-center">Hành Động</TableHead>
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
                      <TableCell className="text-right font-semibold">
                        ₫{account.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {account.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 border">
                            Hoạt Động
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">
                            Đã Đóng
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
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <PiggyBank size={28} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Chi Tiết Sổ Tiết Kiệm</DialogTitle>
                <DialogDescription>Thông tin chi tiết của sổ</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-3">
              <div 
                className="p-6 rounded-2xl space-y-3 border-2"
                style={{ 
                  background: 'linear-gradient(135deg, #F3E8FF 0%, #E8F6FF 100%)',
                  borderColor: '#8B5CF640'
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mã Sổ:</span>
                  <span className="font-semibold text-lg text-[#8B5CF6]">{selectedAccount.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Khách Hàng:</span>
                  <span className="font-medium">{selectedAccount.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loại Sổ:</span>
                  <Badge className={`${getTypeBadgeColor(selectedAccount.type)} border`}>
                    {getTypeLabel(selectedAccount.type)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ngày Mở:</span>
                  <span className="font-medium">{selectedAccount.openDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trạng Thái:</span>
                  {selectedAccount.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 border">
                      ✓ Hoạt Động
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">
                      Đã Đóng
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700">Số Dư:</span>
                  <span className="text-xl font-bold text-green-600">
                    ₫{selectedAccount.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => setShowDetails(false)}
            className="w-full h-12 text-white rounded-full font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
