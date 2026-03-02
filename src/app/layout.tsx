import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './lib/store';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Affinity Workforce Platform',
  description: 'Premium cleaning company workforce management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-slate-900 overflow-x-hidden">
        <AuthProvider>
          <div className="flex justify-center items-start min-h-screen">
            {/* Simulation of a mobile phone container for the demo */}
            <div className="w-full max-w-[480px] min-h-screen bg-background shadow-2xl relative overflow-hidden flex flex-col">
              {children}
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
