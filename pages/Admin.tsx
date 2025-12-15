import React, { useState, useEffect } from 'react';
import { AdminState, Order, Product } from '../types';
import { getOrders, getProducts, addProduct, updateOrderStatus, deleteProduct } from '../services/storageService';
import { generateProductDescription } from '../services/geminiService';
import { LayoutDashboard, Package, LogOut, Plus, Check, X, Sparkles, Trash2, Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [auth, setAuth] = useState<AdminState>({ isAuthenticated: false });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('software');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check local session
    const isAuth = sessionStorage.getItem('isAdmin') === 'true';
    if (isAuth) {
      setAuth({ isAuthenticated: true });
      loadData();
    }
  }, []);

  const loadData = () => {
    setOrders(getOrders());
    setProducts(getProducts());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin login va paroli: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      setAuth({ isAuthenticated: true });
      sessionStorage.setItem('isAdmin', 'true');
      loadData();
    } else {
      alert('Login yoki parol xato!');
    }
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false });
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleGenerateDescription = async () => {
    if (!newTitle) {
      alert("Iltimos, avval mahsulot nomini kiriting.");
      return;
    }
    setIsGeneratingAI(true);
    const desc = await generateProductDescription(newTitle, newCategory);
    setNewDesc(desc);
    setIsGeneratingAI(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      imageUrl: newImage || `https://picsum.photos/400/300?random=${Date.now()}`,
      category: newCategory
    };
    addProduct(product);
    setProducts(getProducts());
    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setNewImage('');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    setOrders(getOrders());
  };

  // --- LOGIN VIEW ---
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="bg-brand-dark border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto bg-brand-yellow w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard className="text-black" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Kirish</h1>
            <p className="text-gray-400 text-sm">Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Login</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow focus:outline-none transition-colors"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-yellow hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
              Kirish
            </button>
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                Demo: Login: <b>admin</b> | Parol: <b>admin123</b>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-dark border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 text-brand-yellow font-bold text-xl">
          <LayoutDashboard /> Admin Panel
        </div>
        
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Clock size={20} /> Buyurtmalar
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Package size={20} /> Mahsulotlar
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={20} /> Chiqish
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'orders' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Buyurtmalar ro'yxati</h2>
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <p className="text-gray-500">Buyurtmalar mavjud emas.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-brand-dark border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-yellow/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-brand-yellow">{order.productTitle}</span>
                        <span className="text-xs text-gray-500 bg-black px-2 py-0.5 rounded border border-gray-800">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white">{order.customerName}</p>
                      <p className="text-gray-400 text-sm">{order.customerPhone}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {order.status === 'pending' ? 'Kutilmoqda' : 
                         order.status === 'completed' ? 'Bajarildi' : 'Bekor qilindi'}
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="p-2 bg-green-600/20 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                            title="Bajarildi deb belgilash"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="p-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            title="Bekor qilish"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Mahsulotlarni Boshqarish</h2>
            
            {/* Add Product Form */}
            <div className="bg-brand-dark border border-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-brand-yellow flex items-center gap-2">
                <Plus size={20} /> Yangi xizmat qo'shish
              </h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Xizmat nomi</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
                    placeholder="Masalan: Video karta ta'mirlash"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Narxi (so'm)</label>
                  <input
                    required
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Kategoriya</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
                  >
                    <option value="software">Dasturiy (Software)</option>
                    <option value="hardware">Texnik (Hardware)</option>
                    <option value="repair">Ta'mirlash</option>
                    <option value="consulting">Maslahat</option>
                  </select>
                </div>

                <div>
                   <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <ImageIcon size={14} /> Rasm havolasi (URL)
                   </label>
                   <input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
                    placeholder="https://example.com/rasm.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Agar bo'sh qoldirilsa, avtomatik rasm qo'yiladi.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1 flex justify-between">
                    <span>Tavsif (Description)</span>
                    <button 
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingAI}
                      className="text-xs text-brand-yellow flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Sparkles size={12} /> 
                      {isGeneratingAI ? 'AI Yozmoqda...' : 'AI bilan yozish'}
                    </button>
                  </label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none h-24 resize-none"
                    placeholder="Xizmat haqida qisqacha ma'lumot..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors w-full md:w-auto">
                    Qo'shish
                  </button>
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-brand-dark border border-gray-800 rounded-lg p-4 relative group">
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="absolute top-2 right-2 bg-red-500/10 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="h-40 w-full mb-4 rounded-lg overflow-hidden bg-black">
                     <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-white pr-8">{p.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{p.category}</p>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{p.description}</p>
                  <p className="text-brand-yellow font-bold mt-4">{p.price.toLocaleString()} UZS</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};