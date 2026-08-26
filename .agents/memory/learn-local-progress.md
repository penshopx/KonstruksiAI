---
name: Learn local progress
description: The first Learn progress milestone is intentionally per-device and anonymous-safe.
---

Progress pelajaran Learn pada fase awal disimpan secara lokal di perangkat, bukan disatukan dengan akun atau workspace.

**Why:** Pengguna anonim tetap harus dapat belajar tanpa membuat data progres seolah-olah telah tersinkronisasi lintas perangkat atau dibagikan dengan anggota proyek. Jika penyimpanan perangkat gagal, UI harus menyatakan progres belum tersimpan dan tidak boleh menandai pelajaran selesai.

**How to apply:** Pertahankan progres sebagai data pribadi per perangkat sampai ada fitur terpisah untuk penyimpanan akun yang tervalidasi. Jangan gunakan progres lokal sebagai bukti sertifikat, status proyek, atau data tim.