"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  HardHat,
  MapPin,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type Availability = "now" | "soon" | "flexible";
type Worker = {
  id: string;
  name: string;
  trade: string;
  skills: string[];
  area: string;
  availability: Availability;
  updatedAt: string;
};
type Job = {
  id: string;
  title: string;
  skills: string[];
  area: string;
  availability: Availability;
  updatedAt: string;
};

const STORAGE_KEY = "konstruksi-ai-workforce-prototype-v1";
const AREAS = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"];
const AVAILABILITY_LABEL: Record<Availability, string> = {
  now: "Siap sekarang",
  soon: "Dalam 2 minggu",
  flexible: "Fleksibel",
};
const inputClass = "wa-input";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSkills(value: string) {
  return [...new Set(value.split(",").map((skill) => skill.trim()).filter(Boolean))];
}

function scoreMatch(worker: Worker, job: Job) {
  const desired = job.skills.map((skill) => skill.toLocaleLowerCase("id"));
  const skills = worker.skills.filter((skill) => desired.includes(skill.toLocaleLowerCase("id")));
  const area = worker.area === job.area;
  const available =
    job.availability === "flexible" ||
    worker.availability === "flexible" ||
    worker.availability === job.availability ||
    (worker.availability === "now" && job.availability === "soon");
  const score = Math.round(((skills.length / Math.max(desired.length, 1)) * 0.6 + (area ? 0.25 : 0) + (available ? 0.15 : 0)) * 100);
  return { skills, area, available, score };
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="wa-field">
      <span className="wa-label">{label}</span>
      {children}
      {hint && <span className="wa-hint">{hint}</span>}
    </label>
  );
}

