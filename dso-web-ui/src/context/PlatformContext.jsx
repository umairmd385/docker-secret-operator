import React, { createContext, useContext, useState, useEffect } from 'react';
import { dsoApi } from '../services/api';

const ProviderContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [activeProvider, setActiveProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const refreshProvider = async () => {
    setLoading(true);
    const data = await dsoApi.getProvider();
    setActiveProvider(data);
    setLoading(false);
  };

  const switchProvider = async (id) => {
    dsoApi.switchProvider(id);
    await refreshProvider();
    addNotification(`Switched to ${id.toUpperCase()} provider.`);
  };

  const addNotification = (msg) => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg, time: 'Just now' }, ...prev].slice(0, 5));
    // Auto-remove after 5s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    refreshProvider();
  }, []);

  return (
    <ProviderContext.Provider value={{ 
      activeProvider, 
      loading, 
      refreshProvider, 
      switchProvider,
      notifications,
      addNotification 
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const usePlatform = () => useContext(ProviderContext);
