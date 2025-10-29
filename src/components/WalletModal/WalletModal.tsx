import React from 'react';
import { X, Wallet, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { WalletState } from '../../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
  formatAddress: (address: string) => string;
}

/**
 * Modal component for wallet connection
 * @param {WalletModalProps} props - Component properties
 * @returns {JSX.Element | null} Rendered modal or null if not open
 */
export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onConnectWallet,
  onDisconnectWallet,
  isMetaMaskInstalled,
  formatAddress,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {walletState.isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {walletState.isConnected ? (
            // Connected State
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Successfully Connected!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Your wallet is now connected to PropChain
              </p>

              {/* Wallet Address Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Connected Address:</p>
                <p className="font-mono text-lg font-medium text-gray-900">
                  {formatAddress(walletState.address!)}
                </p>
                <p className="text-xs text-gray-500 break-all mt-1">
                  {walletState.address}
                </p>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={onDisconnectWallet}
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            // Not Connected State
            <div>
              <p className="text-gray-600 text-center mb-6">
                Choose a wallet to connect to PropChain and access blockchain features.
              </p>

              {/* Error Display */}
              {walletState.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium">Connection Error</p>
                      <p className="text-red-700 text-sm mt-1">{walletState.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Options */}
              <div className="space-y-3">
                {/* MetaMask Option */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <Wallet className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">MetaMask</h3>
                        <p className="text-sm text-gray-600">
                          {isMetaMaskInstalled ? 'Connect using browser wallet' : 'Not installed'}
                        </p>
                      </div>
                    </div>
                    
                    {isMetaMaskInstalled ? (
                      <button
                        onClick={onConnectWallet}
                        disabled={walletState.isConnecting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 flex items-center"
                      >
                        {walletState.isConnecting ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    ) : (
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200 flex items-center"
                      >
                        Install
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Future wallet options can be added here */}
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Why connect a wallet?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Access NFT property features</li>
                  <li>• Secure blockchain transactions</li>
                  <li>• Participate in property investments</li>
                  <li>• Verify ownership and authenticity</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
