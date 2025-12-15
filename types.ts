export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'repair' | 'software' | 'hardware' | 'consulting';
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string; // In a real app, never store plain text passwords
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerPhone: string;
  customerId?: string; // Link to the registered user
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

export interface AdminState {
  isAuthenticated: boolean;
}