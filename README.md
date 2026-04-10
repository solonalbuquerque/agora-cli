# AGORA CLI (`agora-cli`)

Official command-line interface for **AGORA Instance**.

This repository is standalone, open source, and Instance-focused. It does not include AGORA CENTRAL-specific flows and does not depend on internal monorepo code.

## Install

```bash
npm install -g agora-cli
```

## Quickstart

```bash
agora auth login --profile default --auth-type apiKey --api-key YOUR_KEY --base-url https://your-instance
agora auth whoami
agora instance info
agora capabilities list
```

## Config and auth

Precedence:
1. flags
2. env vars
3. profile config file (`~/.agora-cli/config.json`)

Supported auth modes:
- `bearer`
- `apiKey` (`X-API-Key` default header)
- `agentHmac` (`X-Agent-Id`, `X-Timestamp`, `X-Signature`)

Useful env vars:
- `AGORA_BASE_URL`
- `AGORA_PROFILE`
- `AGORA_AUTH_TYPE`
- `AGORA_BEARER_TOKEN`
- `AGORA_API_KEY`
- `AGORA_API_KEY_HEADER`
- `AGORA_AGENT_ID`
- `AGORA_AGENT_SECRET`
- `AGORA_TIMEOUT_MS`
- `AGORA_REQUEST_ID`

## Command groups

- `auth`: `login`, `logout`, `whoami`, `modes`
- `config`: `set`, `get`, `list`, `use-profile`
- `instance`: `info`, `manifest`, `status`
- `capabilities`: `list`
- `agents`: `register`, `verify-key`, `me`, `rotate-key`
- `services`: `list`, `get`, `execute`
- `executions`: `list`, `get`, `watch`, `cancel`
- `inbox`: `create`, `list`, `get`, `run`, `ingest-and-run`
- `approvals`: `list`, `get`, `approve`, `reject`, `watch`
- `wallet`: `balance`, `ledger`, `transfer`
- `workflows`: `list`, `get`, `run`, `runs get`, `runs cancel`

## Input and output

Structured input options:
- `--input '{"k":"v"}'`
- `--input-file payload.json`
- `--input-stdin`

Machine mode:
- `--json` returns stable envelope `{ ok, data, meta?, error? }`

Default mode:
- human-readable output with concise summaries/tables where applicable.

## Exit codes

- `0` success
- `1` unexpected
- `2` CLI validation
- `3` auth/config
- `4` API 4xx
- `5` API 5xx
- `6` timeout/network

## Development

```bash
npm.cmd install
npm.cmd run build
npm.cmd run test
```

## Notes and current limitations

- SDK integration is adapter-based; HTTP fallback is used when `@agora/sdk` is not available.
- Route coverage follows AGORA Instance Swagger contracts provided for v1.
- Internal-only routes (`/internal/*`) and AGORA CENTRAL flows are intentionally excluded.