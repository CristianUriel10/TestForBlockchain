export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  images: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  parking: number;
  isNFT?: boolean;
  walletAddress?: string;
  favorited?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletConnected: boolean;
  walletAddress?: string;
  favorites: string[];
  savedSearches: SavedSearch[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFilters;
  createdAt: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  status?: string;
  location?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}

export interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: boolean;
  connect: () => Promise<void>;
}

// Extend window object for MetaMask
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener?: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}