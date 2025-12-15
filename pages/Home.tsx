import React, { useState, useEffect } from 'react';
import { getProducts, addOrder, getCurrentUser, loginUser, registerUser, saveCurrentUser, getNews } from '../services/storageService';
import { Product, User, NewsPost } from '../types';
import { ShoppingCart, CheckCircle, X, Search, Shield, User as UserIcon, LogIn, UserPlus, Zap, Clock, ThumbsUp, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Order State
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setProducts(getProducts());
    setNews(getNews());
    setCurrentUser(getCurrentUser());

    // Listen for auth changes from Navbar
    const handleAuthChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('auth-change', handleAuthChange);

    const interval = setInterval(() => {
      setProducts(getProducts());
    }, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleBuyClick = (product: Product) => {
    if (currentUser) {
      setSelectedProduct(product);
    } else {
      setAuthError('');
      setAuthMode('login'); // Default to login
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      const user = loginUser(authPhone, authPassword); // authPhone acts as "Phone or Email" input in login mode
      if (user) {
        saveCurrentUser(user);
        setCurrentUser(user);
        setShowAuthModal(false);
        window.dispatchEvent(new Event('auth-change'));
        // If they were trying to buy something, keep the flow if possible, or user has to click again
      } else {
        setAuthError("Login, email yoki parol xato!");
      }
    } else {
      // Register
      const newUser: User = {
        id: Date.now().toString(),
        name: authName,
        phone: authPhone,
        email: authEmail,
        password: authPassword
      };
      
      const result = registerUser(newUser);
      if (result.success) {
        saveCurrentUser(newUser);
        setCurrentUser(newUser);
        setShowAuthModal(false);
        window.dispatchEvent(new Event('auth-change'));
        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      } else {
        setAuthError(result.message);
      }
    }
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !currentUser) return;

    const newOrder = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerId: currentUser.id,
      status: 'pending' as const,
      date: new Date().toISOString()
    };

    addOrder(newOrder);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedProduct(null);
    }, 2000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Hero Section */}
      <div className="bg-brand-black border-b border-brand-yellow/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-yellow/5 skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Professional <br/>
            <span className="text-brand-yellow">IT Service</span> Markazi
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl">
            Tezkor ta'mirlash, dasturiy ta'minot va zamonaviy yechimlar. 
            Biz bilan texnikangiz xavfsiz qo'llarda.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <a href="#services" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-black bg-brand-yellow hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105">
              Xizmatlarni tanlash
            </a>
            {!currentUser && (
              <button 
                onClick={() => { setShowAuthModal(true); setAuthMode('register'); }}
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-700 text-lg font-medium rounded-lg text-gray-300 bg-transparent hover:bg-white/5 transition-all"
              >
                <UserIcon className="mr-2 h-5 w-5 text-brand-yellow" /> Kabinet ochish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="bg-brand-dark py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Nega aynan biz?</h2>
            <div className="w-20 h-1 bg-brand-yellow mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-brand-black rounded-xl border border-gray-800 text-center hover:border-brand-yellow/50 transition-colors">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-brand-yellow h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tezkor Xizmat</h3>
              <p className="text-gray-400">Bizning mutaxassislar muammoni eng qisqa vaqt ichida aniqlab, bartaraf etishadi.</p>
            </div>
            <div className="p-6 bg-brand-black rounded-xl border border-gray-800 text-center hover:border-brand-yellow/50 transition-colors">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-brand-yellow h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Kafolat</h3>
              <p className="text-gray-400">Barcha bajarilgan ishlar va o'rnatilgan ehtiyot qismlarga to'liq kafolat beramiz.</p>
            </div>
            <div className="p-6 bg-brand-black rounded-xl border border-gray-800 text-center hover:border-brand-yellow/50 transition-colors">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-brand-yellow h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">24/7 Qo'llab-quvvatlash</h3>
              <p className="text-gray-400">Mijozlarimiz uchun har doim aloqadamiz. Online konsultatsiya bepul.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
           <div>
              <h2 className="text-3xl font-bold text-white mb-2">Bizning Xizmatlar</h2>
              <p className="text-gray-400">Kompyuteringiz uchun eng yaxshi yechimlar</p>
           </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['all', 'software', 'hardware', 'repair'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === cat 
                    ? 'bg-brand-yellow text-black' 
                    : 'bg-brand-black text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat === 'all' ? 'Barchasi' : cat}
              </button>
            ))}
          </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-black border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-brand-black border border-gray-800 rounded-xl overflow-hidden hover:border-brand-yellow/50 transition-all duration-300 hover:shadow-[0_5px_20px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="relative h-56 overflow-hidden bg-gray-900">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase shadow-md">
                  {product.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <span className="text-xl font-bold text-brand-yellow">
                    {product.price.toLocaleString()} UZS
                  </span>
                  <button
                    onClick={() => handleBuyClick(product)}
                    className="bg-white text-black hover:bg-brand-yellow px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 transform hover:-translate-y-1"
                  >
                    <ShoppingCart size={16} /> Buyurtma
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Hech narsa topilmadi...</p>
          </div>
        )}
      </div>

      {/* News Section */}
      <div className="bg-brand-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-3xl font-bold text-white">So'nggi Yangiliklar</h2>
             <a href="#" className="text-brand-yellow text-sm font-medium hover:underline">Barchasini ko'rish &rarr;</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-brand-dark rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-wider">{item.date}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-brand-yellow transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-brand-dark py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Mijozlarimiz Fikri</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-1 text-brand-yellow mb-4">
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
              </div>
              <p className="text-gray-300 italic mb-4">"Juda tez va sifatli xizmat. Kompyuterim endi yangidek ishlayapti. Rahmat!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">A</div>
                <div>
                  <h4 className="text-white font-bold text-sm">Azizbek T.</h4>
                  <p className="text-gray-500 text-xs">Toshkent</p>
                </div>
              </div>
            </div>
            <div className="bg-black/40 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-1 text-brand-yellow mb-4">
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
              </div>
              <p className="text-gray-300 italic mb-4">"Windows o'rnatish bo'yicha eng yaxshi mutaxassislar. Hamma narsani tushuntirib berishdi."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">M</div>
                <div>
                  <h4 className="text-white font-bold text-sm">Madina K.</h4>
                  <p className="text-gray-500 text-xs">Samarqand</p>
                </div>
              </div>
            </div>
            <div className="bg-black/40 p-6 rounded-2xl border border-gray-800 md:hidden lg:block">
              <div className="flex items-center gap-1 text-brand-yellow mb-4">
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
                <ThumbsUp size={16} fill="currentColor" />
              </div>
              <p className="text-gray-300 italic mb-4">"Narxlar hamyonbop va sifat a'lo darajada. Tavsiya qilaman!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">J</div>
                <div>
                  <h4 className="text-white font-bold text-sm">Jamshid R.</h4>
                  <p className="text-gray-500 text-xs">Farg'ona</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">IT <span className="text-brand-yellow">SERVICE</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Zamonaviy kompyuter xizmatlari va texnik yordam ko'rsatish bo'yicha yetakchi kompaniya. Sifat va ishonch - bizning shiorimiz.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Tezkor Havolalar</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-brand-yellow transition-colors">Bosh Sahifa</a></li>
                <li><a href="#services" className="hover:text-brand-yellow transition-colors">Xizmatlar</a></li>
                <li><a href="#" className="hover:text-brand-yellow transition-colors">Biz haqimizda</a></li>
                <li><a href="#" className="hover:text-brand-yellow transition-colors">Aloqa</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Biz bilan aloqa</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone size={16} className="text-brand-yellow" /> +998 90 123 45 67</li>
                <li className="flex items-center gap-2"><Mail size={16} className="text-brand-yellow" /> info@itservice.uz</li>
                <li className="flex items-center gap-2"><MapPin size={16} className="text-brand-yellow" /> Toshkent sh, Chilonzor</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Ijtimoiy Tarmoqlar</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-brand-yellow hover:text-black transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-brand-yellow hover:text-black transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-brand-yellow hover:text-black transition-all">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} IT SERVICE. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in">
             <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex mb-6 border-b border-gray-700">
              <button
                className={`flex-1 pb-3 text-center font-medium transition-colors ${authMode === 'login' ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-gray-400 hover:text-white'}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Kirish
              </button>
              <button
                className={`flex-1 pb-3 text-center font-medium transition-colors ${authMode === 'register' ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-gray-400 hover:text-white'}`}
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ismingiz</label>
                    <input
                      required
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none"
                      placeholder="Ism Familiya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      required
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {authMode === 'register' ? 'Telefon raqam' : 'Telefon raqam yoki Email'}
                </label>
                <input
                  required
                  type="text"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none"
                  placeholder={authMode === 'register' ? "+998 90 123 45 67" : "Login ma'lumoti"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Parol</label>
                <input
                  required
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none"
                  placeholder="********"
                />
              </div>

              {authError && (
                <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-brand-yellow hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors shadow-lg mt-2 flex items-center justify-center gap-2"
              >
                {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {authMode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal (Only shown if logged in) */}
      {selectedProduct && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-16 w-16 text-brand-yellow mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Buyurtma Qabul qilindi!</h3>
                <p className="text-gray-400">Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
              </div>
            ) : (
              <form onSubmit={handleOrder}>
                <h2 className="text-2xl font-bold text-white mb-1">Buyurtmani tasdiqlash</h2>
                <p className="text-gray-400 text-sm mb-6">
                  <span className="text-brand-yellow">{selectedProduct.title}</span>
                </p>
                
                <div className="bg-black/50 p-4 rounded-lg mb-6 border border-gray-800">
                  <p className="text-gray-400 text-sm">Buyurtmachi:</p>
                  <p className="text-white font-medium">{currentUser.name}</p>
                  <p className="text-white font-medium">{currentUser.phone}</p>
                  <p className="text-brand-yellow mt-2 text-lg font-bold">{selectedProduct.price.toLocaleString()} UZS</p>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors shadow-lg"
                  >
                    Buyurtma Berish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};