export default function WorkforceAssignmentPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState("");
  const [workerForm, setWorkerForm] = useState({ name: "", trade: "", skills: "", area: AREAS[0], availability: "now" as Availability });
  const [jobForm, setJobForm] = useState({ title: "", skills: "", area: AREAS[0], availability: "now" as Availability });
  const [editingWorker, setEditingWorker] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profiles" | "jobs">("profiles");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { workers?: Worker[]; jobs?: Job[] };
        setWorkers(Array.isArray(saved.workers) ? saved.workers : []);
        setJobs(Array.isArray(saved.jobs) ? saved.jobs : []);
      }
    } catch {
      setStorageError(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ workers, jobs }));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [workers, jobs, ready]);

  const matchCount = useMemo(() => jobs.length * workers.length, [jobs.length, workers.length]);

  function submitWorker(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skills = normalizeSkills(workerForm.skills);
    if (!workerForm.name.trim() || !workerForm.trade.trim() || skills.length === 0) {
      setNotice("Lengkapi nama, bidang kerja, dan minimal satu keahlian.");
      return;
    }
    if (editingWorker) {
      setWorkers((current) => current.map((item) => item.id === editingWorker ? { ...item, ...workerForm, name: workerForm.name.trim(), trade: workerForm.trade.trim(), skills, updatedAt: new Date().toISOString() } : item));
      setNotice("Profil tes diperbarui.");
    } else {
      setWorkers((current) => [{ ...workerForm, id: makeId(), name: workerForm.name.trim(), trade: workerForm.trade.trim(), skills, updatedAt: new Date().toISOString() }, ...current]);
      setNotice("Profil tes disimpan di browser ini.");
    }
    setWorkerForm({ name: "", trade: "", skills: "", area: AREAS[0], availability: "now" });
    setEditingWorker(null);
    setActiveTab("profiles");
  }

  function submitJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skills = normalizeSkills(jobForm.skills);
    if (!jobForm.title.trim() || skills.length === 0) {
      setNotice("Lengkapi judul kebutuhan dan minimal satu keahlian.");
      return;
    }
    if (editingJob) {
      setJobs((current) => current.map((item) => item.id === editingJob ? { ...item, ...jobForm, title: jobForm.title.trim(), skills, updatedAt: new Date().toISOString() } : item));
      setNotice("Kebutuhan tes diperbarui.");
    } else {
      setJobs((current) => [{ ...jobForm, id: makeId(), title: jobForm.title.trim(), skills, updatedAt: new Date().toISOString() }, ...current]);
      setNotice("Kebutuhan tes disimpan di browser ini.");
    }
    setJobForm({ title: "", skills: "", area: AREAS[0], availability: "now" });
    setEditingJob(null);
    setActiveTab("jobs");
  }

  function startEditWorker(worker: Worker) {
    setEditingWorker(worker.id);
    setWorkerForm({ name: worker.name, trade: worker.trade, skills: worker.skills.join(", "), area: worker.area, availability: worker.availability });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEditJob(job: Job) {
    setEditingJob(job.id);
    setJobForm({ title: job.title, skills: job.skills.join(", "), area: job.area, availability: job.availability });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearLocalRecords() {
    if (!window.confirm("Hapus semua profil dan kebutuhan tes dari browser ini?")) return;
    setWorkers([]);
    setJobs([]);
    setNotice("Semua data tes lokal telah dihapus.");
  }

  return (
    <main className="workforce-page">
      <style>{`
        .workforce-page{--ink:#edf5ff;--muted:#a8bbd3;--line:#263c57;--panel:#0e1b2a;--panel2:#12243a;--canvas:#08111d;--blue:#81baff;--blue-strong:#2787ff;--lime:#c8ef75;min-height:100dvh;background:radial-gradient(ellipse at 78% -10%,#183253 0,transparent 42%),var(--canvas);color:var(--ink);font-family:var(--app-font-sans,ui-sans-serif,system-ui,sans-serif);padding:28px clamp(18px,4vw,64px) 64px}
        .wa-shell{max-width:1440px;margin:0 auto}.wa-topline{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:0 0 18px;margin-bottom:38px}.wa-brand{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:750;letter-spacing:.02em}.wa-mark{width:34px;height:34px;display:grid;place-items:center;background:var(--lime);color:#102031;border-radius:9px}.wa-top-meta{font:11px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.13em;color:var(--muted)}.wa-hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(260px,.7fr);gap:42px;align-items:end;margin-bottom:30px}.wa-kicker{display:flex;align-items:center;gap:9px;color:var(--lime);font:700 11px ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase;margin-bottom:16px}.wa-kicker:before{content:"";width:25px;height:1px;background:currentColor}.wa-hero h1{font-size:clamp(36px,5vw,66px);line-height:.98;letter-spacing:-.055em;max-width:760px;margin:0;font-weight:730}.wa-hero h1 span{color:var(--blue)}.wa-lede{color:var(--muted);font-size:15px;line-height:1.7;max-width:650px;margin:20px 0 0}.wa-hero-aside{border-left:2px solid var(--lime);padding:4px 0 4px 18px;color:#d8e6f6;font-size:13px;line-height:1.65}.wa-hero-aside strong{display:block;color:var(--lime);font:700 10px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
        .wa-notice{display:flex;gap:13px;align-items:flex-start;background:#152238;border:1px solid #395273;border-radius:11px;padding:14px 17px;margin:26px 0 28px;color:#cbdcf0;font-size:12px;line-height:1.6}.wa-notice svg{color:var(--blue);flex:0 0 auto;margin-top:1px}.wa-notice strong{color:#fff}.wa-notice .wa-notice-tag{display:inline-block;color:var(--lime);font:700 10px ui-monospace,monospace;letter-spacing:.09em;text-transform:uppercase;margin-right:8px}.wa-stats{display:flex;gap:0;border:1px solid var(--line);border-radius:11px;overflow:hidden;background:#0d1927;margin-bottom:28px}.wa-stat{padding:16px 22px;min-width:155px;border-right:1px solid var(--line)}.wa-stat:last-child{border:0}.wa-stat b{display:block;font-size:22px;letter-spacing:-.04em}.wa-stat span{font:10px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}.wa-stat.status b{color:var(--lime);font-size:13px;letter-spacing:0;padding:5px 0}
        .wa-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,.72fr);gap:22px;align-items:start}.wa-card{background:linear-gradient(145deg,rgba(18,36,58,.96),rgba(12,25,40,.98));border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 18px 45px #0002}.wa-card-head{padding:19px 22px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:12px;align-items:center}.wa-card-title{display:flex;gap:11px;align-items:center}.wa-card-icon{width:34px;height:34px;display:grid;place-items:center;background:#1c3551;color:var(--blue);border-radius:9px}.wa-card-head h2{font-size:15px;margin:0;font-weight:700;letter-spacing:-.02em}.wa-card-head p{color:var(--muted);font-size:11px;margin:4px 0 0}.wa-card-body{padding:22px}.wa-form{display:grid;grid-template-columns:1fr 1fr;gap:16px}.wa-field{display:flex;flex-direction:column;gap:7px;min-width:0}.wa-field.full{grid-column:1/-1}.wa-label{font-size:11px;font-weight:650;color:#dce8f6;letter-spacing:.015em}.wa-input{width:100%;height:43px;border:1px solid #34506c;border-radius:7px;background:#081522;color:#f1f7ff;padding:0 12px;font:13px inherit;outline:none;transition:border-color .16s,background .16s}.wa-input:focus{border-color:var(--blue);background:#0c1d30}.wa-input::placeholder{color:#7188a3}.wa-hint{color:#8ea4bf;font-size:10px;line-height:1.45}.wa-form-actions{grid-column:1/-1;display:flex;align-items:center;gap:10px;margin-top:3px}.wa-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;border:1px solid transparent;border-radius:7px;padding:0 14px;font-size:11px;font-weight:700;cursor:pointer;transition:transform .15s,background .15s,border-color .15s;color:#091521;background:var(--lime)}.wa-button:hover{transform:translateY(-1px);background:#d7fa8f}.wa-button:focus-visible,.wa-tab:focus-visible{outline:2px solid var(--blue);outline-offset:3px}.wa-button.secondary{background:transparent;border-color:#405b78;color:#dce8f6}.wa-button.secondary:hover{background:#1a304a}.wa-button.danger{background:transparent;border-color:#72414a;color:#ffc2c2}.wa-button.danger:hover{background:#3c2028}.wa-button.small{min-height:30px;padding:0 9px;font-size:10px}.wa-feedback{font-size:11px;color:var(--lime);min-height:16px}.wa-divider{height:1px;background:var(--line);margin:23px 0}.wa-list-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.wa-list-title h3{font-size:12px;margin:0}.wa-list-title span{font:10px ui-monospace,monospace;color:var(--muted)}.wa-empty{border:1px dashed #3a526d;border-radius:10px;padding:22px 18px;text-align:center;color:var(--muted);background:#0b1826}.wa-empty-mark{margin:0 auto 11px;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:#17304a;color:var(--blue)}.wa-empty strong{display:block;color:#e9f2fc;font-size:12px;margin-bottom:5px}.wa-empty p{font-size:11px;line-height:1.55;margin:0 auto;max-width:300px}.wa-record{border:1px solid #2a415b;background:#0a1725;border-radius:9px;padding:13px 14px;margin-top:9px;animation:wa-in .22s ease both}.wa-record-top{display:flex;justify-content:space-between;gap:10px}.wa-record h4{font-size:13px;margin:0 0 4px}.wa-record-sub{font-size:10px;color:var(--muted)}.wa-record-actions{display:flex;gap:5px}.wa-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.wa-tag{padding:4px 7px;border-radius:4px;font-size:9px;color:#cfe4ff;background:#1a304a}.wa-record-meta{display:flex;flex-wrap:wrap;gap:11px;margin-top:10px;color:#9eb2ca;font-size:10px}.wa-record-meta span{display:inline-flex;align-items:center;gap:4px}.wa-tabs{display:flex;gap:5px;padding:4px;background:#091522;border:1px solid var(--line);border-radius:8px}.wa-tab{border:0;background:transparent;color:var(--muted);padding:7px 11px;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer}.wa-tab[aria-selected=true]{background:#213b58;color:#f3f8ff}.wa-match-list{display:flex;flex-direction:column;gap:13px}.wa-match-card{border:1px solid #2c4561;background:#0b1928;border-radius:10px;padding:15px}.wa-match-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.wa-match-head h3{font-size:13px;margin:0 0 4px}.wa-match-head p{font-size:10px;color:var(--muted);margin:0}.wa-score{color:var(--lime);font:700 17px ui-monospace,monospace}.wa-score small{display:block;color:#93a9c1;font:9px ui-monospace,monospace;text-align:right;text-transform:uppercase;letter-spacing:.08em}.wa-progress{height:4px;background:#1c3045;border-radius:10px;margin:13px 0;overflow:hidden}.wa-progress span{height:100%;display:block;background:linear-gradient(90deg,#62a9ff,var(--lime));border-radius:10px}.wa-reasons{display:grid;grid-template-columns:1fr 1fr;gap:7px}.wa-reason{display:flex;align-items:flex-start;gap:6px;color:#c5d5e8;font-size:10px;line-height:1.45}.wa-reason svg{color:var(--lime);flex:0 0 auto}.wa-reason.no svg{color:#e2a0a0}.wa-job-label{font:700 9px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);margin:0 0 7px}.wa-job-block{padding-bottom:11px;margin-bottom:11px;border-bottom:1px solid #20344a}.wa-job-block:last-child{border:0;margin:0;padding:0}.wa-disclaimer{font-size:10px;line-height:1.6;color:#8fa5be;margin-top:14px}.wa-bottom{display:flex;justify-content:space-between;align-items:center;gap:14px;padding-top:20px;margin-top:28px;border-top:1px solid var(--line);font:10px ui-monospace,monospace;color:#8297b0}.wa-storage{display:inline-flex;align-items:center;gap:6px;color:var(--lime)}.wa-error{color:#ffb5b5}.wa-skeleton{height:120px;border-radius:10px;background:linear-gradient(90deg,#102137,#1a2d43,#102137);background-size:200% 100%;animation:wa-shimmer 1.3s linear infinite}@keyframes wa-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}@keyframes wa-shimmer{to{background-position:-200% 0}}@media(max-width:950px){.wa-layout{grid-template-columns:1fr}.wa-hero{grid-template-columns:1fr;gap:20px}.wa-hero-aside{max-width:500px}}@media(max-width:600px){.workforce-page{padding:18px 14px 40px}.wa-topline{margin-bottom:28px}.wa-top-meta{font-size:9px}.wa-hero{margin-bottom:22px}.wa-stats{overflow-x:auto}.wa-stat{padding:14px 16px;min-width:125px}.wa-card-body{padding:16px}.wa-card-head{padding:15px 16px}.wa-form{grid-template-columns:1fr}.wa-field.full,.wa-form-actions{grid-column:auto}.wa-reasons{grid-template-columns:1fr}.wa-bottom{align-items:flex-start;flex-direction:column}.wa-button{min-height:42px}.wa-record-actions{flex-shrink:0}}
      `}</style>
      <div className="wa-shell">
        <header className="wa-topline">
          <div className="wa-brand"><span className="wa-mark"><HardHat size={19} /></span><span>KONSTRUKSIAI <span style={{ color: "#8ea4bf", fontWeight: 500 }}> / WORKFORCE LAB</span></span></div>
          <div className="wa-top-meta">Internal prototype · Jakarta pilot</div>
        </header>

        <section className="wa-hero">
          <div>
            <div className="wa-kicker">Ruang uji pencocokan tenaga kerja</div>
            <h1>Temukan kecocokan.<br /><span>Bukan janji penempatan.</span></h1>
            <p className="wa-lede">Buat profil tukang dan kebutuhan kerja uji, lalu lihat alasan kecocokan berbasis data yang Anda masukkan. Mulai dari Jakarta, untuk evaluasi internal.</p>
          </div>
          <aside className="wa-hero-aside">
            <strong>Ruang kerja privat</strong>
            Tidak terhubung ke lowongan aktif atau layanan rekrutmen. Data hanya tersimpan di browser ini dan dapat dilihat siapa pun yang memakai browser/perangkat yang sama. Gunakan nama alias, jangan masukkan identitas atau data pekerja nyata.
          </aside>
        </section>

        <div className="wa-notice" role="status" data-testid="status-prototype-disclosure">
          <ShieldAlert size={18} />
          <div><span className="wa-notice-tag">Internal only</span><strong>Ini bukan marketplace kerja dan bukan layanan verifikasi.</strong> Profil bersifat deklarasi mandiri. Tidak ada sertifikat yang diunggah atau diverifikasi, tidak ada informasi kontak, dan tidak ada penempatan nyata. Hapus data kapan saja dari browser ini.</div>
        </div>

        <section className="wa-stats" aria-label="Ringkasan workspace">
          <div className="wa-stat"><b data-testid="text-profile-count">{workers.length}</b><span>Profil uji</span></div>
          <div className="wa-stat"><b data-testid="text-job-count">{jobs.length}</b><span>Kebutuhan uji</span></div>
          <div className="wa-stat"><b data-testid="text-match-count">{matchCount}</b><span>Pasangan untuk ditinjau</span></div>
          <div className="wa-stat status"><span>Status sesi</span><b data-testid="status-storage">{storageError ? "Penyimpanan bermasalah" : ready ? "Tersimpan lokal" : "Memuat data…"}</b></div>
        </section>

        {storageError && <div className="wa-notice wa-error" role="alert" data-testid="status-storage-error"><AlertTriangle size={18} /><div>Penyimpanan browser tidak tersedia. Perubahan mungkin tidak bertahan setelah halaman ditutup.</div></div>}

        <div className="wa-layout">
          <section className="wa-card">
            <div className="wa-card-head">
              <div className="wa-card-title"><span className="wa-card-icon"><UserRound size={18} /></span><div><h2>Data uji Anda</h2><p>Kelola profil tukang dan kebutuhan kerja lokal</p></div></div>
              <div className="wa-tabs" role="tablist" aria-label="Jenis data">
                <button className="wa-tab" role="tab" aria-selected={activeTab === "profiles"} data-testid="tab-profiles" onClick={() => setActiveTab("profiles")}>Profil</button>
                <button className="wa-tab" role="tab" aria-selected={activeTab === "jobs"} data-testid="tab-jobs" onClick={() => setActiveTab("jobs")}>Kebutuhan</button>
              </div>
            </div>
            <div className="wa-card-body">
              {!ready ? <div className="wa-skeleton" data-testid="status-loading" /> : activeTab === "profiles" ? (
                <>
                  <form className="wa-form" onSubmit={submitWorker} data-testid="form-worker">
                    <Field label="Nama alias uji *" hint="Gunakan nama fiktif; jangan masukkan identitas pekerja nyata.">
                      <input className={inputClass} data-testid="input-worker-name" value={workerForm.name} onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })} placeholder="Contoh: Tukang Uji 01" required maxLength={80} />
                    </Field>
                    <Field label="Bidang kerja *">
                      <input className={inputClass} data-testid="input-worker-trade" value={workerForm.trade} onChange={(e) => setWorkerForm({ ...workerForm, trade: e.target.value })} placeholder="Contoh: Tukang batu" required maxLength={80} />
                    </Field>
                    <Field label="Keahlian *" hint="Pisahkan beberapa keahlian dengan koma. Deklarasi mandiri, tidak diverifikasi.">
                      <input className={inputClass} data-testid="input-worker-skills" value={workerForm.skills} onChange={(e) => setWorkerForm({ ...workerForm, skills: e.target.value })} placeholder="Pasang bata, plester, aci" required maxLength={240} />
                    </Field>
                    <Field label="Area kerja di Jakarta *">
                      <select className={inputClass} data-testid="select-worker-area" value={workerForm.area} onChange={(e) => setWorkerForm({ ...workerForm, area: e.target.value })}>{AREAS.map((area) => <option key={area}>{area}</option>)}</select>
                    </Field>
                    <Field label="Ketersediaan *">
                      <select className={inputClass} data-testid="select-worker-availability" value={workerForm.availability} onChange={(e) => setWorkerForm({ ...workerForm, availability: e.target.value as Availability })}>{Object.entries(AVAILABILITY_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
                    </Field>
                    <div className="wa-form-actions">
                      <button className="wa-button" type="submit" data-testid="button-save-worker">{editingWorker ? <><Check size={15} /> Simpan perubahan</> : <><Plus size={15} /> Simpan profil uji</>}</button>
                      {editingWorker && <button className="wa-button secondary" type="button" data-testid="button-cancel-worker-edit" onClick={() => { setEditingWorker(null); setWorkerForm({ name: "", trade: "", skills: "", area: AREAS[0], availability: "now" }); }}><X size={14} /> Batal</button>}
                      <span className="wa-feedback" role="status" data-testid="status-form-feedback">{notice}</span>
                    </div>
                  </form>
                  <div className="wa-divider" />
                  <div className="wa-list-title"><h3>Profil tukang tersimpan</h3><span>{workers.length} RECORD{workers.length === 1 ? "" : "S"}</span></div>
                  {!workers.length ? <div className="wa-empty" data-testid="empty-worker-list"><div className="wa-empty-mark"><UserRound size={18} /></div><strong>Belum ada profil uji</strong><p>Mulai dengan mengisi form di atas. Hanya data yang Anda tambahkan sendiri akan muncul di sini.</p></div> :
                    workers.map((worker) => <article className="wa-record" key={worker.id} data-testid={`card-worker-${worker.id}`}>
                      <div className="wa-record-top"><div><h4>{worker.name}</h4><div className="wa-record-sub">{worker.trade}</div></div><div className="wa-record-actions"><button className="wa-button secondary small" type="button" data-testid={`button-edit-worker-${worker.id}`} onClick={() => startEditWorker(worker)}>Edit</button><button className="wa-button danger small" type="button" aria-label={`Hapus profil ${worker.name}`} data-testid={`button-delete-worker-${worker.id}`} onClick={() => { if (window.confirm(`Hapus profil uji ${worker.name}?`)) { setWorkers((current) => current.filter((item) => item.id !== worker.id)); setNotice("Profil uji dihapus."); } }}><Trash2 size={13} /></button></div></div>
                      <div className="wa-tags">{worker.skills.map((skill) => <span className="wa-tag" key={skill}>{skill}</span>)}</div>
                      <div className="wa-record-meta"><span><MapPin size={12} />{worker.area}</span><span><ChevronRight size={12} />{AVAILABILITY_LABEL[worker.availability]}</span><span>Deklarasi mandiri · belum diverifikasi</span></div>
                    </article>)}
                </>
              ) : (
                <>
                  <form className="wa-form" onSubmit={submitJob} data-testid="form-job">
                    <Field label="Judul kebutuhan *">
                      <input className={inputClass} data-testid="input-job-title" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="Contoh: Tukang pasang keramik" required maxLength={100} />
                    </Field>
                    <Field label="Keahlian yang dibutuhkan *" hint="Pisahkan dengan koma; pencocokan hanya membaca daftar ini.">
                      <input className={inputClass} data-testid="input-job-skills" value={jobForm.skills} onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })} placeholder="Pasang keramik, potong keramik" required maxLength={240} />
                    </Field>
                    <Field label="Area kerja di Jakarta *">
                      <select className={inputClass} data-testid="select-job-area" value={jobForm.area} onChange={(e) => setJobForm({ ...jobForm, area: e.target.value })}>{AREAS.map((area) => <option key={area}>{area}</option>)}</select>
                    </Field>
                    <Field label="Ketersediaan yang dibutuhkan *">
                      <select className={inputClass} data-testid="select-job-availability" value={jobForm.availability} onChange={(e) => setJobForm({ ...jobForm, availability: e.target.value as Availability })}>{Object.entries(AVAILABILITY_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
                    </Field>
                    <div className="wa-form-actions">
                      <button className="wa-button" type="submit" data-testid="button-save-job">{editingJob ? <><Check size={15} /> Simpan perubahan</> : <><Plus size={15} /> Simpan kebutuhan uji</>}</button>
                      {editingJob && <button className="wa-button secondary" type="button" data-testid="button-cancel-job-edit" onClick={() => { setEditingJob(null); setJobForm({ title: "", skills: "", area: AREAS[0], availability: "now" }); }}><X size={14} /> Batal</button>}
                      <span className="wa-feedback" role="status" data-testid="status-job-feedback">{notice}</span>
                    </div>
                  </form>
                  <div className="wa-divider" />
                  <div className="wa-list-title"><h3>Kebutuhan kerja tersimpan</h3><span>{jobs.length} RECORD{jobs.length === 1 ? "" : "S"}</span></div>
                  {!jobs.length ? <div className="wa-empty" data-testid="empty-job-list"><div className="wa-empty-mark"><BriefcaseBusiness size={18} /></div><strong>Belum ada kebutuhan uji</strong><p>Beralih ke Profil untuk membuat profil tukang, lalu buat kebutuhan uji di sini.</p></div> :
                    jobs.map((job) => <article className="wa-record" key={job.id} data-testid={`card-job-${job.id}`}>
                      <div className="wa-record-top"><div><h4>{job.title}</h4><div className="wa-record-sub">{job.skills.join(" · ")}</div></div><div className="wa-record-actions"><button className="wa-button secondary small" type="button" data-testid={`button-edit-job-${job.id}`} onClick={() => startEditJob(job)}>Edit</button><button className="wa-button danger small" type="button" aria-label={`Hapus kebutuhan ${job.title}`} data-testid={`button-delete-job-${job.id}`} onClick={() => { if (window.confirm(`Hapus kebutuhan uji ${job.title}?`)) { setJobs((current) => current.filter((item) => item.id !== job.id)); setNotice("Kebutuhan uji dihapus."); } }}><Trash2 size={13} /></button></div></div>
                      <div className="wa-record-meta"><span><MapPin size={12} />{job.area}</span><span><ChevronRight size={12} />Butuh: {AVAILABILITY_LABEL[job.availability]}</span></div>
                    </article>)}
                </>
              )}
            </div>
          </section>

          <section className="wa-card">
            <div className="wa-card-head">
              <div className="wa-card-title"><span className="wa-card-icon"><CircleHelp size={18} /></span><div><h2>Penjelasan kecocokan</h2><p>Aturan sederhana, bukan rekomendasi penempatan</p></div></div>
              <span className="wa-top-meta">RULESET 01</span>
            </div>
            <div className="wa-card-body">
              {!ready ? <div className="wa-skeleton" data-testid="status-match-loading" /> : !jobs.length || !workers.length ? (
                <div className="wa-empty" data-testid="empty-matches"><div className="wa-empty-mark"><ArrowRight size={18} /></div><strong>Belum ada kecocokan untuk ditinjau</strong><p>Langkah 1: tambahkan profil deklarasi mandiri. Langkah 2: buat kebutuhan uji. Hasil akan muncul saat keduanya tersedia.</p></div>
              ) : (
                <div className="wa-match-list" data-testid="list-matches">
                  {jobs.map((job) => {
                    const ranked = workers.map((worker) => ({ worker, result: scoreMatch(worker, job) })).sort((a, b) => b.result.score - a.result.score);
                    return <div className="wa-job-block" key={job.id}>
                      <div className="wa-job-label">Kebutuhan uji · {job.area}</div>
                      <div className="wa-match-list">
                        {ranked.map(({ worker, result }) => <article className="wa-match-card" key={`${job.id}-${worker.id}`} data-testid={`match-${job.id}-${worker.id}`}>
                          <div className="wa-match-head">
                            <div><h3>{worker.name} <span style={{ color: "#9eb2ca", fontWeight: 450 }}>· {worker.trade}</span></h3><p>{job.title}</p></div>
                            <div className="wa-score" data-testid={`text-match-score-${job.id}-${worker.id}`}>{result.score}<small>indikator</small></div>
                          </div>
                          <div className="wa-progress" aria-label={`Skor aturan ${result.score}`}><span style={{ width: `${result.score}%` }} /></div>
                          <div className="wa-reasons">
                            <div className={`wa-reason ${result.skills.length ? "" : "no"}`}>{result.skills.length ? <Check size={13} /> : <X size={13} />}Keahlian cocok: {result.skills.length ? result.skills.join(", ") : "tidak ada"}</div>
                            <div className={`wa-reason ${result.area ? "" : "no"}`}>{result.area ? <Check size={13} /> : <X size={13} />}Area {result.area ? "sama" : "berbeda"}: {worker.area} / {job.area}</div>
                            <div className={`wa-reason ${result.available ? "" : "no"}`}>{result.available ? <Check size={13} /> : <X size={13} />}Ketersediaan {result.available ? "sesuai" : "belum sesuai"}: {AVAILABILITY_LABEL[worker.availability]}</div>
                          </div>
                          <p className="wa-disclaimer">Indikator ini hanya menghitung keahlian yang tertulis, area Jakarta, dan ketersediaan. Bukan pemeriksaan kompetensi, sertifikasi, atau hasil penempatan.</p>
                        </article>)}
                      </div>
                    </div>;
                  })}
                </div>
              )}
              <div className="wa-divider" />
              <div className="wa-notice" style={{ margin: 0 }} data-testid="status-match-method"><CircleHelp size={17} /><div><strong>Cara membaca angka:</strong> skill 60%, area yang sama 25%, ketersediaan sesuai 15%. Setiap indikator dapat diperiksa di bawah skor. Angka bukan probabilitas keberhasilan.</div></div>
            </div>
          </section>
        </div>

        <footer className="wa-bottom">
          <span><span className={`wa-storage ${storageError ? "wa-error" : ""}`}><span aria-hidden="true">●</span>{storageError ? "Browser storage error" : "Local browser storage"}</span> · Data uji tidak dikirim ke server.</span>
          <button className="wa-button danger small" type="button" onClick={clearLocalRecords} data-testid="button-clear-local-data" disabled={!workers.length && !jobs.length}><RotateCcw size={13} /> Hapus semua data lokal</button>
        </footer>
      </div>
    </main>
  );
}
