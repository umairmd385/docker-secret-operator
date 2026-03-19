import React, { createContext, useContext, useState, useEffect } from 'react';
import { dsoApi } from '../services/api';

const ProviderContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [activeProvider, setActiveProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [environment, setEnvironment] = useState('dev');
  const [notifications, setNotifications] = useState([]);

  const refreshProvider = async () => {
    setLoading(true);
    try {
      const data = await dsoApi.getProvider(environment);
      setActiveProvider(data);
      setGlobalError(null);
    } catch (err) {
      setGlobalError(err.message || 'Failed to fetch provider state');
    } finally {
      setLoading(false);
    }
  };

  const switchProvider = async (id) => {
    dsoApi.switchProvider(id);
    await refreshProvider();
    addNotification(`Switched to ${id.toUpperCase()} provider in ${environment.toUpperCase()}.`);
  };

  const changeEnvironment = async (env) => {
    setEnvironment(env);
    addNotification(`Environment changed to ${env.toUpperCase()}`);
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
  }, [environment]);

  return (
    <ProviderContext.Provider value={{ 
      activeProvider, 
      loading, 
      globalError,
      environment,
      changeEnvironment,
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
