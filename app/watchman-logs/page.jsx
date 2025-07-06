"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar, Clock, User, Car, Search, Filter } from "lucide-react";
import { format } from "date-fns";

export default function WatchmanLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [personTypeFilter, setPersonTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, personTypeFilter, dateFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/watchman-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.vehicleNumber && log.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Person type filter
    if (personTypeFilter !== "ALL") {
      filtered = filtered.filter(log => log.personType === personTypeFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.inTime).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        return logDate === filterDate;
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPersonTypeFilter("ALL");
    setDateFilter("");
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (log) => {
    if (log.outTime) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Exited</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Inside</span>;
    }
  };

  const getPersonTypeColor = (type) => {
    switch (type) {
      case "RESIDENT":
        return "bg-blue-100 text-blue-800";
      case "VISITOR":
        return "bg-purple-100 text-purple-800";
      case "VENDOR":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Logs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchLogs}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Watchman Activity Logs</h1>
          <p className="text-gray-600">Track all entries and exits in the society</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="personType">Person Type</Label>
                <Select value={personTypeFilter} onValueChange={setPersonTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="RESIDENT">Residents</SelectItem>
                    <SelectItem value="VISITOR">Visitors</SelectItem>
                    <SelectItem value="VENDOR">Vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Currently Inside</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredLogs.filter(log => !log.outTime).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visitors Today</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredLogs.filter(log => 
                      log.personType === "VISITOR" && 
                      new Date(log.inTime).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Vehicles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredLogs.filter(log => log.vehicleNumber).length}
                  </p>
                </div>
                <Car className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {currentLogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No logs found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-900">Person</th>
                        <th className="text-left p-3 font-medium text-gray-900">Type</th>
                        <th className="text-left p-3 font-medium text-gray-900">Vehicle</th>
                        <th className="text-left p-3 font-medium text-gray-900">Entry Time</th>
                        <th className="text-left p-3 font-medium text-gray-900">Exit Time</th>
                        <th className="text-left p-3 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{log.personName}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getPersonTypeColor(log.personType)}`}>
                              {log.personType}
                            </span>
                          </td>
                          <td className="p-3">
                            {log.vehicleNumber ? (
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {log.vehicleNumber}
                              </span>
                            ) : (
                              <span className="text-gray-400">No vehicle</span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatTime(log.inTime)}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {log.outTime ? formatTime(log.outTime) : "—"}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(log)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} entries
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-3 py-2 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
