import React, { useState } from 'react';
import { LogOut, Plus, Edit, Trash2, X, AlertTriangle, Activity, Users, Pill, Calendar } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);

  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { username: 'dokter', password: 'dokter123', role: 'dokter', name: 'Dr. Sarah' },
    { username: 'apoteker', password: 'apoteker123', role: 'apoteker', name: 'Apt. John' }
  ];

  const [patients, setPatients] = useState([{ id: 'P001', name: 'Budi Santoso', nik: '717101234567', contact: '08123456', allergy: 'Penisilin' }]);
  const [visits, setVisits] = useState([{ id: 'V001', patientId: 'P001', patientName: 'Budi Santoso', date: '2025-11-12', queue: 'A001', status: 'Menunggu', complaint: 'Demam', diagnosis: '' }]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [drugs, setDrugs] = useState([
    { id: 'D001', name: 'Paracetamol 500mg', stock: 100, price: 5000, expiry: '2026-12-31' },
    { id: 'D002', name: 'Amoxicillin 500mg', stock: 8, price: 15000, expiry: '2025-12-15' },
    { id: 'D003', name: 'Vitamin C 1000mg', stock: 200, price: 3000, expiry: '2027-03-20' }
  ]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [schedules, setSchedules] = useState([
    { id: 'S001', doctor: 'Dr. Sarah', day: 'Senin', start: '08:00', end: '12:00', room: 'R1' },
    { id: 'S002', doctor: 'Dr. Sarah', day: 'Rabu', start: '13:00', end: '17:00', room: 'R1' }
  ]);
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = (act: string, det: string) => setLogs(l => [{ id: l.length + 1, time: new Date().toLocaleString('id-ID'), user: currentUser?.name, act, det }, ...l]);
  const lowStock = drugs.filter(d => d.stock < 10);
  const expired = drugs.filter(d => new Date(d.expiry) < new Date());

  const doLogin = () => {
    const u = users.find(x => x.username === username && x.password === password);
    if (u) { setCurrentUser(u); setIsLoggedIn(true); } else alert('Login gagal!');
  };

  const closeModal = () => { setShowModal(false); setEditingItem(null); };

  const savePatient = (d: any) => {
    if (editingItem) setPatients(p => p.map(x => x.id === editingItem.id ? { ...d, id: editingItem.id } : x));
    else setPatients(p => [...p, { ...d, id: 'P' + String(p.length + 1).padStart(3, '0') }]);
    addLog('Patient', d.name); closeModal();
  };

  const saveVisit = (d: any) => {
    setVisits(v => [...v, { ...d, id: 'V' + String(v.length + 1).padStart(3, '0'), queue: 'A' + String(v.length + 1).padStart(3, '0'), status: 'Menunggu', diagnosis: '' }]);
    addLog('Visit', d.patientName); closeModal();
  };

  const saveDrug = (d: any) => {
    if (editingItem) setDrugs(dr => dr.map(x => x.id === editingItem.id ? { ...d, id: editingItem.id } : x));
    else setDrugs(dr => [...dr, { ...d, id: 'D' + String(dr.length + 1).padStart(3, '0') }]);
    addLog('Drug', d.name); closeModal();
  };

  const saveSchedule = (d: any) => {
    if (editingItem) setSchedules(s => s.map(x => x.id === editingItem.id ? { ...d, id: editingItem.id } : x));
    else setSchedules(s => [...s, { ...d, id: 'S' + String(s.length + 1).padStart(3, '0') }]);
    addLog('Schedule', d.doctor); closeModal();
  };

  const saveRx = (d: any) => {
    setPrescriptions(p => [...p, { ...d, id: 'PR' + String(p.length + 1).padStart(3, '0'), status: 'Pending' }]);
    setVisits(v => v.map(x => x.id === d.visitId ? { ...x, status: 'Selesai Periksa' } : x));
    addLog('Prescription', d.visitId); closeModal();
  };

  const dispense = (pr: any) => {
    pr.items.forEach((i: any) => setDrugs(d => d.map(x => x.id === i.drugId ? { ...x, stock: x.stock - i.qty } : x)));
    setPrescriptions(p => p.map(x => x.id === pr.id ? { ...x, status: 'Selesai' } : x));
    const tot = pr.items.reduce((s: number, i: any) => s + (drugs.find(d => d.id === i.drugId)?.price || 0) * i.qty, 0) + 50000;
    setTransactions(t => [...t, { id: t.length + 1, amount: tot }]);
    addLog('Dispense', pr.id); alert('Total: Rp ' + tot.toLocaleString('id-ID'));
  };

  const pay = (vid: string) => {
    setTransactions(t => [...t, { id: t.length + 1, amount: 50000 }]);
    setVisits(v => v.map(x => x.id === vid ? { ...x, status: 'Lunas' } : x));
    addLog('Payment', vid); alert('Berhasil!');
  };

  const del = (id: string, type: string) => {
    if (!confirm('Hapus?')) return;
    if (type === 'patient') setPatients(p => p.filter(x => x.id !== id));
    if (type === 'drug') setDrugs(d => d.filter(x => x.id !== id));
    if (type === 'schedule') setSchedules(s => s.filter(x => x.id !== id));
    addLog('Delete', id);
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="glass-card rounded-2xl p-8 w-full max-w-md backdrop-blur-xl animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/20 neon-glow-strong mb-4">
            <Activity className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Klinik Sentosa</h1>
          <p className="text-muted-foreground text-sm">Sistem Manajemen Klinik Digital</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative group">
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground group-hover:border-primary/50"
            />
          </div>
          
          <div className="relative group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && doLogin()}
              className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground group-hover:border-primary/50"
            />
          </div>
          
          <button
            onClick={doLogin}
            className="w-full bg-gradient-to-r from-primary to-neon-green/80 text-primary-foreground p-3 rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground text-center mb-2 font-medium">Akun Demo:</p>
          <div className="space-y-1 text-xs text-foreground/70">
            <p className="font-mono">admin / admin123</p>
            <p className="font-mono">dokter / dokter123</p>
            <p className="font-mono">apoteker / apoteker123</p>
          </div>
        </div>
      </div>
    </div>
  );

  const Btn = ({ m, l, icon: Icon }: any) => (
    <button
      onClick={() => setActiveMenu(m)}
      className={`w-full text-left p-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
        activeMenu === m
          ? 'bg-primary/20 text-primary border border-primary/50 neon-glow'
          : 'text-foreground/70 hover:bg-muted/30 hover:text-foreground border border-transparent'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm">{l}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-cyber-bg text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-neon-dark to-secondary/50 text-foreground p-4 flex justify-between items-center backdrop-blur-sm border-b border-primary/30 neon-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-lg">Klinik Sentosa</span>
            <p className="text-xs text-muted-foreground">{currentUser.name} • {currentUser.role}</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all duration-300 hover:neon-glow border border-destructive/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 glass-sidebar min-h-screen p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu Utama</h3>
          </div>
          
          <Btn m="dashboard" l="Dashboard" icon={Activity} />
          
          {currentUser.role === 'admin' && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administrasi</h3>
              </div>
              <Btn m="patients" l="Pasien" icon={Users} />
              <Btn m="visits" l="Pendaftaran" icon={Calendar} />
              <Btn m="payment" l="Pembayaran" icon={Activity} />
              <Btn m="history" l="Rekam Medis" icon={Activity} />
              <Btn m="schedules" l="Jadwal" icon={Calendar} />
              <Btn m="reports" l="Laporan" icon={Activity} />
              <Btn m="audit" l="Audit Log" icon={Activity} />
            </>
          )}
          
          {currentUser.role === 'dokter' && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dokter</h3>
              </div>
              <Btn m="exam" l="Pemeriksaan" icon={Activity} />
              <Btn m="rx" l="Resep" icon={Pill} />
              <Btn m="mysch" l="Jadwal Saya" icon={Calendar} />
            </>
          )}
          
          {currentUser.role === 'apoteker' && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Farmasi</h3>
              </div>
              <Btn m="apotek" l="Apotek" icon={Pill} />
              <Btn m="drugs" l="Data Obat" icon={Pill} />
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {activeMenu === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card t="Total Pasien" v={patients.length} icon={Users} />
                  <Card t="Kunjungan Hari Ini" v={visits.length} icon={Calendar} />
                  <Card t="Stok Rendah" v={lowStock.length} c="text-destructive" icon={AlertTriangle} variant="warning" />
                </div>
              </div>
            )}
            
            {activeMenu === 'patients' && (
              <TablePage
                title="Data Pasien"
                data={patients}
                cols={['id', 'name', 'nik']}
                onAdd={() => { setModalType('patient'); setEditingItem(null); setShowModal(true); }}
                onEdit={p => { setEditingItem(p); setModalType('patient'); setShowModal(true); }}
                onDel={id => del(id, 'patient')}
              />
            )}
            
            {activeMenu === 'visits' && (
              <TablePage
                title="Pendaftaran Kunjungan"
                data={visits}
                cols={['queue', 'patientName', 'complaint', 'status']}
                onAdd={() => { setModalType('visit'); setShowModal(true); }}
                onEdit={undefined}
                onDel={undefined}
              />
            )}
            
            {activeMenu === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Pembayaran</h2>
                <div className="glass-card rounded-xl p-4 space-y-3">
                  {visits.filter(v => v.status === 'Selesai Periksa').map(v => (
                    <div key={v.id} className="flex justify-between items-center bg-muted/30 border border-border/50 p-4 rounded-lg hover:border-primary/50 transition-all">
                      <div>
                        <p className="font-semibold text-foreground">{v.patientName}</p>
                        <p className="text-xs text-muted-foreground">Queue: {v.queue}</p>
                      </div>
                      <button
                        onClick={() => pay(v.id)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:neon-glow-strong transition-all duration-300 hover:scale-105"
                      >
                        Bayar
                      </button>
                    </div>
                  ))}
                  {visits.filter(v => v.status === 'Selesai Periksa').length === 0 && (
                    <p className="text-muted-foreground text-center py-8">Tidak ada pembayaran pending</p>
                  )}
                </div>
              </div>
            )}
            
            {activeMenu === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Rekam Medis</h2>
                <div className="space-y-4">
                  {patients.map(p => (
                    <div key={p.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{p.name}</h3>
                          <p className="text-sm text-muted-foreground">NIK: {p.nik}</p>
                        </div>
                        <span className="px-3 py-1 bg-destructive/20 text-destructive rounded-lg text-xs font-medium border border-destructive/30">
                          Alergi: {p.allergy || '-'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {visits.filter(v => v.patientId === p.id).map(v => (
                          <div key={v.id} className="bg-muted/30 p-3 rounded-lg border border-border/50 text-xs">
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">{v.date}</span>
                              <span className="text-primary font-medium">{v.status}</span>
                            </div>
                            <p className="text-foreground"><strong>Keluhan:</strong> {v.complaint}</p>
                            {v.diagnosis && <p className="text-foreground mt-1"><strong>Diagnosis:</strong> {v.diagnosis}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeMenu === 'schedules' && (
              <TablePage
                title="Jadwal Dokter"
                data={schedules}
                cols={['doctor', 'day', 'start', 'end', 'room']}
                onAdd={() => { setModalType('schedule'); setEditingItem(null); setShowModal(true); }}
                onEdit={s => { setEditingItem(s); setModalType('schedule'); setShowModal(true); }}
                onDel={id => del(id, 'schedule')}
              />
            )}
            
            {activeMenu === 'mysch' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Jadwal Saya</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedules.filter(s => s.doctor === currentUser.name).map(s => (
                    <div key={s.id} className="glass-card rounded-xl p-4 hover:neon-glow transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{s.day}</h3>
                          <p className="text-xs text-muted-foreground">Ruangan {s.room}</p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-primary">{s.start} - {s.end}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeMenu === 'reports' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Laporan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      <h3 className="font-semibold text-foreground">Stok Rendah</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{lowStock.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">Obat perlu restock</p>
                  </div>
                  
                  <div className="glass-card rounded-xl p-6 border-l-4 border-destructive">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                      <h3 className="font-semibold text-foreground">Kadaluarsa</h3>
                    </div>
                    <p className="text-3xl font-bold text-destructive">{expired.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">Obat kadaluarsa</p>
                  </div>
                  
                  <div className="glass-card rounded-xl p-6 border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-foreground">Pendapatan</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      Rp {transactions.reduce((s, t) => s + t.amount, 0).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Total transaksi</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeMenu === 'audit' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Audit Log</h2>
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="p-4 text-left font-semibold text-foreground">Waktu</th>
                        <th className="p-4 text-left font-semibold text-foreground">User</th>
                        <th className="p-4 text-left font-semibold text-foreground">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-muted-foreground">
                            Belum ada aktivitas
                          </td>
                        </tr>
                      ) : (
                        logs.map(l => (
                          <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="p-4 text-foreground">{l.time}</td>
                            <td className="p-4 text-foreground">{l.user}</td>
                            <td className="p-4 text-foreground">
                              <span className="text-primary font-medium">{l.act}:</span> {l.det}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeMenu === 'exam' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Pemeriksaan Pasien</h2>
                <div className="space-y-4">
                  {visits.filter(v => v.status === 'Menunggu').map(v => (
                    <ExamCard key={v.id} v={v} onSave={d => { 
                      setVisits(vs => vs.map(x => x.id === v.id ? { ...x, diagnosis: d, status: 'Dalam Pemeriksaan' } : x)); 
                      addLog('Exam', v.id); 
                    }} />
                  ))}
                  {visits.filter(v => v.status === 'Menunggu').length === 0 && (
                    <div className="glass-card rounded-xl p-8 text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Tidak ada pasien menunggu</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeMenu === 'rx' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Resep</h2>
                  <button
                    onClick={() => { setModalType('rx'); setShowModal(true); }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:neon-glow-strong transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Resep
                  </button>
                </div>
                <div className="space-y-3">
                  {prescriptions.map(p => (
                    <div key={p.id} className="glass-card rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{p.id}</p>
                        <p className="text-xs text-muted-foreground">Status: {p.status}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        p.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-primary/20 text-primary border border-primary/30'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <div className="glass-card rounded-xl p-8 text-center">
                      <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Belum ada resep</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeMenu === 'apotek' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Apotek - Penyerahan Obat</h2>
                <div className="space-y-4">
                  {prescriptions.filter(p => p.status === 'Pending').map(p => (
                    <div key={p.id} className="glass-card rounded-xl p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground mb-3">{p.id}</p>
                        <div className="space-y-2">
                          {p.items?.map((i: any, x: number) => (
                            <div key={x} className="text-sm bg-muted/30 p-2 rounded-lg border border-border/50">
                              <span className="text-foreground font-medium">{drugs.find(d => d.id === i.drugId)?.name}</span>
                              <span className="text-primary ml-2">× {i.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => dispense(p)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:neon-glow-strong transition-all duration-300 hover:scale-105 ml-4"
                      >
                        Serahkan
                      </button>
                    </div>
                  ))}
                  {prescriptions.filter(p => p.status === 'Pending').length === 0 && (
                    <div className="glass-card rounded-xl p-8 text-center">
                      <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Tidak ada resep pending</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeMenu === 'drugs' && (
              <TablePage
                title="Data Obat"
                data={drugs}
                cols={['name', 'stock', 'price', 'expiry']}
                onAdd={() => { setModalType('drug'); setEditingItem(null); setShowModal(true); }}
                onEdit={d => { setEditingItem(d); setModalType('drug'); setShowModal(true); }}
                onDel={id => del(id, 'drug')}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          type={modalType}
          item={editingItem}
          patients={patients}
          visits={visits}
          drugs={drugs}
          onClose={closeModal}
          onSave={{ patient: savePatient, visit: saveVisit, drug: saveDrug, schedule: saveSchedule, rx: saveRx }}
        />
      )}
    </div>
  );
}

const Card = ({ t, v, c, icon: Icon, variant }: any) => (
  <div className={`glass-card rounded-xl p-6 transition-all duration-300 hover:neon-glow hover:scale-105 ${variant === 'warning' ? 'border-l-4 border-destructive' : 'border-l-4 border-primary'}`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-muted-foreground font-medium">{t}</p>
      {Icon && <Icon className={`w-6 h-6 ${c || 'text-primary'}`} />}
    </div>
    <p className={`text-4xl font-bold ${c || 'text-foreground'}`}>{v}</p>
  </div>
);

const TablePage = ({ title, data, cols, onAdd, onEdit, onDel }: any) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:neon-glow-strong transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      )}
    </div>
    <div className="glass-card rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {cols.map((c: string) => (
              <th key={c} className="p-4 text-left font-semibold text-foreground capitalize">
                {c}
              </th>
            ))}
            {onEdit && <th className="p-4 text-center font-semibold text-foreground">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d: any) => (
            <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              {cols.map((c: string) => (
                <td key={c} className="p-4 text-foreground">
                  {typeof d[c] === 'number' && c === 'price'
                    ? 'Rp ' + d[c].toLocaleString('id-ID')
                    : d[c]}
                </td>
              ))}
              {onEdit && (
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(d)}
                      className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDel(d.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ExamCard = ({ v, onSave }: any) => {
  const [d, setD] = useState('');
  return (
    <div className="glass-card rounded-xl p-4 hover:neon-glow transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-foreground">{v.queue} - {v.patientName}</p>
          <p className="text-sm text-muted-foreground">Keluhan: {v.complaint}</p>
        </div>
        <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-xs font-medium border border-primary/30">
          {v.status}
        </span>
      </div>
      <input
        placeholder="Masukkan diagnosis..."
        value={d}
        onChange={e => setD(e.target.value)}
        className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
      />
      <button
        onClick={() => onSave(d)}
        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:neon-glow-strong transition-all duration-300 hover:scale-[1.02]"
      >
        Simpan Diagnosis
      </button>
    </div>
  );
};

const Modal = ({ type, item, patients, visits, drugs, onClose, onSave }: any) => {
  const [f, setF] = useState(item || {});
  const [items, setItems] = useState([{ drugId: '', qty: 1 }]);
  const set = (k: string, v: any) => setF({ ...f, [k]: v });

  const submit = () => {
    if (type === 'patient') onSave.patient(f);
    else if (type === 'visit') onSave.visit(f);
    else if (type === 'drug') onSave.drug({ ...f, stock: Number(f.stock), price: Number(f.price) });
    else if (type === 'schedule') onSave.schedule(f);
    else if (type === 'rx') onSave.rx({ visitId: f.visitId, items });
  };

  const addItem = () => setItems([...items, { drugId: '', qty: 1 }]);
  const updateItem = (i: number, k: string, v: any) => setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground capitalize">{type}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {type === 'patient' && (
            <>
              <input placeholder="Nama Lengkap" value={f.name || ''} onChange={e => set('name', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input placeholder="NIK" value={f.nik || ''} onChange={e => set('nik', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input placeholder="Kontak" value={f.contact || ''} onChange={e => set('contact', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input placeholder="Alergi (opsional)" value={f.allergy || ''} onChange={e => set('allergy', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
            </>
          )}

          {type === 'visit' && (
            <>
              <select value={f.patientId || ''} onChange={e => { set('patientId', e.target.value); set('patientName', patients.find((p: any) => p.id === e.target.value)?.name || ''); }} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <option value="">Pilih Pasien</option>
                {patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="date" value={f.date || ''} onChange={e => set('date', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              <input placeholder="Keluhan" value={f.complaint || ''} onChange={e => set('complaint', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
            </>
          )}

          {type === 'drug' && (
            <>
              <input placeholder="Nama Obat" value={f.name || ''} onChange={e => set('name', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input type="number" placeholder="Stok" value={f.stock || ''} onChange={e => set('stock', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input type="number" placeholder="Harga" value={f.price || ''} onChange={e => set('price', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <input type="date" placeholder="Kadaluarsa" value={f.expiry || ''} onChange={e => set('expiry', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
            </>
          )}

          {type === 'schedule' && (
            <>
              <input placeholder="Nama Dokter" value={f.doctor || ''} onChange={e => set('doctor', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
              <select value={f.day || ''} onChange={e => set('day', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <option value="">Pilih Hari</option>
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="time" placeholder="Jam Mulai" value={f.start || ''} onChange={e => set('start', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              <input type="time" placeholder="Jam Selesai" value={f.end || ''} onChange={e => set('end', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              <input placeholder="Ruangan" value={f.room || ''} onChange={e => set('room', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground" />
            </>
          )}

          {type === 'rx' && (
            <>
              <select value={f.visitId || ''} onChange={e => set('visitId', e.target.value)} className="w-full bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <option value="">Pilih Kunjungan</option>
                {visits.filter((v: any) => v.status === 'Dalam Pemeriksaan').map((v: any) => <option key={v.id} value={v.id}>{v.queue} - {v.patientName}</option>)}
              </select>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Obat</label>
                {items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <select value={it.drugId} onChange={e => updateItem(i, 'drugId', e.target.value)} className="flex-1 bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                      <option value="">Pilih Obat</option>
                      {drugs.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input type="number" min="1" value={it.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} className="w-20 bg-input/50 border border-border text-foreground p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                  </div>
                ))}
                <button onClick={addItem} className="w-full bg-muted/30 text-foreground px-4 py-2 rounded-xl font-medium hover:bg-muted/50 transition-all flex items-center justify-center gap-2 border border-border/50">
                  <Plus className="w-4 h-4" />
                  Tambah Obat
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={submit}
          className="w-full mt-6 bg-gradient-to-r from-primary to-neon-green/80 text-primary-foreground p-3 rounded-xl font-semibold hover:neon-glow-strong transition-all duration-300 hover:scale-[1.02]"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};
