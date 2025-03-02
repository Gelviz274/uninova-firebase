export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <main className="font-sans antialiased">
          {children}
        </main>
      </>
    );
  }
  