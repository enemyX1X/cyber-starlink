import './globals.css';

export const metadata = {
  title: 'Cyber Starlink',
  description: 'Next-Gen Intelligence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
