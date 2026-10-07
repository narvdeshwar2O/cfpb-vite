import { Client } from "ldapts";
import { getLdapConfig } from "../admin/ldap-config.repo.js";

export interface LdapUserAttributes {
  dn: string;
  username: string;
  fullName: string | null;
  email: string | null;
  state: string | null;
  groups: string[];
}

export async function testLdapConnection(params: {
  serverUrl: string;
  bindDn: string;
  bindPassword?: string;
  baseDn: string;
}): Promise<{ ok: boolean; message: string; namingContexts?: string[] }> {
  const isLdaps = params.serverUrl.startsWith("ldaps://");
  const client = new Client({
    url: params.serverUrl,
    timeout: 10000,
    connectTimeout: 10000,
    strictDN: false,
    tlsOptions: isLdaps ? { rejectUnauthorized: false } : undefined,
  });

  try {
    if (params.bindDn && params.bindPassword) {
      await client.bind(params.bindDn, params.bindPassword);
    }
    // Query root DSE for namingContexts
    const rootDse = await client.search("", {
      scope: "base",
      filter: "(objectClass=*)",
      attributes: ["namingContexts", "defaultNamingContext"],
    });

    let contexts: string[] = [];
    if (rootDse.searchEntries.length > 0) {
      const raw = rootDse.searchEntries[0].namingContexts;
      if (Array.isArray(raw)) contexts = raw.map(String);
      else if (raw) contexts = [String(raw)];
    }

    return {
      ok: true,
      message: "Successfully connected and bound to LDAP directory",
      namingContexts: contexts,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `LDAP Connection failed: ${errorMsg}` };
  } finally {
    await client.unbind().catch(() => {});
  }
}

/**
 * Authenticates user against configured LDAP / Active Directory directory.
 */
export async function authenticateLdap(
  username: string,
  password: string
): Promise<LdapUserAttributes | null> {
  const ldapSettings = await getLdapConfig();
  if (!ldapSettings.enabled) {
    return null;
  }

  const isLdaps = ldapSettings.serverUrl.startsWith("ldaps://");
  const tlsOptions = isLdaps ? { rejectUnauthorized: false } : undefined;

  const client = new Client({
    url: ldapSettings.serverUrl,
    timeout: 10000,
    connectTimeout: 10000,
    strictDN: false,
    tlsOptions,
  });

  try {
    // Step 1: Initial bind to search directory
    if (ldapSettings.bindDn && ldapSettings.bindPassword) {
      await client.bind(ldapSettings.bindDn, ldapSettings.bindPassword);
    }

    // Step 2: Search for user entry
    // Normalize username: strip DOMAIN\ or @domain if user typed it
    let cleanUsername = username.trim();
    if (cleanUsername.includes("\\")) {
      cleanUsername = cleanUsername.split("\\").pop() || cleanUsername;
    } else if (cleanUsername.includes("@")) {
      cleanUsername = cleanUsername.split("@")[0] || cleanUsername;
    }

    const sanitizedUsername = cleanUsername.replace(/[\\*()]/g, "");
    let filter = ldapSettings.searchFilter;
    if (filter.includes("{username}")) {
      filter = filter.replace(/\{username\}/g, sanitizedUsername);
    } else if (filter.includes("{{username}}")) {
      filter = filter.replace(/\{\{username\}\}/g, sanitizedUsername);
    } else {
      filter = `(|(sAMAccountName=${sanitizedUsername})(uid=${sanitizedUsername}))`;
    }

    const searchResult = await client.search(ldapSettings.baseDn, {
      filter,
      scope: "sub",
      attributes: [
        "dn",
        "cn",
        "displayName",
        "mail",
        "userPrincipalName",
        "sAMAccountName",
        "uid",
        "memberOf",
        "st",
        "l",
      ],
    });

    if (!searchResult.searchEntries || searchResult.searchEntries.length === 0) {
      return null;
    }

    const entry = searchResult.searchEntries[0];
    const userDn = entry.dn;

    if (!userDn) {
      return null;
    }

    // Step 3: Unbind search connection, then bind as user to verify password
    await client.unbind().catch(() => {});

    const userClient = new Client({
      url: ldapSettings.serverUrl,
      timeout: 10000,
      connectTimeout: 10000,
      strictDN: false,
      tlsOptions,
    });

    try {
      await userClient.bind(userDn, password);
    } catch {
      // Invalid user credentials
      return null;
    } finally {
      await userClient.unbind().catch(() => {});
    }

    // Step 4: Extract attributes
    const fullName =
      (entry.displayName as string) ||
      (entry.cn as string) ||
      null;

    const email =
      (entry.mail as string) ||
      (entry.userPrincipalName as string) ||
      null;

    const state =
      (entry.st as string) ||
      (entry.l as string) ||
      null;

    const rawGroups = entry.memberOf;
    const groups: string[] = [];
    if (Array.isArray(rawGroups)) {
      groups.push(...rawGroups.map(String));
    } else if (rawGroups) {
      groups.push(String(rawGroups));
    }

    return {
      dn: userDn,
      username,
      fullName: typeof fullName === "string" ? fullName.trim() : null,
      email: typeof email === "string" ? email.trim() : null,
      state: typeof state === "string" ? state.trim() : null,
      groups,
    };
  } catch (err) {
    console.error("[LDAP] Authentication error:", err);
    return null;
  } finally {
    await client.unbind().catch(() => {});
  }
}
