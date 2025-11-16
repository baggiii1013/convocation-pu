'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: string;
  attendeeId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  verificationMethod: 'QR_SCAN' | 'MANUAL' | 'BIOMETRIC' | 'NFC' | 'FACIAL';
  checkInTime: string;
  checkOutTime?: string;
  location?: string;
  confirmedBy?: string;
  confirmedByName?: string;
  notes?: string;
  markedAt: string;
  seatInfo?: {
    enclosure?: string;
    row?: string;
    seat?: number;
  };
  attendee: {
    id: string;
    enrollmentId: string;
    name: string;
    email?: string;
    phone?: string;
    school?: string;
    course?: string;
    degree?: string;
  };
}

interface Statistics {
  total: number;
  byStatus: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  byVerificationMethod: Record<string, number>;
}

interface PaginatedResponse {
  data: AttendanceRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function AttendanceStatsClient() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 20;

  // Detailed view
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const fetchStatistics = async () => {
    try {
      const params = new URLSearchParams();
      // Only add date params if they have values and convert to ISO datetime format
      if (dateFrom) {
        const fromDateTime = new Date(dateFrom);
        fromDateTime.setHours(0, 0, 0, 0);
        params.append('fromDate', fromDateTime.toISOString());
      }
      if (dateTo) {
        const toDateTime = new Date(dateTo);
        toDateTime.setHours(23, 59, 59, 999);
        params.append('toDate', toDateTime.toISOString());
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendance/statistics${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fetching statistics from:', url);

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Statistics API error:', errorData);
        throw new Error(errorData.message || `Failed to fetch statistics (${response.status})`);
      }

      const result = await response.json();
      console.log('Statistics API response:', result);
      // API returns { success: true, data: stats }
      setStatistics(result.data || result);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Failed to load statistics');
    }
  };

  const fetchAttendanceRecords = async (page: number = 1) => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'markedAt',
        sortOrder: 'desc'
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (verificationFilter && verificationFilter !== 'all') {
        params.append('verificationMethod', verificationFilter);
      }
      // Only add date params if they have values and convert to ISO datetime format
      if (dateFrom) {
        const fromDateTime = new Date(dateFrom);
        fromDateTime.setHours(0, 0, 0, 0);
        params.append('fromDate', fromDateTime.toISOString());
      }
      if (dateTo) {
        const toDateTime = new Date(dateTo);
        toDateTime.setHours(23, 59, 59, 999);
        params.append('toDate', toDateTime.toISOString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendance?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch attendance records (${response.status})`);
      }

      const result = await response.json();
      console.log('Attendance records API response:', result);
      // API returns { success: true, data: [...], pagination: {...} }
      if (result.success && result.data) {
        setAttendanceRecords(result.data);
        setCurrentPage(result.pagination.page);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.total);
      } else {
        // Fallback for direct response format
        setAttendanceRecords(result.data || []);
        setCurrentPage(result.pagination?.page || 1);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalRecords(result.pagination?.total || 0);
      }
    } catch (err: any) {
      console.error('Error fetching attendance records:', err);
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setRefreshing(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchStatistics(), fetchAttendanceRecords(1)]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAttendanceRecords(1);
      fetchStatistics();
    }
  }, [statusFilter, verificationFilter, dateFrom, dateTo]);

  const handleRefresh = () => {
    loadData();
  };

  const handlePageChange = (page: number) => {
    fetchAttendanceRecords(page);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ABSENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'EXCUSED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getVerificationBadgeClass = (method: string) => {
    switch (method) {
      case 'QR_SCAN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'MANUAL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'BIOMETRIC':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'NFC':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'FACIAL':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.attendee.name.toLowerCase().includes(query) ||
      record.attendee.enrollmentId.toLowerCase().includes(query) ||
      record.attendee.email?.toLowerCase().includes(query) ||
      record.attendee.phone?.includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading attendance statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📊 Attendance Statistics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive attendance tracking and analytics
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* No Data Message */}
        {!loading && !error && statistics && statistics.total === 0 && (
          <div className="mb-6 p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Attendance Records Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Attendance data will appear here once students start checking in.
            </p>
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && statistics.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Attendance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Records
                </h3>
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statistics.total}
              </p>
            </div>

            {/* Present */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-700 dark:text-green-300">
                  Present
                </h3>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {statistics.byStatus.present}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {statistics.total > 0
                  ? ((statistics.byStatus.present / statistics.total) * 100).toFixed(1)
                  : 0}
                % attendance rate
              </p>
            </div>

            {/* Absent */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-red-700 dark:text-red-300">
                  Absent
                </h3>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                {statistics.byStatus.absent}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {statistics.total > 0
                  ? ((statistics.byStatus.absent / statistics.total) * 100).toFixed(1)
                  : 0}
                % absence rate
              </p>
            </div>

            {/* Late */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Late / Excused
                </h3>
                <span className="text-2xl">⏰</span>
              </div>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                {statistics.byStatus.late + statistics.byStatus.excused}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                {statistics.byStatus.late} late, {statistics.byStatus.excused} excused
              </p>
            </div>
          </div>
        )}

        {/* Verification Methods Breakdown */}
        {statistics && Object.keys(statistics.byVerificationMethod).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Verification Methods
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(statistics.byVerificationMethod).map(([method, count]) => (
                <div key={method} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {method.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filters & Search
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, ID, Email, Phone..."
                title="Search attendance records"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                title="Filter by attendance status"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </div>

            {/* Verification Method Filter */}
            <div>
              <label htmlFor="verification-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Method
              </label>
              <select
                id="verification-filter"
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                title="Filter by verification method"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="QR_SCAN">QR Scan</option>
                <option value="MANUAL">Manual</option>
                <option value="BIOMETRIC">Biometric</option>
                <option value="NFC">NFC</option>
                <option value="FACIAL">Facial</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date From
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="Filter from this date"
                placeholder="Start date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date To
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="Filter to this date"
                placeholder="End date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== 'all' || verificationFilter !== 'all' || dateFrom || dateTo) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setVerificationFilter('all');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Attendance Records
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredRecords.length} of {totalRecords} records
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attendee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Seat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Confirmed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium">No attendance records found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.attendee.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {record.attendee.enrollmentId}
                          </div>
                          {record.attendee.email && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {record.attendee.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationBadgeClass(
                            record.verificationMethod
                          )}`}
                        >
                          {record.verificationMethod.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {format(new Date(record.checkInTime), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.seatInfo ? (
                          <div className="text-xs">
                            <div className="font-medium">
                              {record.seatInfo.enclosure}-{record.seatInfo.row}-{record.seatInfo.seat}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.confirmedByName ? (
                          <div className="text-sm">
                            <div className="text-gray-900 dark:text-white">
                              {record.confirmedByName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(record.markedAt), 'HH:mm')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Attendance Details
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Close modal"
                aria-label="Close details modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Attendee Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Attendee Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedRecord.attendee.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Enrollment ID:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedRecord.attendee.enrollmentId}
                    </span>
                  </div>
                  {selectedRecord.attendee.email && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.attendee.email}
                      </span>
                    </div>
                  )}
                  {selectedRecord.attendee.phone && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.attendee.phone}
                      </span>
                    </div>
                  )}
                  {selectedRecord.attendee.course && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Course:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.attendee.course}
                      </span>
                    </div>
                  )}
                  {selectedRecord.attendee.school && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">School:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.attendee.school}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Attendance Details
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                        selectedRecord.status
                      )}`}
                    >
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Verification Method:</span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getVerificationBadgeClass(
                        selectedRecord.verificationMethod
                      )}`}
                    >
                      {selectedRecord.verificationMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Check-in Time:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedRecord.checkInTime), 'PPpp')}
                    </span>
                  </div>
                  {selectedRecord.checkOutTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check-out Time:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(selectedRecord.checkOutTime), 'PPpp')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marked At:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedRecord.markedAt), 'PPpp')}
                    </span>
                  </div>
                  {selectedRecord.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seat Information */}
              {selectedRecord.seatInfo && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                    Seat Information
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedRecord.seatInfo.enclosure}-{selectedRecord.seatInfo.row}-
                        {selectedRecord.seatInfo.seat}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enclosure {selectedRecord.seatInfo.enclosure}, Row{' '}
                        {selectedRecord.seatInfo.row}, Seat {selectedRecord.seatInfo.seat}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Details */}
              {selectedRecord.confirmedBy && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                    Confirmation Details
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed By:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.confirmedByName || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confirmer ID:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {selectedRecord.confirmedBy}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                    Notes
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedRecord.notes}</p>
                  </div>
                </div>
              )}

              {/* Record ID */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Record ID:</span>
                  <span className="text-gray-500 dark:text-gray-400 font-mono">
                    {selectedRecord.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
