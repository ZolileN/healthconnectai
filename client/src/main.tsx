import { createRoot } from "react-dom/client";
import { AuthProvider } from '@/contexts/auth-context';
import App from "./App";
import "./index.css";

// Start the mocking conditionally in development
const prepare = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
};

prepare().then(() => {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});