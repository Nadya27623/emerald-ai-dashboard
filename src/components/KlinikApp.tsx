import React, { useState } from 'react';
import { User, Calendar, Pill, MessageSquare, LogOut, Users, ClipboardList, Activity, FileText, Plus, Edit, Trash2, Search, Save, X, DollarSign } from 'lucide-react';

const KlinikSentosaSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { username: 'dokter', password: 'dokter123', role: 'dokter', name: 'Dr. Sarah' },
    { username: 'apoteker', password: 'apoteker123', role: 'apoteker', name: 'Apt. John' }
  ];

  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'Budi Santoso',
      nik: '7171012345678901',
      dob: '1985-05-15',
      gender: 'Laki-laki',
      address: 'Jl. Merdeka No. 10, Manado',
      contact: '081234567890',
      allergy: 'Penisilin',
      medicalHistory: 'Hipertensi'
    }
  ]);

  const [visits, setVisits] = useState([
    {
      id: 'V001',
      patientId: 'P001',
      patientName: 'Budi Santoso',
      visitDate: '2025-11-12',
      queueNo: 'A001',
      status: 'Menunggu',
      complaint: 'Demam dan batuk',
      diagnosis: '',
      notes: ''
    }
  ]);

  const [prescriptions, setPrescriptions] = useState([]);

  const [drugs, setDrugs] = useState([
    { id: 'D001', name: 'Paracetamol 500mg', stock: 100, unitPrice: 5000, expiryDate: '2026-12-31' },
    { id: 'D002', name: 'Amoxicillin 500mg', stock: 50, unitPrice: 15000, expiryDate: '2026-10-15' },
    { id: 'D003', name: 'Vitamin C 1000mg', stock: 200, unitPrice: 3000, expiryDate: '2027-03-20' }
  ]);

  const [complaints, setComplaints] = useState([
    {
      id: 'C001',
      patientId: 'P001',
      patientName: 'Budi Santoso',
      content: 'Pelayanan sangat baik dan ramah',
      status: 'Baru',
      response: '',
      date: '2025-11-10'
    }
  ]);

  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const doLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError('');
      setActiveMenu('dashboard');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveMenu('dashboard');
  };

  const handlePatientSubmit = (formData) => {
    if (editingItem) {
      setPatients(prev => prev.map(p => p.id === editingItem.id ? { ...formData, id: editingItem.id } : p));
      alert('Data pasien berhasil diupdate!');
    } else {
      const newId = 'P' + String(patients.length + 1).padStart(3, '0');
      setPatients(prev => [...prev, { ...formData, id: newId }]);
      alert('Pasien baru berhasil ditambahkan dengan ID: ' + newId);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleVisitSubmit = (formData) => {
    if (editingItem) {
      setVisits(prev => prev.map(v => v.id === editingItem.id ? { ...formData, id: editingItem.id } : v));
      alert('Data kunjungan berhasil diupdate!');
    } else {
      const newId = 'V' + String(visits.length + 1).padStart(3, '0');
      const queueNo = 'A' + String(visits.filter(v => v.visitDate === formData.visitDate).length + 1).padStart(3, '0');
      setVisits(prev => [...prev, { ...formData, id: newId, queueNo, status: 'Menunggu' }]);
      alert('Pasien berhasil didaftarkan! No. Antrian: ' + queueNo);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handlePrescriptionSubmit = (formData) => {
    const newId = 'PR' + String(prescriptions.length + 1).padStart(3, '0');
    setPrescriptions(prev => [...prev, { ...formData, id: newId, date: new Date().toISOString().split('T')[0], status: 'Pending' }]);
    setVisits(prev => prev.map(v => v.id === formData.visitId ? { ...v, status: 'Selesai Periksa' } : v));
    alert('Resep berhasil dibuat dengan ID: ' + newId);
    setShowModal(false);
  };

  const handleDrugSubmit = (formData) => {
    if (editingItem) {
      setDrugs(prev => prev.map(d => d.id === editingItem.id ? { ...formData, id: editingItem.id } : d));
      alert('Data obat berhasil diupdate!');
    } else {
      const newId = 'D' + String(drugs.length + 1).padStart(3, '0');
      setDrugs(prev => [...prev, { ...formData, id: newId }]);
      alert('Obat baru berhasil ditambahkan dengan ID: ' + newId);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDispenseDrug = (prescription) => {
    let canDispense = true;
    
    prescription.items.forEach(item => {
      const drug = drugs.find(d => d.id === item.drugId);
      if (!drug || drug.stock < item.quantity) {
        canDispense = false;
        alert(`Stok ${drug?.name || 'obat'} tidak mencukupi!`);
      }
    });

    if (!canDispense) return;

    prescription.items.forEach(item => {
      setDrugs(prev => prev.map(d => 
        d.id === item.drugId ? { ...d, stock: d.stock - item.quantity } : d
      ));
    });

    setPrescriptions(prev => prev.map(p => 
      p.id === prescription.id ? { ...p, status: 'Diserahkan' } : p
    ));

    const totalAmount = prescription.items.reduce((sum, item) => {
      const drug = drugs.find(d => d.id === item.drugId);
      return sum + (drug.unitPrice * item.quantity);
    }, 0) + 50000;

    const newTransaction = {
      id: 'T' + String(transactions.length + 1).padStart(3, '0'),
      visitId: prescription.visitId,
      amount: totalAmount,
      paymentMethod: 'Tunai',
      timestamp: new Date().toLocaleString('id-ID'),
      cashier: currentUser.name
    };

    setTransactions(prev => [...prev, newTransaction]);
    alert('Obat berhasil diserahkan dan transaksi dicatat!\nTotal: Rp ' + totalAmount.toLocaleString('id-ID'));
  };

  const handlePayment = (visitId, amount, method) => {
    const newTransaction = {
      id: 'T' + String(transactions.length + 1).padStart(3, '0'),
      visitId: visitId,
      amount: amount,
      paymentMethod: method,
      timestamp: new Date().toLocaleString('id-ID'),
      cashier: currentUser.name
    };

    setTransactions(prev => [...prev, newTransaction]);
    setVisits(prev => prev.map(v => 
      v.id === visitId ? { ...v, status: 'Selesai & Lunas' } : v
    ));
    alert('Pembayaran berhasil!\nTotal: Rp ' + amount.toLocaleString('id-ID'));
  };

  const handleComplaintResponse = (complaintId, response) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { ...c, response, status: 'Diproses' } : c
    ));
    alert('Tanggapan berhasil dikirim!');
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      if (type === 'patient') setPatients(prev => prev.filter(p => p.id !== id));
      if (type === 'drug') setDrugs(prev => prev.filter(d => d.id !== id));
      alert('Data berhasil dihapus!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Klinik Sentosa</h1>
            <p className="text-gray-600 mt-2">Sistem Informasi Klinik</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && doLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && doLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              onClick={doLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-2">Akun Demo:</p>
              <p className="text-xs text-gray-600">Admin: admin / admin123</p>
              <p className="text-xs text-gray-600">Dokter: dokter / dokter123</p>
              <p className="text-xs text-gray-600">Apoteker: apoteker / apoteker123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Klinik Sentosa</h1>
                <p className="text-sm text-blue-100">Sistem Informasi Klinik</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-blue-100 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeMenu === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  Dashboard
                </button>

                {currentUser.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveMenu('patients')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'patients' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      Data Pasien
                    </button>
                    <button
                      onClick={() => setActiveMenu('registration')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'registration' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ClipboardList className="w-5 h-5" />
                      Pendaftaran
                    </button>
                    <button
                      onClick={() => setActiveMenu('payment')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'payment' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      Pembayaran
                    </button>
                    <button
                      onClick={() => setActiveMenu('complaints')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'complaints' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Keluhan & Saran
                    </button>
                  </>
                )}

                {currentUser.role === 'dokter' && (
                  <>
                    <button
                      onClick={() => setActiveMenu('examination')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'examination' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Pemeriksaan
                    </button>
                    <button
                      onClick={() => setActiveMenu('prescriptions')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'prescriptions' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Resep Obat
                    </button>
                  </>
                )}

                {currentUser.role === 'apoteker' && (
                  <>
                    <button
                      onClick={() => setActiveMenu('pharmacy')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'pharmacy' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                      Apotek
                    </button>
                    <button
                      onClick={() => setActiveMenu('drugs')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeMenu === 'drugs' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                      Data Obat
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>

          <div className="col-span-9">
            {activeMenu === 'dashboard' && (
              <Dashboard 
                role={currentUser.role} 
                visits={visits} 
                patients={patients} 
                prescriptions={prescriptions} 
                complaints={complaints} 
                drugs={drugs} 
                transactions={transactions}
              />
            )}
            {activeMenu === 'patients' && (
              <PatientsPage 
                patients={patients} 
                setShowModal={setShowModal} 
                setModalType={setModalType} 
                setEditingItem={setEditingItem} 
                handleDelete={handleDelete} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
              />
            )}
            {activeMenu === 'registration' && (
              <RegistrationPage 
                visits={visits} 
                patients={patients} 
                setShowModal={setShowModal} 
                setModalType={setModalType} 
                setEditingItem={setEditingItem} 
              />
            )}
            {activeMenu === 'payment' && (
              <PaymentPage 
                visits={visits}
                transactions={transactions}
                handlePayment={handlePayment}
              />
            )}
            {activeMenu === 'examination' && (
              <ExaminationPage 
                visits={visits} 
                setVisits={setVisits} 
                patients={patients} 
              />
            )}
            {activeMenu === 'prescriptions' && (
              <PrescriptionsPage 
                visits={visits} 
                drugs={drugs} 
                setShowModal={setShowModal} 
                setModalType={setModalType} 
                prescriptions={prescriptions} 
              />
            )}
            {activeMenu === 'pharmacy' && (
              <PharmacyPage 
                prescriptions={prescriptions} 
                drugs={drugs} 
                visits={visits}
                handleDispenseDrug={handleDispenseDrug} 
              />
            )}
            {activeMenu === 'drugs' && (
              <DrugsPage 
                drugs={drugs} 
                setShowModal={setShowModal} 
                setModalType={setModalType} 
                setEditingItem={setEditingItem} 
                handleDelete={handleDelete} 
              />
            )}
            {activeMenu === 'complaints' && (
              <ComplaintsPage 
                complaints={complaints} 
                handleComplaintResponse={handleComplaintResponse} 
              />
            )}
          </div>
        </div>
      </div>

      {showModal && modalType === 'patient' && (
        <PatientModal
          editingItem={editingItem}
          onSubmit={handlePatientSubmit}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}

      {showModal && modalType === 'visit' && (
        <VisitModal
          editingItem={editingItem}
          patients={patients}
          onSubmit={handleVisitSubmit}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}

      {showModal && modalType === 'prescription' && (
        <PrescriptionModal
          visits={visits}
          drugs={drugs}
          onSubmit={handlePrescriptionSubmit}
          onClose={() => { setShowModal(false); }}
        />
      )}

      {showModal && modalType === 'drug' && (
        <DrugModal
          editingItem={editingItem}
          onSubmit={handleDrugSubmit}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
};

const Dashboard = ({ role, visits, patients, prescriptions, complaints, drugs, transactions }) => {
  const todayVisits = visits.filter(v => v.visitDate === new Date().toISOString().split('T')[0]);
  const todayTransactions = transactions.filter(t => t.timestamp.startsWith(new Date().toLocaleDateString('id-ID')));
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {role === 'admin' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Pasien</p>
                  <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Kunjungan Hari Ini</p>
                  <p className="text-3xl font-bold text-green-600">{todayVisits.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pendapatan Hari Ini</p>
                  <p className="text-2xl font-bold text-purple-600">Rp {todayRevenue.toLocaleString('id-ID')}</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </>
        )}

        {role === 'dokter' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Antrian Hari Ini</p>
                  <p className="text-3xl font-bold text-blue-600">{todayVisits.length}</p>
                </div>
                <ClipboardList className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Menunggu Periksa</p>
                  <p className="text-3xl font-bold text-orange-600">{visits.filter(v => v.status === 'Menunggu').length}</p>
                </div>
                <Users className="w-12 h-12 text-orange-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Selesai Hari Ini</p>
                  <p className="text-3xl font-bold text-green-600">{todayVisits.filter(v => v.status === 'Selesai Periksa').length}</p>
                </div>
                <FileText className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
          </>
        )}

        {role === 'apoteker' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Obat</p>
                  <p className="text-3xl font-bold text-blue-600">{drugs.length}</p>
                </div>
                <Pill className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Resep Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{prescriptions.filter(p => p.status === 'Pending').length}</p>
                </div>
                <FileText className="w-12 h-12 text-orange-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Stok Menipis</p>
                  <p className="text-3xl font-bold text-red-600">{drugs.filter(d => d.stock < 20).length}</p>
                </div>
                <Pill className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terkini</h3>
        <div className="space-y-3">
          {visits.slice(0, 5).map(visit => (
            <div key={visit.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-semibold text-gray-800">{visit.patientName}</p>
                <p className="text-sm text-gray-600">Antrian: {visit.queueNo}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  visit.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                  visit.status === 'Selesai Periksa' ? 'bg-green-100 text-green-800' :
                  visit.status === 'Selesai & Lunas' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {visit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatientsPage = ({ patients, setShowModal, setModalType, setEditingItem, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nik.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Data Pasien</h2>
        <button
          onClick={() => { setShowModal(true); setModalType('patient'); setEditingItem(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pasien
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIK pasien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">NIK</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jenis Kelamin</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kontak</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{patient.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{patient.name}</td>
                  <td className="px-4 py-3 text-sm">{patient.nik}</td>
                  <td className="px-4 py-3 text-sm">{patient.gender}</td>
                  <td className="px-4 py-3 text-sm">{patient.contact}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(patient); setModalType('patient'); setShowModal(true); }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id, 'patient')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage = ({ visits, patients, setShowModal, setModalType, setEditingItem }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Pasien</h2>
        <button
          onClick={() => { setShowModal(true); setModalType('visit'); setEditingItem(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Daftarkan Pasien
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Kunjungan Hari Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No. Antrian</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Pasien</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Keluhan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visits.map(visit => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{visit.queueNo}</td>
                  <td className="px-4 py-3 text-sm font-medium">{visit.patientName}</td>
                  <td className="px-4 py-3 text-sm">{visit.visitDate}</td>
                  <td className="px-4 py-3 text-sm">{visit.complaint}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      visit.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                      visit.status === 'Selesai Periksa' ? 'bg-green-100 text-green-800' :
                      visit.status === 'Selesai & Lunas' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {visit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = ({ visits, transactions, handlePayment }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [amount, setAmount] = useState(50000);

  const unpaidVisits = visits.filter(v => v.status === 'Selesai Periksa');

  const handleSubmitPayment = () => {
    if (!selectedVisit) {
      alert('Pilih kunjungan terlebih dahulu!');
      return;
    }
    if (amount <= 0) {
      alert('Jumlah pembayaran harus lebih dari 0!');
      return;
    }
    handlePayment(selectedVisit.id, amount, paymentMethod);
    setSelectedVisit(null);
    setAmount(50000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pembayaran</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Kunjungan Belum Lunas</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {unpaidVisits.map(visit => (
              <div
                key={visit.id}
                onClick={() => {
                  setSelectedVisit(visit);
                  setAmount(50000);
                }}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedVisit?.id === visit.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-blue-600">{visit.queueNo}</p>
                    <p className="font-semibold text-gray-800">{visit.patientName}</p>
                    <p className="text-sm text-gray-600 mt-1">Tanggal: {visit.visitDate}</p>
                  </div>
                </div>
              </div>
            ))}
            {unpaidVisits.length === 0 && (
              <p className="text-center text-gray-500 py-8">Tidak ada kunjungan yang perlu dibayar</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Pembayaran</h3>
          {selectedVisit ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pasien</p>
                <p className="font-bold text-lg">{selectedVisit.patientName}</p>
                <p className="text-sm text-gray-600 mt-2">No. Antrian: {selectedVisit.queueNo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Pembayaran (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tunai">Tunai</option>
                  <option value="Debit">Kartu Debit</option>
                  <option value="Kredit">Kartu Kredit</option>
                  <option value="Transfer">Transfer Bank</option>
                </select>
              </div>

              <button
                onClick={handleSubmitPayment}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Proses Pembayaran
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Pilih kunjungan dari daftar untuk memproses pembayaran</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Transaksi Hari Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Transaksi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jumlah</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{transaction.id}</td>
                  <td className="px-4 py-3 text-sm">{transaction.timestamp}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">Rp {transaction.amount.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm">{transaction.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm">{transaction.cashier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExaminationPage = ({ visits, setVisits, patients }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveExamination = () => {
    if (selectedVisit) {
      const updatedVisits = visits.map(v => 
        v.id === selectedVisit.id 
          ? { ...v, diagnosis, notes, status: 'Dalam Pemeriksaan' }
          : v
      );
      setVisits(updatedVisits);
      setSelectedVisit({...selectedVisit, diagnosis, notes, status: 'Dalam Pemeriksaan'});
      alert('Catatan pemeriksaan berhasil disimpan!');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pemeriksaan Pasien</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Antrian</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {visits.filter(v => v.status === 'Menunggu' || v.status === 'Dalam Pemeriksaan').map(visit => (
              <div
                key={visit.id}
                onClick={() => {
                  setSelectedVisit(visit);
                  setDiagnosis(visit.diagnosis || '');
                  setNotes(visit.notes || '');
                }}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedVisit?.id === visit.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-blue-600">{visit.queueNo}</p>
                    <p className="font-semibold text-gray-800">{visit.patientName}</p>
                    <p className="text-sm text-gray-600 mt-1">Keluhan: {visit.complaint}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    visit.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {visit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Catatan Pemeriksaan</h3>
          {selectedVisit ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pasien</p>
                <p className="font-bold text-lg">{selectedVisit.patientName}</p>
                <p className="text-sm text-gray-600 mt-2">No. Antrian: {selectedVisit.queueNo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan diagnosis..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pemeriksaan</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan catatan pemeriksaan..."
                />
              </div>

              <button
                onClick={handleSaveExamination}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Catatan
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Pilih pasien dari daftar antrian untuk memulai pemeriksaan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrescriptionsPage = ({ visits, drugs, setShowModal, setModalType, prescriptions }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pembuatan Resep</h2>
        <button
          onClick={() => { setShowModal(true); setModalType('prescription'); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Resep
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Resep</h3>
        <div className="space-y-4">
          {prescriptions.map(prescription => {
            const visit = visits.find(v => v.id === prescription.visitId);
            return (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">ID Resep: {prescription.id}</p>
                    <p className="text-sm text-gray-600">Pasien: {visit?.patientName}</p>
                    <p className="text-sm text-gray-600">Tanggal: {prescription.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    prescription.status === 'Diserahkan' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prescription.status || 'Pending'}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Item Obat:</p>
                  {prescription.items.map((item, idx) => {
                    const drug = drugs.find(d => d.id === item.drugId);
                    return (
                      <div key={idx} className="text-sm text-gray-600">
                        • {drug?.name} - {item.quantity} - {item.dose} - {item.instruction}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PharmacyPage = ({ prescriptions, drugs, visits, handleDispenseDrug }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Penebusan Obat</h2>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Resep Pending</h3>
        <div className="space-y-4">
          {prescriptions.filter(p => p.status === 'Pending').map(prescription => {
            const visit = visits.find(v => v.id === prescription.visitId);
            return (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">ID Resep: {prescription.id}</p>
                    <p className="text-sm text-gray-600">Pasien: {visit?.patientName}</p>
                    <p className="text-sm text-gray-600">Tanggal: {prescription.date}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Item Obat:</p>
                  {prescription.items.map((item, idx) => {
                    const drug = drugs.find(d => d.id === item.drugId);
                    return (
                      <div key={idx} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>• {drug?.name} - {item.quantity} - {item.dose}</span>
                        <span className="font-semibold">Stok: {drug?.stock}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => handleDispenseDrug(prescription)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Serahkan Obat
                </button>
              </div>
            );
          })}
          {prescriptions.filter(p => p.status === 'Pending').length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada resep yang perlu diproses</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DrugsPage = ({ drugs, setShowModal, setModalType, setEditingItem, handleDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Data Obat</h2>
        <button
          onClick={() => { setShowModal(true); setModalType('drug'); setEditingItem(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Obat
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Obat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stok</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Harga</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kadaluarsa</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drugs.map(drug => (
                <tr key={drug.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{drug.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{drug.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${drug.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {drug.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">Rp {drug.unitPrice.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm">{drug.expiryDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(drug); setModalType('drug'); setShowModal(true); }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(drug.id, 'drug')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ComplaintsPage = ({ complaints, handleComplaintResponse }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  const handleSubmitResponse = (complaintId) => {
    if (response.trim()) {
      handleComplaintResponse(complaintId, response);
      setResponse('');
      setSelectedComplaint(null);
    } else {
      alert('Harap isi tanggapan terlebih dahulu!');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Keluhan & Saran</h2>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="space-y-4">
          {complaints.map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800">{complaint.patientName}</p>
                  <p className="text-sm text-gray-600">Tanggal: {complaint.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  complaint.status === 'Baru' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'Diproses' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-sm text-gray-700">{complaint.content}</p>
              </div>
              {complaint.response && (
                <div className="bg-blue-50 p-3 rounded mb-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Tanggapan:</p>
                  <p className="text-sm text-blue-900">{complaint.response}</p>
                </div>
              )}
              {complaint.status === 'Baru' && (
                <div className="space-y-2">
                  <textarea
                    value={selectedComplaint === complaint.id ? response : ''}
                    onChange={(e) => {
                      setSelectedComplaint(complaint.id);
                      setResponse(e.target.value);
                    }}
                    placeholder="Tulis tanggapan..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={() => handleSubmitResponse(complaint.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Kirim Tanggapan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatientModal = ({ editingItem, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(editingItem || {
    name: '',
    nik: '',
    dob: '',
    gender: 'Laki-laki',
    address: '',
    contact: '',
    allergy: '',
    medicalHistory: ''
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.nik || !formData.dob || !formData.address || !formData.contact) {
      alert('Harap isi semua field yang wajib (*)');
      return;
    }
    
    console.log('Submitting patient:', formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {editingItem ? 'Edit Pasien' : 'Tambah Pasien Baru'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIK *</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData(prev => ({...prev, nik: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kontak *</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({...prev, contact: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alergi</label>
              <input
                type="text"
                value={formData.allergy}
                onChange={(e) => setFormData(prev => ({...prev, allergy: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Penisilin, Seafood"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Riwayat Kesehatan</label>
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => setFormData(prev => ({...prev, medicalHistory: e.target.value}))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Hipertensi, Diabetes"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const VisitModal = ({ editingItem, patients, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(editingItem || {
    patientId: '',
    patientName: '',
    visitDate: new Date().toISOString().split('T')[0],
    complaint: ''
  });

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patientId,
      patientName: patient?.name || ''
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!formData.patientId || !formData.complaint) {
      alert('Harap pilih pasien dan isi keluhan!');
      return;
    }
    
    console.log('Submitting visit:', formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Pendaftaran Kunjungan</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pasien *</label>
              <select
                value={formData.patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Pilih Pasien --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.nik}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kunjungan *</label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData(prev => ({...prev, visitDate: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keluhan *</label>
              <textarea
                value={formData.complaint}
                onChange={(e) => setFormData(prev => ({...prev, complaint: e.target.value}))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Jelaskan keluhan pasien..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Daftarkan
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PrescriptionModal = ({ visits, drugs, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    visitId: '',
    items: [{ drugId: '', dose: '', quantity: 1, instruction: '' }]
  });

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { drugId: '', dose: '', quantity: 1, instruction: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {...newItems[index], [field]: value};
      return {...prev, items: newItems};
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!formData.visitId) {
      alert('Harap pilih kunjungan pasien!');
      return;
    }
    
    const isValid = formData.items.every(item => 
      item.drugId && item.dose && item.quantity > 0 && item.instruction
    );
    
    if (!isValid) {
      alert('Harap lengkapi semua item obat!');
      return;
    }
    
    console.log('Submitting prescription:', formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Buat Resep Obat</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kunjungan Pasien *</label>
              <select
                value={formData.visitId}
                onChange={(e) => setFormData(prev => ({...prev, visitId: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Pilih Pasien --</option>
                {visits.filter(v => v.status === 'Dalam Pemeriksaan' || v.status === 'Selesai Periksa').map(visit => (
                  <option key={visit.id} value={visit.id}>
                    {visit.patientName} - {visit.queueNo} ({visit.visitDate})
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Item Obat</h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Item
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-sm text-gray-700">Item #{index + 1}</h5>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Obat *</label>
                      <select
                        value={item.drugId}
                        onChange={(e) => handleItemChange(index, 'drugId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">-- Pilih Obat --</option>
                        {drugs.map(drug => (
                          <option key={drug.id} value={drug.id}>
                            {drug.name} (Stok: {drug.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosis *</label>
                      <input
                        type="text"
                        value={item.dose}
                        onChange={(e) => handleItemChange(index, 'dose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Contoh: 3x sehari"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Instruksi *</label>
                      <input
                        type="text"
                        value={item.instruction}
                        onChange={(e) => handleItemChange(index, 'instruction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Contoh: Sesudah makan"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Buat Resep
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DrugModal = ({ editingItem, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(editingItem || {
    name: '',
    stock: 0,
    unitPrice: 0,
    expiryDate: ''
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.expiryDate) {
      alert('Harap isi nama obat dan tanggal kadaluarsa!');
      return;
    }
    
    if (parseInt(formData.stock) < 0 || parseInt(formData.unitPrice) < 0) {
      alert('Stok dan harga tidak boleh negatif!');
      return;
    }
    
    console.log('Submitting drug:', formData);
    onSubmit({
      ...formData,
      stock: parseInt(formData.stock),
      unitPrice: parseInt(formData.unitPrice)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {editingItem ? 'Edit Obat' : 'Tambah Obat Baru'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Obat *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Paracetamol 500mg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Satuan *</label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({...prev, unitPrice: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  placeholder="Dalam Rupiah"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kadaluarsa *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({...prev, expiryDate: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                {editingItem ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KlinikSentosaSystem;