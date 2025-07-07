import "./globals.css";
import { ClerkProvider,} from '@clerk/nextjs'


export const metadata = {
  title: "My Show Bucket List",
  description: "Movies & TV Shows Bucket List web app developed with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
