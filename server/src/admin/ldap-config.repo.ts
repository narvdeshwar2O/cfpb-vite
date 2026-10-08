import { query } from "../db/pool.js";
import { encryptValue, decryptValue } from "../utils/crypto.js";

export interface LdapConfigDto {
  enabled: boolean;
  serverUrl: string;
  baseDn: string;
  bindDn: string;
  bindPassword?: string;
  searchFilter: string;
  useTls: boolean;
  groupRoleMappings: Array<{ groupName: string; roleName: string }>;
}

let tableInitialized = false;

async function ensureSettingsTable(): Promise<void> {
  if (tableInitialized) return;
  await query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `);
  tableInitialized = true;
}

const LDAP_CONFIG_KEY = "ldap_config";

/**
 * Returns LDAP config with decrypted password for internal backend/auth operations.
 */
export async function getLdapConfig(): Promise<LdapConfigDto> {
  await ensureSettingsTable();
  const res = await query<{ value: LdapConfigDto }>(
    `SELECT value FROM system_settings WHERE key = $1`,
    [LDAP_CONFIG_KEY]
  );

  if (res.rows[0]) {
    const raw = res.rows[0].value;
    return {
      ...raw,
      bindPassword: decryptValue(raw.bindPassword),
    };
  }

  // Default empty configuration managed strictly by Super Admin via UI/DB
  return {
    enabled: false,
    serverUrl: "",
    baseDn: "",
    bindDn: "",
    bindPassword: "",
    searchFilter: "(|(sAMAccountName={username})(uid={username}))",
    useTls: true,
    groupRoleMappings: [],
  };
}

/**
 * Saves LDAP config with bindPassword encrypted using AES-256-GCM in the database.
 */
export async function saveLdapConfig(cfg: LdapConfigDto): Promise<void> {
  await ensureSettingsTable();

  // If bindPassword is left empty or as placeholder, preserve existing saved password
  let passwordToSave = cfg.bindPassword;
  if (!passwordToSave || passwordToSave === "••••••••••••") {
    const existing = await getLdapConfig();
    passwordToSave = existing.bindPassword;
  }

  const encryptedCfg = {
    ...cfg,
    bindPassword: passwordToSave ? encryptValue(passwordToSave) : "",
  };

  await query(
    `INSERT INTO system_settings (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE
     SET value = EXCLUDED.value, updated_at = now()`,
    [LDAP_CONFIG_KEY, JSON.stringify(encryptedCfg)]
  );
}

