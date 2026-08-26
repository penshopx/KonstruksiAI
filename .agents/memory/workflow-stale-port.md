---
name: Stale workflow ports
description: Artifact workflows can be marked failed while an old child process still owns the injected port.
---

Jika workflow artifact gagal dengan `EADDRINUSE` tetapi endpoint masih merespons, anggap proses anak lama masih hidup sebelum menyimpulkan aplikasi rusak.

**Why:** Restart supervisor dapat membuat proses baru gagal sementara proses lama tetap melayani port, sehingga status workflow dan kondisi server tampak bertentangan.

**How to apply:** Verifikasi port dengan curl dan identifikasi PID proses terkait. Hentikan hanya proses artifact yang stale, lalu restart workflow terkelola sekali dan cek log readiness.