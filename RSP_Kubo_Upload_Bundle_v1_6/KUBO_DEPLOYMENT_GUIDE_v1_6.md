# Kubo / IPFS Deployment Guide for RSP Bundle

## Goal

Deploy this RSP bundle to IPFS using Kubo, then mint the NFT using the final metadata URI.

## Start Kubo

```bash
ipfs daemon
```

## Add and pin the whole directory

```bash
ipfs add -r --pin=true RSP_Kubo_Upload_Bundle_v1_6
```

## Kubo HTTP API

Endpoint:

```text
http://127.0.0.1:5001/api/v0/add?pin=true
```

Use `FormData` and read the returned `Hash` field.

## Metadata step

After uploading the files, replace the placeholders in:

`rsp_genesis_metadata_upload_ready_v1_6.json`

Then upload the completed final metadata JSON.

Your mint URI will be:

```text
ipfs://FINAL_METADATA_CID
```

## CORS Note

A hosted Lovable app may not be able to reach local Kubo because of browser/CORS restrictions. Run the app locally, configure Kubo API CORS settings, or use a backend proxy.
