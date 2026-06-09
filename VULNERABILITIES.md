# npm audit report

axios  <=0.31.0
Severity: high
Axios Cross-Site Request Forgery Vulnerability - https://github.com/advisories/GHSA-wf5p-g6vw-rhxx
axios Requests Vulnerable To Possible SSRF and Credential Leakage via Absolute URL - https://github.com/advisories/GHSA-jr5f-v2jv-69x6
Axios has a NO_PROXY Hostname Normalization Bypass that Leads to SSRF - https://github.com/advisories/GHSA-3p68-rc4w-qgx5
Axios: Authentication Bypass via Prototype Pollution Gadget in `validateStatus` Merge Strategy - https://github.com/advisories/GHSA-w9j2-pvgh-6h63
Axios: Incomplete Fix for CVE-2025-62718 — NO_PROXY Protection Bypassed via RFC 1122 Loopback Subnet (127.0.0.0/8) in Axios 1.15.0 - https://github.com/advisories/GHSA-pmwg-cvhr-8vh7
Axios: Null Byte Injection via Reverse-Encoding in AxiosURLSearchParams - https://github.com/advisories/GHSA-xhjh-pmcv-23jw
Axios: no_proxy bypass via IP alias allows SSRF - https://github.com/advisories/GHSA-m7pr-hjqh-92cm
Axios: unbounded recursion in toFormData causes DoS via deeply nested request data - https://github.com/advisories/GHSA-62hf-57xw-28j9
Axios' HTTP adapter-streamed uploads bypass maxBodyLength when maxRedirects: 0 - https://github.com/advisories/GHSA-5c9x-8gcm-mpgx
Axios: HTTP adapter streamed responses bypass maxContentLength - https://github.com/advisories/GHSA-vf2m-468p-8v99
Axios: Prototype Pollution Gadgets - Response Tampering, Data Exfiltration, and Request Hijacking - https://github.com/advisories/GHSA-pf86-5x62-jrwf
Axios: Header Injection via Prototype Pollution - https://github.com/advisories/GHSA-6chq-wfr3-2hj9
Axios: XSRF Token Cross-Origin Leakage via Prototype Pollution Gadget in `withXSRFToken` Boolean Coercion - https://github.com/advisories/GHSA-xx6v-rp6x-q39c
Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig - https://github.com/advisories/GHSA-43fc-jf86-j433
Axios has Unrestricted Cloud Metadata Exfiltration via Header Injection Chain - https://github.com/advisories/GHSA-fvcv-3m26-pcqx
fix available via `npm audit fix --force`
Will install kiteconnect@5.3.0, which is a breaking change
node_modules/kiteconnect/node_modules/axios
  kiteconnect  3.0.0-beta.2 - 5.0.1
  Depends on vulnerable versions of axios
  node_modules/kiteconnect

form-data  <2.5.4
Severity: critical
form-data uses unsafe random function in form-data for choosing boundary - https://github.com/advisories/GHSA-fjxv-7rqg-78g4
fix available via `npm audit fix --force`
Will install node-telegram-bot-api@0.63.0, which is a breaking change
node_modules/request/node_modules/form-data
  request  *
  Depends on vulnerable versions of form-data
  Depends on vulnerable versions of qs
  Depends on vulnerable versions of tough-cookie
  Depends on vulnerable versions of uuid
  node_modules/request
    request-promise-core  *
    Depends on vulnerable versions of request
    node_modules/request-promise-core
      @cypress/request-promise  *
      Depends on vulnerable versions of request-promise-core
      node_modules/@cypress/request-promise
        node-telegram-bot-api  >=0.64.0
        Depends on vulnerable versions of @cypress/request-promise
        node_modules/node-telegram-bot-api

qs  <=6.15.1
Severity: moderate
qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion - https://github.com/advisories/GHSA-6rw7-vpxm-498p
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
fix available via `npm audit fix --force`
Will install node-telegram-bot-api@0.63.0, which is a breaking change
node_modules/@cypress/request/node_modules/qs
node_modules/request/node_modules/qs
  @cypress/request  <=4.0.0
  Depends on vulnerable versions of qs
  Depends on vulnerable versions of uuid
  node_modules/@cypress/request


tough-cookie  <4.1.3
Severity: moderate
tough-cookie Prototype Pollution vulnerability - https://github.com/advisories/GHSA-72xf-g2v4-qvf3
fix available via `npm audit fix --force`
Will install node-telegram-bot-api@0.63.0, which is a breaking change
node_modules/request/node_modules/tough-cookie

uuid  <11.1.1
Severity: moderate
uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided - https://github.com/advisories/GHSA-w5hq-g745-h8pq
fix available via `npm audit fix --force`
Will install node-telegram-bot-api@0.63.0, which is a breaking change
node_modules/@cypress/request/node_modules/uuid
node_modules/request/node_modules/uuid

11 vulnerabilities (7 moderate, 2 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
