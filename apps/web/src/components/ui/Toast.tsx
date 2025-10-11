import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import toast, { Toaster as HotToaster, ToastBar } from 'react-hot-toast';

// Toast options type
type ToastOptions = Record<string, unknown>;

// Toast notification function with variants
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: 4000,
      icon: <CheckCircle2 className="h-5 w-5 text-accent-green" />,
      ...options,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: 5000,
      icon: <XCircle className="h-5 w-5 text-accent-red" />,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: 4000,
      icon: <AlertCircle className="h-5 w-5 text-accent-orange" />,
      ...options,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: 4000,
      icon: <Info className="h-5 w-5 text-accent-blue" />,
      ...options,
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};

// Toaster component with District.in styling
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: '',
        duration: 4000,
        style: {
          background: 'transparent',
          padding: 0,
          boxShadow: 'none',
        },
        // Success
        success: {
          style: {
            background: 'transparent',
          },
          iconTheme: {
            primary: '#00E676',
            secondary: '#0A0A0F',
          },
        },
        // Error
        error: {
          style: {
            background: 'transparent',
          },
          iconTheme: {
            primary: '#FF3B30',
            secondary: '#0A0A0F',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border backdrop-blur-xl shadow-lg shadow-primary-500/10 transition-all duration-200',
                'bg-dark-card border-dark-border',
                t.visible ? 'animate-in slide-in-from-top-5' : 'animate-out slide-out-to-right-full'
              )}
            >
              <div className="flex-shrink-0">{icon}</div>
              <div className="flex-1 text-sm font-medium text-white">
                {message}
              </div>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-dark-hover transition-colors"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
}

// Export the base toast function for custom usage
export { toast };
