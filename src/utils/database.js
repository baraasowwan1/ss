// LocalStorage State Management Layer for SOWWAN Platform

const STORAGE_KEYS = {
  STORES: 'sowwan_stores',
  SUBSCRIPTIONS: 'sowwan_subscriptions',
  TRANSACTIONS: 'sowwan_transactions',
  CURRENT_USER: 'sowwan_current_user',
};

// Initial Mock Subscriptions & Stores for demonstration purposes
const INITIAL_STORES = [
  {
    id: 'store-ahmad-tech',
    name: 'Ahmad Tech Store',
    subdomain: 'ahmadtech',
    niche: 'E-commerce',
    theme: 'emerald-glass',
    pages: ['home', 'store', 'about', 'contact'],
    products: [
      { id: 1, name: 'Premium Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', description: 'Noise cancelling, 40h battery life' },
      { id: 2, name: 'Mechanical Keyboard RGB', price: 129.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', description: 'Tactile switches, aluminum body' },
      { id: 3, name: 'Ergonomic Wireless Mouse', price: 59.99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', description: 'Multi-device pairing, silent clicks' }
    ],
    status: 'active',
    plan: 'professional',
    created: '2026-05-15T12:00:00.000Z',
    clientEmail: 'ahmad@example.com',
    clientName: 'Ahmad Omar',
    earnings: 2450.00
  },
  {
    id: 'store-reem-boutique',
    name: 'Reem Luxury Boutique',
    subdomain: 'reemboutique',
    niche: 'E-commerce',
    theme: 'sunset-gold',
    pages: ['home', 'store', 'about', 'contact', 'faq'],
    products: [
      { id: 1, name: 'Silk Floral Summer Dress', price: 180.00, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', description: '100% premium silk, lightweight' },
      { id: 2, name: 'Designer Leather Handbag', price: 320.00, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', description: 'Italian leather, gold hardware' }
    ],
    status: 'suspended',
    plan: 'enterprise',
    created: '2026-05-01T09:00:00.000Z',
    clientEmail: 'reem@example.com',
    clientName: 'Reem Mansour',
    earnings: 5800.00
  },
  {
    id: 'store-sami-design',
    name: 'Sami Creative Agency',
    subdomain: 'samidesign',
    niche: 'Portfolio',
    theme: 'cyberpunk-blue',
    pages: ['home', 'about', 'contact'],
    products: [
      { id: 1, name: 'Full Branding Package', price: 499.00, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', description: 'Logo, typography, style guides' },
      { id: 2, name: 'UX/UI Website Design', price: 899.00, image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500', description: 'High fidelity interactive prototypes' }
    ],
    status: 'active',
    plan: 'starter',
    created: '2026-05-20T16:30:00.000Z',
    clientEmail: 'sami@example.com',
    clientName: 'Sami Haddad',
    earnings: 899.00
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TXN-001', storeId: 'store-ahmad-tech', storeName: 'Ahmad Tech Store', clientName: 'Ahmad Omar', amount: 49.00, plan: 'professional', status: 'completed', date: '2026-05-15T12:05:00.000Z', paypalTxnId: 'PAY-89230588HL394851K' },
  { id: 'TXN-002', storeId: 'store-reem-boutique', storeName: 'Reem Luxury Boutique', clientName: 'Reem Mansour', amount: 99.00, plan: 'enterprise', status: 'completed', date: '2026-05-01T09:10:00.000Z', paypalTxnId: 'PAY-74910243AB592812X' },
  { id: 'TXN-003', storeId: 'store-sami-design', storeName: 'Sami Creative Agency', clientName: 'Sami Haddad', amount: 19.00, plan: 'starter', status: 'completed', date: '2026-05-20T16:35:00.000Z', paypalTxnId: 'PAY-29381023CD491023D' }
];

export const PLANS = {
  starter: { name: 'Starter', price: 19, features: ['Standard Landing Page', 'Up to 3 custom pages', 'Basic portfolio elements', 'PayPal simulation integration'] },
  professional: { name: 'Professional', price: 49, features: ['Premium Custom Theme', 'Up to 6 custom pages', 'Full E-commerce Catalog', 'Real PayPal Checkout SDK ready', 'Analytics Dashboard', 'Priority support'] },
  enterprise: { name: 'Enterprise', price: 99, features: ['Custom Enterprise Theme', 'Unlimited pages', 'Full E-commerce Catalog', 'Domain Customization', 'Real PayPal checkout', 'Admin multi-store panel access', 'Dedicated consultant'] }
};

// Database Functions
export const initializeDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STORES)) {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(INITIAL_STORES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
};

export const getStores = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
};

export const saveStore = (store) => {
  const stores = getStores();
  const existingIndex = stores.findIndex(s => s.id === store.id || s.subdomain === store.subdomain);
  
  if (existingIndex !== -1) {
    stores[existingIndex] = { ...stores[existingIndex], ...store };
  } else {
    stores.push({
      ...store,
      id: store.id || 'store-' + Math.random().toString(36).substr(2, 9),
      created: store.created || new Date().toISOString(),
      status: store.status || 'active',
      earnings: store.earnings || 0
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  return store;
};

export const getStoreBySubdomain = (subdomain) => {
  const stores = getStores();
  return stores.find(s => s.subdomain.toLowerCase() === subdomain.toLowerCase());
};

export const updateStoreSubscriptionStatus = (storeId, status) => {
  const stores = getStores();
  const store = stores.find(s => s.id === storeId);
  if (store) {
    store.status = status;
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
    return true;
  }
  return false;
};

export const getTransactions = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
};

export const addTransaction = (txn) => {
  const txns = getTransactions();
  const newTxn = {
    id: txn.id || 'TXN-' + Math.floor(100 + Math.random() * 900),
    date: new Date().toISOString(),
    status: 'completed',
    ...txn
  };
  txns.push(newTxn);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
  return newTxn;
};

export const getAnalytics = () => {
  const stores = getStores();
  const txns = getTransactions();
  
  const activeStores = stores.filter(s => s.status === 'active');
  const suspendedStores = stores.filter(s => s.status === 'suspended');
  
  // Calculate MRR
  let mrr = 0;
  activeStores.forEach(s => {
    const price = PLANS[s.plan]?.price || 0;
    mrr += price;
  });

  const totalRevenue = txns.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    totalStores: stores.length,
    activeStoresCount: activeStores.length,
    suspendedStoresCount: suspendedStores.length,
    mrr,
    totalRevenue,
    recentTransactions: txns.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
  };
};

export const deleteStore = (storeId) => {
  const stores = getStores();
  const filtered = stores.filter(s => s.id !== storeId);
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(filtered));
  return true;
};
