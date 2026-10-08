import React, { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LdapConfig } from "@/services/adminApi";

interface FieldConfig {
  key: keyof Omit<LdapConfig, "enabled" | "useTls" | "groupRoleMappings">;
  label: string;
  placeholder: string;
  type?: "text" | "password";
  helperText?: string;
}

const LDAP_FIELDS: FieldConfig[] = [
  {
    key: "serverUrl",
    label: "Server URL",
    placeholder: "ldaps://dc.example.com:636 or ldap://dc.example.com:389",
    helperText: "Secure LDAP (LDAPS on port 636) is recommended",
  },
  {
    key: "baseDn",
    label: "Base DN",
    placeholder: "DC=domain,DC=local",
    helperText: "Root search location in the directory tree",
  },
  {
    key: "bindDn",
    label: "Bind DN (Service Account)",
    placeholder: "CN=svc_ldap,OU=Service Accounts,DC=domain,DC=local",
    helperText: "Distinguished name of account used for querying AD",
  },
  {
    key: "bindPassword",
    label: "Bind Password",
    placeholder: "••••••••••••",
    type: "password",
    helperText: "Saved encrypted in DB. Leave as-is to keep existing password",
  },
  {
    key: "searchFilter",
    label: "User Search Filter",
    placeholder: "(|(sAMAccountName={username})(uid={username}))",
    helperText: "{username} is replaced with the user's login name",
  },
];

interface Props {
  config: LdapConfig;
  onChange: <K extends keyof LdapConfig>(key: K, value: LdapConfig[K]) => void;
}

export const LdapConnectionForm: React.FC<Props> = ({ config, onChange }) => {
  const useTlsId = useId();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LDAP_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">{f.label}</Label>
            <Input
              type={f.type || "text"}
              placeholder={f.placeholder}
              value={(config[f.key] as string) || ""}
              onChange={(e) => onChange(f.key, e.target.value as LdapConfig[typeof f.key])}
              className="bg-slate-50 border-slate-200 text-sm"
            />
            {f.helperText && (
              <p className="text-[11px] text-muted-foreground font-medium">{f.helperText}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={useTlsId}
          checked={config.useTls}
          onChange={(e) => onChange("useTls", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor={useTlsId} className="text-xs font-semibold text-slate-700 cursor-pointer">
          Use TLS / STARTTLS (Reject Unauthorized: false for private CAs)
        </Label>
      </div>
    </>
  );
};
