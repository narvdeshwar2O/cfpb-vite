import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Radio,
  Server,
} from "lucide-react";
import {
  fetchLdapConfig,
  saveLdapConfig,
  testLdapConnection,
  listRoles,
  type LdapConfig,
  type AdminRole,
} from "@/services/adminApi";

export const AdminLdap: React.FC = () => {
  const [config, setConfig] = useState<LdapConfig>({
    enabled: false,
    serverUrl: "ldaps://s1ncrbdcw501a.nafis.ncrb.in:636",
    baseDn: "DC=nafis,DC=ncrb,DC=in",
    bindDn: "CN=ldaprepli,CN=Users,DC=nafis,DC=ncrb,DC=in",
    bindPassword: "",
    searchFilter: "{username}",
    defaultRole: "STATE OPERATOR",
    useTls: true,
    groupRoleMappings: [],
  });

  const [availableRoles, setAvailableRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // New mapping row inputs
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupRole, setNewGroupRole] = useState("STATE OPERATOR");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ldapData, rolesData] = await Promise.all([
          fetchLdapConfig(),
          listRoles(),
        ]);
        setConfig(ldapData);
        setAvailableRoles(rolesData);
        if (rolesData.length > 0) {
          setNewGroupRole(rolesData[0].name);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load LDAP configuration");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTestResult(null);
    try {
      await saveLdapConfig(config);
      toast.success("LDAP configuration saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save LDAP configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testLdapConnection({
        serverUrl: config.serverUrl,
        bindDn: config.bindDn,
        bindPassword: config.bindPassword,
        baseDn: config.baseDn,
      });
      setTestResult(res);
      if (res.ok) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection test failed";
      setTestResult({ ok: false, message: msg });
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  const handleAddMapping = () => {
    if (!newGroupName.trim()) {
      toast.error("AD Group name cannot be empty");
      return;
    }
    const current = config.groupRoleMappings || [];
    if (current.some((m) => m.groupName.toLowerCase() === newGroupName.trim().toLowerCase())) {
      toast.error("This group mapping already exists");
      return;
    }
    setConfig({
      ...config,
      groupRoleMappings: [
        ...current,
        { groupName: newGroupName.trim(), roleName: newGroupRole },
      ],
    });
    setNewGroupName("");
  };

  const handleRemoveMapping = (index: number) => {
    const updated = [...config.groupRoleMappings];
    updated.splice(index, 1);
    setConfig({ ...config, groupRoleMappings: updated });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-5xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-600" />
              LDAP / Active Directory
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Authenticate users against your organization's directory
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Enabled
            </label>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Connection Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Server URL</Label>
              <Input
                placeholder="ldaps://s1ncrbdcw501a.nafis.ncrb.in:636"
                value={config.serverUrl}
                onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Base DN</Label>
              <Input
                placeholder="DC=nafis,DC=ncrb,DC=in"
                value={config.baseDn}
                onChange={(e) => setConfig({ ...config, baseDn: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Bind DN (service account)</Label>
              <Input
                placeholder="CN=ldaprepli,CN=Users,DC=nafis,DC=ncrb,DC=in"
                value={config.bindDn}
                onChange={(e) => setConfig({ ...config, bindDn: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Bind Password</Label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={config.bindPassword || ""}
                onChange={(e) => setConfig({ ...config, bindPassword: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">User Search Filter</Label>
              <Input
                placeholder="{username}"
                value={config.searchFilter}
                onChange={(e) => setConfig({ ...config, searchFilter: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm"
              />
              <p className="text-[11px] text-muted-foreground font-medium">
                &#123;username&#125; is replaced with the login input
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Default Role</Label>
              <Select
                value={config.defaultRole}
                onValueChange={(val) => setConfig({ ...config, defaultRole: val })}
              >
                <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                  <SelectValue placeholder="Select Default Role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground font-medium">
                Role assigned when user's AD groups don't match any mapping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="useTls"
              checked={config.useTls}
              onChange={(e) => setConfig({ ...config, useTls: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="useTls" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Use TLS / STARTTLS
            </Label>
          </div>

          {/* Group - Role Mapping Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Group — Role Mapping</h4>
              <p className="text-xs text-slate-500">
                Map Active Directory group names to application roles. Users in multiple groups get the highest-privilege role.
              </p>
            </div>

            {/* Existing mappings list */}
            {config.groupRoleMappings && config.groupRoleMappings.length > 0 && (
              <div className="space-y-2 max-w-3xl">
                {config.groupRoleMappings.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800">{m.groupName}</span>
                      <span className="text-slate-400">→</span>
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                        {m.roleName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMapping(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new mapping row */}
            <div className="flex flex-wrap items-center gap-3 max-w-3xl pt-1">
              <div className="flex-1 min-w-[240px]">
                <Input
                  placeholder="AD Group Name (e.g., Domain Admins, Operators)"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-xs h-9"
                />
              </div>
              <div className="w-56 min-w-[180px] py-2">
                <Select value={newGroupRole} onValueChange={setNewGroupRole}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMapping}
                className="text-xs font-semibold gap-1.5 h-9 px-3.5 border-slate-300 hover:bg-slate-100 shrink-0 p-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Mapping
              </Button>
            </div>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium border ${
                testResult.ok
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 h-9 rounded-lg shadow-sm gap-2 shrink-0 p-2"
            >
              <Save className="h-4 w-4 shrink-0" />
              <span>{saving ? "Saving…" : "Save Configuration"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing}
              className="text-slate-700 border-slate-300 hover:bg-slate-50 font-semibold text-xs px-4 h-9 rounded-lg gap-2 shrink-0"
            >
              <Radio className={`h-4 w-4 shrink-0 ${testing ? "animate-pulse text-indigo-600" : ""}`} />
              <span>{testing ? "Testing…" : "Test Connection"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLdap;
