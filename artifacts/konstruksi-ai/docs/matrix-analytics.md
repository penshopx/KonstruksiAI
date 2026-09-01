# Matriks analytics

Event berikut tersedia untuk memahami kombinasi Matriks yang paling membantu
pengguna. Event dikirim melalui wrapper analytics bersama dan aman diabaikan
ketika tracker belum tersedia (misalnya saat development atau sebelum analytics
diaktifkan pada deployment).

### Pencarian dan filter

| Event name | Description |
| --- | --- |
| `matrix_search_used` | Pengguna selesai memakai pencarian Matriks setelah jeda input singkat. |
| `matrix_filter_used` | Pengguna menerapkan filter fungsi bisnis atau bidang keteknikan. |
| `matrix_filters_reset` | Pengguna mereset pencarian dan filter yang sedang aktif. |

Properti `matrix_search_used`:

| Property | Values |
| --- | --- |
| `search_source` | `free_text` atau `quick_search`; tidak berisi kata kunci |
| `search_length_bucket` | `empty`, `short`, `medium`, atau `long`; hanya panjang yang dikelompokkan |
| `business_filter` | ID fungsi bisnis terkontrol atau `all` |
| `engineering_filter` | ID bidang keteknikan terkontrol atau `all` |
| `active_filter_count` | Jumlah filter yang aktif |
| `result_count` | Jumlah kombinasi yang cocok |

Properti `matrix_filter_used`:

| Property | Values |
| --- | --- |
| `filter_type` | `business_function` atau `engineering_domain` |
| `filter_value` | ID opsi filter terkontrol |
| `search_active` | `true` bila pencarian juga sedang aktif |
| `other_filter_active` | `true` bila filter lain juga sedang aktif |
| `result_count` | Jumlah kombinasi setelah filter diterapkan |

Properti `matrix_filters_reset`:

| Property | Values |
| --- | --- |
| `active_filter_count` | Jumlah filter sebelum reset |
| `search_active` | `true` bila pencarian aktif sebelum reset |
| `result_count` | Jumlah kombinasi sebelum reset |

### Pembukaan Agent dan Chat

| Event name | Description |
| --- | --- |
| `matrix_agent_opened` | Pengguna membuka AI Agent dari hasil Matriks atau panel detail. |
| `matrix_chat_opened` | Pengguna membuka Chat dari hasil Matriks atau panel detail. |
| `matrix_cell_selected` | Pengguna memilih kombinasi dari grid atau hasil teratas untuk membuka detail. |

Semua event kombinasi memiliki `business_id` dan `engineering_id`. Event
`matrix_cell_selected` juga memiliki `selection_source` (`grid` atau
`search_result`) dan `result_count` saat kombinasi dipilih.

| Property | Values |
| --- | --- |
| `business_id` | ID fungsi bisnis terkontrol |
| `engineering_id` | ID bidang keteknikan terkontrol |

Tidak ada event Matriks yang mengirim isi pencarian, pertanyaan hasil,
deskripsi topik, atau teks bebas lain.

## Mengaktifkan pengumpulan

Buka **Publishing settings**, aktifkan analytics, lalu publish atau republish
aplikasi. Event di atas mulai tersedia setelah publish berikutnya. Setelah data
masuk, tim dapat membandingkan `result_count` dan kombinasi
`business_filter`/`engineering_filter`, serta membuat funnel dari event
`matrix_search_used` ke `matrix_agent_opened` atau `matrix_chat_opened`.