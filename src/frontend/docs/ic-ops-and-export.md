# Internet Computer Operations & Code Export Guide

This guide provides step-by-step instructions for managing your deployed Internet Computer (IC) canisters and exporting your code for local development.

---

## Part 1: Taking Your Canister Offline

There are several methods to stop or disable a deployed IC canister. Choose the approach that best fits your workflow.

### Prerequisites

Before proceeding, you'll need:
- **Canister ID(s)**: The unique identifier(s) of your deployed canister(s)
- **Network**: The IC network your canister is deployed to (usually `ic` for mainnet)
- **Identity**: The dfx identity with control over the canister (usually the one that deployed it)

You can find your canister IDs in:
- `canister_ids.json` in your project root
- The output of `dfx canister id <canister_name>`
- Your deployment logs

### Method 1: Stop the Canister (Recommended)

Stopping a canister makes it temporarily unavailable without deleting its code or state.

