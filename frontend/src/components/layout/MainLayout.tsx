// Main layout component
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../../store/store';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '../../utils/cn';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen, sidebarCollapsed, theme, layout } = useSelector(
    (state: RootState) => state.ui
  );

  return (
    <div className={cn('min-h-screen bg-background', theme)}>
      <div className={cn('flex h-screen', layout === 'boxed' && 'max-w-7xl mx-auto')}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            sidebarOpen && !sidebarCollapsed && 'ml-64',
            sidebarOpen && sidebarCollapsed && 'ml-16',
            !sidebarOpen && 'ml-0'
          )}
        >
          {/* Header */}
          <Header />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;