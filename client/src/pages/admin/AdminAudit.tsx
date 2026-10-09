/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import {
  fetchAuditLogs,
  type AuditLogItem,
  type AuditLogFilters,
} from "@/services/adminApi";
import { getNavLabelByPath } from "@/constants/navigation";
import { toast } from "@/components/ui/sonner";

function getDisplayResource(log: AuditLogItem): { title: string; subtitle?: string } {
  // If details has explicit pageTitle, prioritize that
  const detailsTitle = typeof log.details?.pageTitle === "string" ? log.details.pageTitle : null;

  // Check if resource is a route or page/dashboard/report
  if (
    log.resourceType === "dashboard" ||
    log.resourceType === "report" ||
    log.action.startsWith("page.") ||
    log.action.startsWith("report.")
  ) {
    const rawPath = log.resourceId || (typeof log.details?.path === "string" ? log.details.path : null);
    const resolvedTitle = detailsTitle || (rawPath ? getNavLabelByPath(rawPath) : "Dashboard");
    return {
      title: resolvedTitle,
      subtitle: rawPath && rawPath !== resolvedTitle ? rawPath : undefined,
    };
  }

  // Handle user management
  if (log.resourceType === "user") {
    return {
      title: "User Management",
      subtitle: log.resourceId ? `User ID: ${log.resourceId.substring(0, 8)}...` : undefined,
    };
  }

  // Handle role / permission management
  if (log.resourceType === "role") {
    return {
      title: "Roles & Permissions",
      subtitle: log.resourceId ? `Role: ${log.resourceId}` : undefined,
    };
  }

  if (log.resourceType === "permission") {
    return {
      title: "Permissions",
      subtitle: log.resourceId ? `Permission: ${log.resourceId}` : undefined,
    };
  }

  // Handle LDAP configuration
  if (log.resourceType === "ldap_config" || log.resourceType === "ldap") {
    return {
      title: "LDAP / AD Configuration",
      subtitle: log.resourceId || undefined,
    };
  }

  // Handle authentication
  if (log.resourceType === "auth" || log.action.startsWith("auth.")) {
    return {
      title: "Authentication / Session",
      subtitle: log.resourceId || undefined,
    };
  }

  // Fallback
  return {
    title: log.resourceType.charAt(0).toUpperCase() + log.resourceType.slice(1),
    subtitle: log.resourceId || undefined,
  };
}

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [actorUsername, setActorUsername] = useState("");
  const [action, setAction] = useState<string>("all");
  const [outcome, setOutcome] = useState<string>("all");
  const [clientIp, setClientIp] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Selected event for detail dialog
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: AuditLogFilters = {
        limit: pageSize,
        offset: page * pageSize,
      };
      if (actorUsername.trim()) filters.actorUsername = actorUsername.trim();
      if (action !== "all") filters.action = action;
      if (outcome !== "all") filters.outcome = outcome;
      if (clientIp.trim()) filters.clientIp = clientIp.trim();
      if (startDate) filters.startDate = new Date(startDate).toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filters.endDate = end.toISOString();
      }

      const res = await fetchAuditLogs(filters);
      setLogs(res.logs);
      setTotal(res.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load audit logs";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, actorUsername, action, outcome, clientIp, startDate, endDate]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadLogs();
  };

  const handleResetFilters = () => {
    setActorUsername("");
    setAction("all");
    setOutcome("all");
    setClientIp("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  const exportToJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `audit-trail-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Audit log export started");
    } catch {
      toast.error("Failed to export logs");
    }
  };

  const formatTimestamp = (raw: string | Date | undefined | null) => {
    if (!raw) return "—";
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) {
        return String(raw);
      }
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return String(raw);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-4 space-y-4">
      {/* Page Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-6 w-6 text-indigo-600 shrink-0" />
              Security Audit Trail
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Immutable audit records for all authentication events, user updates, and administrative modifications. (Restricted to Super Admin)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={exportToJson} disabled={logs.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        {/* Filter Controls */}
        <CardContent>
          <form onSubmit={handleFilterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Actor Username</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="e.g. admin"
                    value={actorUsername}
                    onChange={(e) => setActorUsername(e.target.value)}
                    className="pl-8 text-xs h-9 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Action Type</label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="text-xs h-9 w-full">
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="auth.login.local">Login (Local)</SelectItem>
                    <SelectItem value="auth.login.ldap">Login (LDAP)</SelectItem>
                    <SelectItem value="auth.logout">Logout</SelectItem>
                    <SelectItem value="page.view">Page Visit</SelectItem>
                    <SelectItem value="report.filter.apply">Filter Applied</SelectItem>
                    <SelectItem value="report.export.pdf">Report Export (PDF)</SelectItem>
                    <SelectItem value="report.export.csv">Report Export (CSV)</SelectItem>
                    <SelectItem value="user.delete">User Delete</SelectItem>
                    <SelectItem value="user.activate">User Activate</SelectItem>
                    <SelectItem value="user.deactivate">User Deactivate</SelectItem>
                    <SelectItem value="ldap.config.update">LDAP Config Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Outcome</label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="text-xs h-9 w-full">
                    <SelectValue placeholder="All outcomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Outcomes</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Client IP</label>
                <Input
                  placeholder="e.g. 192.168.1.50"
                  value={clientIp}
                  onChange={(e) => setClientIp(e.target.value)}
                  className="text-xs h-9 w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-8 text-xs h-9 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-4 text-xs"
              >
                Reset Filters
              </Button>
              <Button type="submit" size="sm" className="h-8 px-5 text-xs bg-indigo-600 hover:bg-indigo-700">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="pt-4">
          {error && (
            <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp (IST)</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Client IP</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading audit records...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No audit events matching current criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const isSuccess = log.outcome === "success";
                    return (
                      <TableRow key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell className="font-mono text-xs text-slate-600 whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-800">
                              {log.actorUsername || "Anonymous / Unauthenticated"}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                              {log.actorType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[11px] font-semibold bg-slate-100">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const resInfo = getDisplayResource(log);
                            return (
                              <div className="text-xs">
                                <span className="font-semibold text-slate-800 block">
                                  {resInfo.title}
                                </span>
                                {resInfo.subtitle && (
                                  <span className="text-[10px] text-muted-foreground block font-mono truncate max-w-[200px]" title={resInfo.subtitle}>
                                    {resInfo.subtitle}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          {isSuccess ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 gap-1 text-[11px]">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1 text-[11px]">
                              <XCircle className="h-3 w-3" />
                              {log.outcome}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {log.clientIp || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedLog(log)}
                            title="View Event Details"
                          >
                            <Eye className="h-4 w-4 text-slate-600 hover:text-indigo-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <div>
              Showing {logs.length} of {total} total records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || loading}
              >
                Previous
              </Button>
              <span className="font-medium">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-700">
              <FileText className="h-5 w-5" />
              Audit Event Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Immutable event payload generated by the server security subsystem.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Event ID</span>
                  <span className="font-mono text-slate-800 break-all">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Timestamp (IST)</span>
                  <span className="font-medium text-slate-800">{formatTimestamp(selectedLog.timestamp)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Actor Identity</span>
                  <span className="font-medium text-slate-800">
                    {selectedLog.actorUsername || "Unauthenticated"} ({selectedLog.actorType})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Action</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Observed Client IP</span>
                  <span className="font-mono font-medium text-slate-800">{selectedLog.clientIp || "Unavailable"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold text-[11px]">Outcome</span>
                  <span className={`font-semibold ${selectedLog.outcome === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                    {selectedLog.outcome.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-200/80 pt-2 mt-1">
                  <span className="text-muted-foreground block font-semibold text-[11px]">Resource / Module</span>
                  <span className="font-semibold text-slate-900 text-xs">
                    {getDisplayResource(selectedLog).title}
                  </span>
                  {getDisplayResource(selectedLog).subtitle && (
                    <span className="font-mono text-[11px] text-muted-foreground block mt-0.5">
                      {getDisplayResource(selectedLog).subtitle}
                    </span>
                  )}
                </div>
              </div>

              {selectedLog.failureReason && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <span className="font-semibold block">Failure Reason</span>
                    <span>{selectedLog.failureReason}</span>
                  </div>
                </div>
              )}

              {selectedLog.userAgent && (
                <div>
                  <span className="text-muted-foreground block font-semibold mb-1">User Agent Header</span>
                  <div className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700 break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}

              <div>
                <span className="text-muted-foreground block font-semibold mb-1">Context & Diff Details</span>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-60">
                  {selectedLog.details
                    ? JSON.stringify(selectedLog.details, null, 2)
                    : "// No additional structured metadata recorded for this event"}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAudit;
