import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '../types';

/**
 * Custom hook for managing MetaMask wallet connection
 * @returns {object} Wallet state and connection functions
 */
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
  });

  /**
   * Check if MetaMask is installed
   */
  const isMetaMaskInstalled = useCallback((): boolean => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask === true;
  }, []);

  /**
   * Get accounts from MetaMask
   */
  const getAccounts = useCallback(async (): Promise<string[]> => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_accounts',
      });
      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }, [isMetaMaskInstalled]);

  /**
   * Request account access from MetaMask
   */
  const requestAccounts = useCallback(async (): Promise<string[]> => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });
      return accounts;
    } catch (error) {
      console.error('Error requesting accounts:', error);
      throw error;
    }
  }, [isMetaMaskInstalled]);

  /**
   * Connect to MetaMask wallet
   */
  const connectWallet = useCallback(async (): Promise<void> => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
        isConnecting: false,
      }));
      return;
    }

    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const accounts = await requestAccounts();
      
      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
        });
      } else {
        throw new Error('No accounts found');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setWalletState({
        isConnected: false,
        address: null,
        isConnecting: false,
        error: errorMessage,
      });
    }
  }, [isMetaMaskInstalled, requestAccounts]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback((): void => {
    setWalletState({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  /**
   * Format wallet address for display (0xabc...123)
   */
  const formatAddress = useCallback((address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  /**
   * Check for existing connection on component mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await getAccounts();
          if (accounts.length > 0) {
            setWalletState({
              isConnected: true,
              address: accounts[0],
              isConnecting: false,
              error: null,
            });
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, getAccounts]);

  /**
   * Listen for account changes
   */
  useEffect(() => {
    if (isMetaMaskInstalled() && window.ethereum?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          // User switched accounts
          setWalletState(prev => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            error: null,
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [isMetaMaskInstalled, disconnectWallet, walletState.address]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};
