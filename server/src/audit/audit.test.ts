import assert from "node:assert/strict";
import { extractClientIp } from "./ip.utils.js";
import { sanitizeAuditDetails } from "./audit.repo.js";

async function runTests() {
  console.log("Running Audit Logging Subsystem Tests...\n");

  // 1. IP extraction tests
  console.log("1. Testing IP extraction and normalization:");
  {
    const req1 = { socket: { remoteAddress: "::ffff:192.168.1.42" } } as any;
    assert.equal(extractClientIp(req1), "192.168.1.42", "IPv4-mapped IPv6 should be normalized to clean IPv4");

    const req2 = { socket: { remoteAddress: "::1" } } as any;
    assert.equal(extractClientIp(req2), "127.0.0.1", "Localhost IPv6 should normalize to 127.0.0.1");

    const req3 = { socket: { remoteAddress: "10.0.2.15" } } as any;
    assert.equal(extractClientIp(req3), "10.0.2.15", "Direct private IPv4 address should be preserved");

    const req4 = { socket: null, connection: null } as any;
    assert.equal(extractClientIp(req4), null, "Missing socket address should return null safely");
    console.log("  ✓ extractClientIp passed all normalization and boundary checks");
  }

  // 2. Sensitive data redaction tests
  console.log("\n2. Testing audit detail sanitization & secret redaction:");
  {
    const dirtyDetails = {
      username: "john_doe",
      password: "SuperSecretPassword123!",
      password_hash: "$2a$10$abcdefghijklmnopqrstuvwxyz",
      nested: {
        bindPassword: "DomainPassword456",
        token: "jwt.secret.token",
        allowedSetting: true,
      },
      roles: ["Analyst"],
    };

    const clean = sanitizeAuditDetails(dirtyDetails);
    assert.equal(clean?.username, "john_doe", "Non-sensitive fields should be retained");
    assert.equal(clean?.password, "[REDACTED]", "Plaintext password must be redacted");
    assert.equal(clean?.password_hash, "[REDACTED]", "Password hash must be redacted");
    assert.equal((clean?.nested as any)?.bindPassword, "[REDACTED]", "LDAP bind passwords must be redacted");
    assert.equal((clean?.nested as any)?.token, "[REDACTED]", "Tokens must be redacted");
    assert.equal((clean?.nested as any)?.allowedSetting, true, "Safe nested settings must be retained");
    console.log("  ✓ sanitizeAuditDetails correctly redacts credentials and tokens");
  }

  console.log("\n All audit tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
