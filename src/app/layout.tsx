import type { Metadata } from "next";
import "./style.css";

export const metadata: Metadata = {
  title: "My react-hook-form and Yup",
  description: "react-hook-formとYupで作ったフォームのサンプルです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="wrapper">
          <h1 className="title">my react-hook-form and Yup</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
