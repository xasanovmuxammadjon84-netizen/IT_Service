import { Product, Order, User, NewsPost } from '../types';

const PRODUCTS_KEY = 'technomaster_products';
const ORDERS_KEY = 'technomaster_orders';
const USERS_KEY = 'technomaster_users';
const CURRENT_USER_KEY = 'technomaster_current_user';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Windows O\'rnatish',
    description: 'Barcha drayverlar va ofis dasturlari bilan sifatli Windows o\'rnatish xizmati.',
    price: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400',
    category: 'software'
  },
  {
    id: '2',
    title: 'Kompyuter Tozalash',
    description: 'Changlardan tozalash va termopastani yangilash. Kompyuter ishlashini tezlashtirish.',
    price: 100000,
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=400',
    category: 'repair'
  },
  {
    id: '3',
    title: 'SSD O\'rnatish',
    description: 'Eski HDD o\'rniga tezkor SSD o\'rnatish va ma\'lumotlarni ko\'chirish.',
    price: 350000,
    imageUrl: 'https://images.unsplash.com/photo-1597872258084-dd313c6b9996?auto=format&fit=crop&q=80&w=400',
    category: 'hardware'
  }
];

const NEWS_DATA: NewsPost[] = [
  {
    id: '1',
    title: 'NVIDIA yangi RTX 5000 seriyasini e\'lon qildi',
    excerpt: 'Grafik kartalar olamida yangi inqilob. Sun\'iy intellekt endi o\'yinlarda yanada tezroq ishlaydi.',
    date: '12 Mart, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    title: 'Windows 12 qachon chiqadi?',
    excerpt: 'Microsoft yangi operatsion tizim ustida ishlamoqda. Yangi dizayn va bulutli texnologiyalar.',
    date: '10 Mart, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    title: 'SSD disklar narxi oshishi mumkin',
    excerpt: 'Jahon bozorida xotira chiplari taqchilligi kuzatilmoqda. Kompyuteringizni hoziroq yangilang.',
    date: '05 Mart, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1558486012-817147316dd7?auto=format&fit=crop&q=80&w=400'
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const addProduct = (product: Product): void => {
  const products = getProducts();
  const newProducts = [product, ...products];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const newProducts = products.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  const newOrders = [order, ...orders];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
};

export const updateOrderStatus = (id: string, status: Order['status']): void => {
  const orders = getOrders();
  const newOrders = orders.map(order => 
    order.id === id ? { ...order, status } : order
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
};

export const getNews = (): NewsPost[] => {
  return NEWS_DATA;
};

// --- User Management ---

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const registerUser = (user: User): { success: boolean; message: string } => {
  const users = getUsers();
  if (users.some(u => u.phone === user.phone || u.email === user.email)) {
    return { success: false, message: "Bu telefon raqam yoki email allaqachon ro'yxatdan o'tgan." };
  }
  const newUsers = [...users, user];
  localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  return { success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" };
};

export const loginUser = (phoneOrEmail: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => 
    (u.phone === phoneOrEmail || u.email === phoneOrEmail) && u.password === password
  );
  return user || null;
};

export const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};