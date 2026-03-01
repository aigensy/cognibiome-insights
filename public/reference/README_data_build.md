# How external reference snapshots are built (CogniBiome)

This project is offline-first for judge review:
- The app must NOT call external APIs at runtime.
- External sources are packaged as small “reference snapshots” under /reference/.

If you want to refresh them, use one of:
1) Manual download + filtering (Excel / pandas)
2) A web-enabled agent (ChatGPT Agent Mode) that downloads official datasets, filters a small subset, and writes JSON files back into the zip.

See:
- /agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md