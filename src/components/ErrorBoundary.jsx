/**
 * ErrorBoundary – catches React render errors and shows a fallback UI.
 */
import React from 'react';
import { MdErrorOutline, MdRefresh } from 'react-icons/md';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center p-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <MdErrorOutline size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg mb-6 max-w-md truncate">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <MdRefresh size={18} /> Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
