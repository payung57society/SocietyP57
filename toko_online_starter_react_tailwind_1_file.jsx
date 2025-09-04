import React, { useMemo, useState } from "react";
import { ShoppingCart, Search, Filter, X, Plus, Minus, Check, Trash2, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Helper: currency IDR formatter
const formatIDR = (num) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

// --- Mock data (ganti sesuai produkmu)
const CATEGORIES = ["Semua", "Fashion", "Gadget", "Aksesoris", "Kecantikan"];

const PRODUCTS = [
  {
    id: "p1",
    name: "Hoodie Essential Oversize",
    price: 199000,
    rating: 4.7,
    image: "https://picsum.photos/seed/hoodie/800/800",
    category: "Fashion",
    tags: ["Best Seller", "Baru"],
  },
  {
    id: "p2",
    name: "Earbuds TWS Pro",
    price: 349000,
    rating: 4.5,
    image: "https://picsum.photos/seed/earbuds/800/800",
    category: "Gadget",
    tags: ["Diskon"],
  },
  {
    id: "p3",
    name: "Jam Tangan Minimalis",
    price: 289000,
    rating: 4.6,
    image: "https://picsum.photos/seed/watch/800/800",
    category: "Aksesoris",
    tags: ["Limited"],
  },
  {
    id: "p4",
    name: "Serum Vitamin C",
    price: 159000,
    rating: 4.8,
    image: "https://picsum.photos/seed/serum/800/800",
    category: "Kecantikan",
    tags: ["Terlaris"],
  },
  {
    id: "p5",
    name: "Tas Selempang Canvas",
    price: 179000,
    rating: 4.4,
    image: "https://picsum.photos/seed/bag/800/800",
    category: "Aksesoris",
    tags: ["Baru"],
  },
  {
    id: "p6",
    name: "Kaos Basic Premium",
    price: 99000,
    rating: 4.3,
    image: "https://picsum.photos/seed/tshirt/800/800",
    category: "Fashion",
    tags: [],
  },
];

// --- Types
/** @typedef {{id:string,name:string,price:number,image:string,category:string,rating:number,tags:string[]}} Product */
/** @typedef {{id:string, qty:number}} CartItem */

export default function TokoOnlineStarter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");
  const [cart, setCart] = useState(/** @type {CartItem[]} */([]));
  const [openSheet, setOpenSheet] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      (category === "Semua" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === "harga-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "harga-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, category, sortBy]);

  const cartDetailed = useMemo(() => {
    return cart.map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id)! }));
  }, [cart]);

  const subtotal = useMemo(() => {
    return cartDetailed.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [cartDetailed]);

  const addToCart = (id) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id, qty: 1 }];
    });
    setOpenSheet(true);
  };

  const decQty = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const incQty = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white grid place-content-center font-bold">TO</div>
            <div>
              <div className="font-bold text-xl leading-none">TokoOnline</div>
              <div className="text-xs text-slate-500">Website jualan simpel & cepat</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk…"
                className="pl-9 rounded-2xl"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40 rounded-2xl"><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 rounded-2xl"><SelectValue placeholder="Urutkan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="terbaru">Terbaru</SelectItem>
                <SelectItem value="harga-asc">Harga: Termurah</SelectItem>
                <SelectItem value="harga-desc">Harga: Termahal</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button className="rounded-2xl" variant="default">
                <ShoppingCart className="h-4 w-4 mr-2" /> Keranjang ({cart.reduce((a, b) => a + b.qty, 0)})
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Keranjang</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {cartDetailed.length === 0 ? (
                  <div className="text-sm text-slate-500">Keranjang masih kosong.</div>
                ) : (
                  <div className="space-y-3">
                    {cartDetailed.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="h-16 w-16 object-cover rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.product.name}</div>
                          <div className="text-xs text-slate-500">{formatIDR(item.product.price)}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => decQty(item.id)}><Minus className="h-4 w-4" /></Button>
                            <div className="text-sm w-8 text-center">{item.qty}</div>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => incQty(item.id)}><Plus className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatIDR(item.product.price * item.qty)}</div>
                          <Button variant="ghost" size="icon" className="mt-2" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>Subtotal</div>
                        <div className="font-semibold">{formatIDR(subtotal)}</div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={clearCart}><Trash2 className="h-4 w-4 mr-2"/>Kosongkan</Button>
                        <Button className="rounded-xl"><Check className="h-4 w-4 mr-2"/>Checkout</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">Bangun Toko Online <span className="underline decoration-4">lebih cepat</span></h1>
            <p className="mt-4 text-slate-600 max-w-xl">Template 1 file yang simple, modern, dan siap dipakai. Tinggal ganti produk, hubungkan pembayaran, dan jualan jalan.</p>
            <div className="mt-6 flex gap-3">
              <a href="#katalog"><Button className="rounded-2xl">Lihat Katalog</Button></a>
              <Button variant="outline" className="rounded-2xl">Hubungi Admin</Button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-500 text-sm">
              <Star className="h-4 w-4"/> 4.8 rating dari 2.1k+ pelanggan
            </div>
          </div>
          <div className="relative">
            <img src="https://picsum.photos/seed/storefront/1200/800" alt="hero" className="w-full rounded-3xl shadow-2xl"/>
            <Badge className="absolute top-4 left-4 rounded-2xl">Gratis Ongkir*</Badge>
          </div>
        </div>
      </section>

      {/* Controls (mobile) */}
      <div className="md:hidden sticky top-[56px] z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Cari produk…" className="pl-9 rounded-2xl"/>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36 rounded-2xl"><SelectValue placeholder="Kategori"/></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 rounded-2xl"><SelectValue placeholder="Urutkan"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="harga-asc">Termurah</SelectItem>
              <SelectItem value="harga-desc">Termahal</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Catalog */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Produk Unggulan</h2>
          <div className="text-sm text-slate-500">{filtered.length} produk</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img src={p.image} alt={p.name} className="h-44 sm:h-56 w-full object-cover"/>
                <div className="absolute top-2 left-2 flex gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} className="rounded-xl text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{formatIDR(p.price)}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1"><Star className="h-3 w-3"/> {p.rating}</div>
                  </div>
                  <Button className="rounded-xl" onClick={() => addToCart(p.id)}>
                    <Plus className="h-4 w-4 mr-1"/> Keranjang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-6">
          <div>
            <div className="font-bold text-lg">TokoOnline</div>
            <p className="text-slate-600 mt-2">Template storefront sederhana untuk mulai jualan dari hari pertama.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Bantuan</div>
            <ul className="space-y-1 text-slate-600">
              <li>Panduan Belanja</li>
              <li>Kebijakan Pengembalian</li>
              <li>Kontak</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <ul className="space-y-1 text-slate-600">
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan Privasi</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Newsletter</div>
            <div className="flex gap-2">
              <Input placeholder="Email kamu" className="rounded-2xl"/>
              <Button className="rounded-2xl">Daftar</Button>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-500 mt-8">© {new Date().getFullYear()} TokoOnline. All rights reserved.</div>
      </footer>
    </div>
  );
}
