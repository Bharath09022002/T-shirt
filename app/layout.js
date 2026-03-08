import "./globals.css";

export const metadata = {
    title: "ÉLEV — Premium Cotton T-Shirt",
    description: "Discover the ÉLEV Premium Cotton T-Shirt. Crafted for comfort, designed for style. Breathable fabric, premium stitching, and a luxurious feel.",
    keywords: ["premium t-shirt", "cotton", "fashion", "luxury", "clothing"],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
