import React, { useEffect, useState, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { CheckCircle2, AlertCircle, Save, Radio, Server } from "lucide-react";
import { fetchLdapConfig, saveLdapConfig, testLdapConnection, listRoles, type LdapConfig } from "@/services/adminApi";
import { LdapConnectionForm } from "@/features/administration/components/LdapConnectionForm";
import { LdapGroupMapping } from "@/features/administration/components/LdapGroupMapping";

export const AdminLdap: React.FC = () => {
  const [config, setConfig] = useState<LdapConfig>({
    enabled: false, serverUrl: "", baseDn: "", bindDn: "", bindPassword: "",
    searchFilter: "(|(sAMAccountName={username})(uid={username}))", useTls: true, groupRoleMappings: [],
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const enabledId = useId();

  useEffect(() => {
    Promise.all([fetchLdapConfig(), listRoles().catch(() => [])])
      .then(([ldap, r]) => {
        setConfig(ldap);
        setRoles(Array.from(new Set(r.map((x) => x.name.trim()).filter(Boolean))));
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load LDAP settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setTestResult(null);
    try {
      const payload = { ...config, bindPassword: config.bindPassword === "••••••••••••" ? undefined : config.bindPassword };
      await saveLdapConfig(payload);
      setConfig((p) => ({ ...p, bindPassword: "••••••••••••" }));
      toast.success("LDAP configuration saved successfully");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save configuration"); }
    finally { setSaving(false); }
  };

  const handleTest = async () => {
    setTesting(true); setTestResult(null);
    try {
      const res = await testLdapConnection({
        enabled: config.enabled, serverUrl: config.serverUrl, bindDn: config.bindDn, baseDn: config.baseDn,
        bindPassword: config.bindPassword === "••••••••••••" ? undefined : config.bindPassword,
        searchFilter: config.searchFilter, useTls: config.useTls,
      });
      setTestResult(res);
      if (res.ok) toast.success(res.message); else toast.error(res.message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection test failed";
      setTestResult({ ok: false, message });
      toast.error(message);
    } finally { setTesting(false); }
  };

  if (loading) return <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2"><Server className="h-5 w-5 text-indigo-600" /> LDAP / Active Directory</CardTitle>
            <CardDescription className="text-slate-500 text-xs">Authenticate enterprise users against your directory service</CardDescription>
          </div>
          <label htmlFor={enabledId} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
            <input id={enabledId} type="checkbox" checked={config.enabled} onChange={(e) => setConfig((p) => ({ ...p, enabled: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Enabled
          </label>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <LdapConnectionForm config={config} onChange={(k, v) => setConfig((p) => ({ ...p, [k]: v }))} />
          <LdapGroupMapping mappings={config.groupRoleMappings} roles={roles} onChange={(m) => setConfig((p) => ({ ...p, groupRoleMappings: m }))} />
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium border ${testResult.ok ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"}`}>
              {testResult.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 h-9 rounded-lg shadow-sm gap-2 shrink-0">
              <Save className="h-4 w-4 shrink-0" /><span>{saving ? "Saving…" : "Save Configuration"}</span>
            </Button>
            <Button type="button" variant="outline" onClick={handleTest} disabled={testing} className="text-slate-700 border-slate-300 hover:bg-slate-50 font-semibold text-xs px-4 h-9 rounded-lg gap-2 shrink-0">
              <Radio className={`h-4 w-4 shrink-0 ${testing ? "animate-pulse text-indigo-600" : ""}`} /><span>{testing ? "Testing…" : "Test Connection"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminLdap;

