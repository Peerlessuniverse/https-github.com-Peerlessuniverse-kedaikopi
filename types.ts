
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Espresso' | 'Manual Brew' | 'Signature' | 'Snacks' | 'Beans';
  image: string;
  stock: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  status: 'Open' | 'Closed';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  branchId: string;
  type: 'In-Store' | 'Online';
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type ViewState = 'PUBLIC' | 'STORE' | 'POS' | 'ADMIN';
