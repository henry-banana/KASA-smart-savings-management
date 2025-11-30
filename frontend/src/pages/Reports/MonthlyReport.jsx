import React, { useState } from 'react';
import { RoleGuard } from '../../components/RoleGuard';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { MonthPicker } from '../../components/ui/month-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { FileDown, Printer, Search, Loader2 } from 'lucide-react';
import { getMonthlyOpenCloseReport } from '../../services/reportService';
import { getAllTypeSavings } from '../../services/typeSavingService';

export default function MonthlyReport() {
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [savingsType, setSavingsType] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await getMonthlyOpenCloseReport(month, year, savingsType);
      
      if (response.success && response.data) {
        // Use canonical 'items' field from response
        setReportData(response.data.items || response.data.byDay);
      } else {
        setError(response.message || 'Failed to generate report');
        setReportData(null);
      }
    } catch (err) {
      console.error('Report generation error:', err);
      setError(err.message || 'An error occurred while generating the report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const totals = reportData
    ? reportData.reduce(
        (acc, item) => ({
          opened: acc.opened + (item.newSavingBooks || item.opened || 0),
          closed: acc.closed + (item.closedSavingBooks || item.closed || 0),
          difference: acc.difference + (item.difference || 0),
        }),
        { opened: 0, closed: 0, difference: 0 }
      )
    : null;

  const [savingsTypes, setSavingsTypes] = React.useState([
    { value: 'all', label: 'All Types' }
  ]);

  // Fetch savings types on mount
  React.useEffect(() => {
    const fetchSavingsTypes = async () => {
      try {
        const response = await getAllTypeSavings();
        if (response.success && response.data) {
          const types = [
            { value: 'all', label: 'All Types' },
            ...response.data.map(ts => ({
              value: `${ts.term}-months`,
              label: ts.typeName
            }))
          ];
          setSavingsTypes(types);
        }
      } catch (err) {
        console.error('Failed to fetch savings types:', err);
      }
    };
    fetchSavingsTypes();
  }, []);

  const handleExport = () => {
    window.print();
  };

  return (
    <RoleGuard allow={['accountant']}>
      <div className="space-y-6">
        {/* Report Header - Filter Controls */}
        <Card className="border border-gray-200 rounded-3xl overflow-hidden print:hidden">
          <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 pb-8">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              BM5.2 – Monthly Opening/Closing Report
            </CardTitle>
            <CardDescription>Generate monthly savings book opening and closing report</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Savings Type</Label>
                <Select value={savingsType} onValueChange={setSavingsType}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Select savings type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {savingsTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Month</Label>
                <MonthPicker
                  date={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  placeholder="Pick a month"
                />
              </div>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full h-12 rounded-xl px-6 text-white border border-gray-200 hover:border border-gray-200 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search size={18} className="mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Show results only after generate */}
        {reportData && !loading && (
          <>
            {/* Print Actions - Hidden on Print */}
            <div className="flex justify-end gap-3 print:hidden">
              <Button
                onClick={handleExport}
                variant="outline"
                className="rounded-xl border border-gray-100 hover:border border-gray-200"
              >
                <Printer size={18} className="mr-2" />
                Print Report
              </Button>
              <Button
                onClick={handleExport}
                className="rounded-xl border border-gray-100 hover:border border-gray-200 bg-linear-to-r from-green-600 to-green-500 text-white"
              >
                <FileDown size={18} className="mr-2" />
                Export PDF
              </Button>
            </div>

            {/* Main Report Container - Printable */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 print:shadow-none print:rounded-none print:p-12">
              {/* Report Header */}
              <div className="mb-8 space-y-4">
                <h1 className="text-2xl font-bold text-[#1A4D8F] text-center tracking-tight">
                  BM5.2 – MONTHLY OPENING/CLOSING SAVINGS BOOKS REPORT
                </h1>
                {/* Report Metadata */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Savings Type:</span>
                    <span className="font-semibold text-[#1A4D8F] border-b-2 border-dotted border-gray-300 px-2 min-w-[120px]">
                      {savingsTypes.find((t) => t.value === savingsType)?.label || 'All Types'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Month:</span>
                    <span className="font-semibold text-[#1A4D8F] border-b-2 border-dotted border-gray-300 px-2 min-w-[120px]">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Table */}
              <div className="overflow-hidden rounded-xl border-2 border-gray-200 border border-gray-200">
                <table className="w-full border-collapse">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-[#1A4D8F] text-white">
                      <th className="py-4 px-4 text-center font-semibold border-r border-[#2563a8]" style={{ width: '10%' }}>
                        No.
                      </th>
                      <th className="py-4 px-6 text-left font-semibold border-r border-[#2563a8]" style={{ width: '25%' }}>
                        Date
                      </th>
                      <th className="py-4 px-6 text-right font-semibold border-r border-[#2563a8]" style={{ width: '20%' }}>
                        Opened
                      </th>
                      <th className="py-4 px-6 text-right font-semibold border-r border-[#2563a8]" style={{ width: '20%' }}>
                        Closed
                      </th>
                      <th className="py-4 px-6 text-right font-semibold" style={{ width: '25%' }}>
                        Difference
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'} hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-3 px-4 text-center text-gray-700 border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="py-3 px-6 text-left text-gray-800 font-medium border-r border-gray-200">
                          {new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            row.day
                          ).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3 px-6 text-right text-green-600 font-semibold border-r border-gray-200">
                          {row.newSavingBooks ?? row.opened ?? 0}
                        </td>
                        <td className="py-3 px-6 text-right text-red-600 font-semibold border-r border-gray-200">
                          {row.closedSavingBooks ?? row.closed ?? 0}
                        </td>
                        <td className={`py-3 px-6 text-right font-semibold ${row.difference >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {row.difference >= 0 ? '+' : ''}
                          {row.difference}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-linear-to-r from-gray-100 to-gray-50 border-t-2 border-[#1A4D8F]">
                      <td colSpan={2} className="py-4 px-6 text-left font-bold text-[#1A4D8F] uppercase tracking-wide">
                        Total
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-green-600 text-lg border-r border-gray-300">
                        {totals?.opened}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-red-600 text-lg border-r border-gray-300">
                        {totals?.closed}
                      </td>
                      <td className={`py-4 px-6 text-right font-bold text-lg ${(totals?.difference || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {(totals?.difference || 0) >= 0 ? '+' : ''}
                        {totals?.difference}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Report Footer - Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-700 mb-1">Total Opened</p>
                  <p className="text-3xl font-bold text-green-600">{totals?.opened}</p>
                  <p className="text-xs text-green-600 mt-1">accounts this month</p>
                </div>

                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-700 mb-1">Total Closed</p>
                  <p className="text-3xl font-bold text-red-600">{totals?.closed}</p>
                  <p className="text-xs text-red-600 mt-1">accounts this month</p>
                </div>

                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-700 mb-1">Net Difference</p>
                  <p className="text-3xl font-bold text-blue-600">{(totals?.difference || 0) >= 0 ? '+' : ''}{totals?.difference}</p>
                  <p className="text-xs text-blue-600 mt-1">net growth this month</p>
                </div>
              </div>

              {/* Report Signature Section */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 print:block">
                <div className="grid grid-cols-2 gap-12">
                  <div className="text-center space-y-16">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Prepared By</p>
                      <p className="font-semibold text-[#1A4D8F]">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 uppercase">{user?.role || user?.roleName}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-500">Signature & Date</p>
                    </div>
                  </div>

                  <div className="text-center space-y-16">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Approved By</p>
                      <p className="font-semibold text-[#1A4D8F]">____________________</p>
                      <p className="text-xs text-gray-500 uppercase">Manager</p>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-500">Signature & Date</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Generation Info */}
              <div className="mt-8 text-center text-xs text-gray-400 print:block">
                <p>
                  Generated on {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-1">KASA Savings Management System © 2025</p>
              </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page { size: A4; margin: 15mm; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
      `}</style>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
