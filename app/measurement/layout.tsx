// app/measurement/layout.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MeasurementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-3 px-4">
          <Link 
            href="/" 
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="border-t bg-white py-4 mt-8">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          Sensor Deck Dashboard © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}