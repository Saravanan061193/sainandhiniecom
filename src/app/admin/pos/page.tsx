"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Printer,
    CheckCircle2,
    Loader2,
    CreditCard,
    ChevronRight,
    LayoutGrid,
    Package,
    UserPlus,
    UserCheck,
    ArrowLeft,
    Percent,
    Calculator,
    X,
    Filter,
    Tags,
    History,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    _id: string;
    name: string;
    image?: string;
}

interface Variant {
    uom: string;
    price: number;
    stock: number;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    variants: Variant[];
    stock: number;
}

interface CartItem {
    product: Product;
    uom: string;
    price: number;
    qty: number;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

export default function POSTerminal() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
    const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);

    // Cart & Checkout States
    const [cart, setCart] = useState<CartItem[]>([]);
    const [view, setView] = useState<'terminal' | 'success'>('terminal');
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Customer Info
    const [phoneSearch, setPhoneSearch] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });
    const [discount, setDiscount] = useState<number>(0);
    const [isDiscountPercent, setIsDiscountPercent] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [collectedAmount, setCollectedAmount] = useState<string>("");

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                fetch("/api/admin/categories"),
                fetch("/api/products")
            ]);
            const catData = await catRes.json();
            const prodData = await prodRes.json();
            setCategories([{ _id: "All", name: "All Items" }, ...catData]);
            setProducts(prodData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product, variant?: Variant) => {
        const uom = variant ? variant.uom : "pcs";
        const price = variant ? variant.price : product.price;

        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id && item.uom === uom);
            if (existing) {
                return prev.map(item =>
                    (item.product._id === product._id && item.uom === uom)
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prev, { product, uom, price, qty: 1 }];
        });
        setSelectedProductForVariant(null);
    };

    const updateQty = (productId: string, uom: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product._id === productId && item.uom === uom) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string, uom: string) => {
        setCart(prev => prev.filter(item => !(item.product._id === productId && item.uom === uom)));
    };

    const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const taxRate = 0.05; // 5% GST
    const calculateTax = () => calculateSubtotal() * taxRate;

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        if (isDiscountPercent) return (subtotal * discount) / 100;
        return discount;
    };

    const calculateTotal = () => Math.max(0, calculateSubtotal() + calculateTax() - calculateDiscount());

    const searchCustomer = async () => {
        if (!phoneSearch || phoneSearch.length < 10) return;
        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/customers?phone=${phoneSearch}`);
            const data = await res.json();
            setCustomer(data);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            let finalCustomerId = customer?._id;

            if (!customer && newCustomer.name && newCustomer.email) {
                const regRes = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newCustomer,
                        phone: phoneSearch,
                        password: "POS_GUEST_ACCOUNT"
                    })
                });
                if (regRes.ok) {
                    const searchRes = await fetch(`/api/admin/customers?phone=${phoneSearch}`);
                    const searchData = await searchRes.json();
                    finalCustomerId = searchData._id;
                }
            }

            const totalAmount = calculateTotal();
            const collected = parseFloat(collectedAmount || "0");
            const isFullyPaid = collected >= totalAmount;

            const orderPayload = {
                orderItems: cart.map(item => ({
                    productId: item.product._id,
                    name: `${item.product.name} (${item.uom})`,
                    qty: item.qty,
                    image: item.product.images[0] || "",
                    price: item.price
                })),
                shippingAddress: {
                    fullName: customer?.name || newCustomer.name || "Walk-in Customer",
                    email: customer?.email || newCustomer.email || "pos@store.com",
                    phone: phoneSearch || "0000000000",
                    address: "Counter Sale",
                    city: "Chennai",
                    pincode: "600000"
                },
                paymentMethod: "Cash",
                itemsPrice: calculateSubtotal(),
                taxPrice: calculateTax(),
                shippingPrice: 0,
                totalPrice: totalAmount,
                discountPrice: calculateDiscount(),
                isPaid: isFullyPaid,
                paidAt: isFullyPaid ? new Date() : null,
                isDelivered: true,
                deliveredAt: new Date(),
                customerId: finalCustomerId
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();
            if (res.ok) {
                setLastOrderId(data._id);
                setCart([]);
                setView('success');
                setTimeout(() => {
                    window.open(`/orders/${data._id}/invoice?format=thermal`, '_blank');
                }, 500);
            } else {
                alert("Order failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Checkout failed");
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategoryId === "All" || p.category === selectedCategoryId;
            const matchesSearch = search ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, search]);

    if (view === 'success') {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-8 bg-[#FAF9F6] rounded-[3rem] shadow-xl p-20">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl">
                    <CheckCircle2 size={48} />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-black text-primary-dark mb-4">Transaction Successful!</h1>
                    <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">Receipt: <span className="text-primary-dark font-black">#{lastOrderId?.slice(-8).toUpperCase()}</span></p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setView('terminal'); setCustomer(null); setPhoneSearch(""); setDiscount(0); setCollectedAmount(""); setNewCustomer({ name: "", email: "" }); }}
                        className="px-12 py-5 bg-primary-dark text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all"
                    >
                        Scan Next Bill
                    </button>
                    <button
                        onClick={() => window.open(`/orders/${lastOrderId}/invoice?format=thermal`, '_blank')}
                        className="px-12 py-5 bg-white border border-gray-200 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <Printer size={18} /> Print Last Receipt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] w-full gap-3 overflow-hidden bg-[#FAF9F6] p-3">
            {/* 1. Category Navigation (High Density) */}
            <div className="w-[140px] flex-shrink-0 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                <p className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">Departments</p>
                {categories.map(cat => (
                    <button
                        key={cat._id}
                        onClick={() => setSelectedCategoryId(cat.name === "All Items" ? "All" : cat.name)}
                        className={`text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${(selectedCategoryId === "All" && cat.name === "All Items") || selectedCategoryId === cat.name
                            ? 'bg-primary-dark border-primary-dark text-white shadow-md'
                            : 'bg-white border-transparent text-gray-500 hover:bg-white/80 shadow-sm'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 2. Product Matrix (Highest Density) */}
            <div className="flex-grow flex flex-col gap-3 min-w-0">
                {/* Search / Scan Line */}
                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Scan Barcode or Search Product..."
                        className="flex-grow outline-none font-bold text-sm text-primary-dark"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex gap-1.5 pr-1.5">
                        <button className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:text-primary transition-colors"><Tags size={16} /></button>
                        <button className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:text-primary transition-colors"><Zap size={16} /></button>
                    </div>
                </div>

                {/* Grid - 12-16 items visible without scroll on typical screens */}
                <div className="flex-grow overflow-y-auto pr-1 no-scrollbar">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                        {loading ? (
                            Array(12).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-white rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            filteredProducts.map(product => {
                                const isLowStock = product.stock < 10;
                                return (
                                    <button
                                        key={product._id}
                                        onClick={() => {
                                            if (product.variants?.length > 0) setSelectedProductForVariant(product);
                                            else addToCart(product);
                                        }}
                                        className="bg-white p-2.5 rounded-2xl border-2 border-transparent hover:border-primary hover:shadow-lg transition-all text-left flex flex-col group active:scale-[0.97] relative"
                                    >
                                        <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden relative">
                                            <img
                                                src={product.images[0] || "/placeholder.png"}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            {product.variants?.length > 0 && (
                                                <div className="absolute top-1 right-1 bg-primary-dark/80 text-[7px] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                                                    Variants
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-[10px] uppercase leading-tight line-clamp-2 min-h-[1.5rem] tracking-tight">{product.name}</h3>
                                        <div className="mt-1.5 flex justify-between items-end">
                                            <span className="font-black text-primary-dark text-xs">₹{product.price}</span>
                                            <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full ${isLowStock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                STK: {product.stock}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Operational Bill (Dominant Right Panel) */}
            <div className="w-[400px] flex-shrink-0 bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden rounded-[2rem]">
                {/* Fixed Header */}
                <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <h2 className="font-serif font-black text-base text-primary-dark">Current Bill</h2>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Session • Term-01</p>
                        </div>
                    </div>
                    <button onClick={() => setCart([])} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>

                {/* Scrollable Items Panel */}
                <div className="flex-grow overflow-y-auto p-4 space-y-2 no-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 opacity-40">
                            <Calculator size={48} strokeWidth={1} />
                            <p className="font-black uppercase tracking-widest text-[9px]">Awaiting Items...</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <motion.div
                                layout
                                key={`${item.product._id}-${item.uom}`}
                                className="flex gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-50 group hover:bg-white transition-colors"
                            >
                                <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                    <img src={item.product.images[0]} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-[10px] text-primary-dark uppercase truncate w-[180px]">{item.product.name}</h4>
                                            <span className="text-[8px] font-black text-gray-400 uppercase">{item.uom}</span>
                                        </div>
                                        <span className="font-black text-primary-dark text-xs">₹{item.price * item.qty}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                            <button onClick={() => updateQty(item.product._id, item.uom, -1)} className="hover:text-primary text-gray-400"><Minus size={12} /></button>
                                            <span className="text-[10px] font-black w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.product._id, item.uom, 1)} className="hover:text-primary text-gray-400"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product._id, item.uom)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Total & Action (Always Visible) */}
                <div className="bg-gray-50 p-5 border-t border-gray-100 space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="tel"
                            placeholder="Customer Phone No..."
                            className="flex-grow bg-white border border-gray-200 p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20"
                            value={phoneSearch}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                        />
                        <button onClick={searchCustomer} className="px-3 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                            {customer ? <CheckCircle2 size={16} className="text-green-500" /> : 'Find'}
                        </button>
                    </div>

                    {!customer && phoneSearch.length >= 10 && (
                        <input
                            type="text"
                            placeholder="Customer Name (Optional)"
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                    )}

                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Collected Amount</label>
                        <div className="flex items-center gap-2">
                            <span className="text-primary-dark font-black text-lg">₹</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-transparent border-none text-2xl font-black text-primary-dark outline-none placeholder:text-gray-300"
                                value={collectedAmount}
                                onChange={(e) => setCollectedAmount(e.target.value)}
                            />
                        </div>
                        {parseFloat(collectedAmount || "0") > calculateTotal() && (
                            <div className="mt-2 pt-2 border-t border-primary/10 flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Change Return:</span>
                                <span className="text-sm font-black text-green-600">₹{(parseFloat(collectedAmount || "0") - calculateTotal()).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5 px-1">
                        <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Subtotal / TAX (5%)</span>
                            <span>₹{calculateSubtotal().toFixed(2)} / ₹{calculateTax().toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[9px] font-black text-red-500 uppercase tracking-widest">
                                <span>Total Savings</span>
                                <span>-₹{calculateDiscount().toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-2 flex justify-between items-center text-primary-dark">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase">NET PAYABLE:</span>
                                <span className="text-3xl font-black tracking-tighter">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <button onClick={() => setIsDiscountPercent(!isDiscountPercent)} className="w-8 h-8 rounded-lg border border-gray-200 text-[10px] font-black text-gray-400 hover:border-primary">%</button>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] hover:shadow-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-4 group"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : (
                            <>
                                <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
                                <span>PAY ₹{calculateTotal().toFixed(2)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Variant Selector (Quick Action) */}
            <AnimatePresence>
                {selectedProductForVariant && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                            onClick={() => setSelectedProductForVariant(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[101] p-8"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-serif font-black text-primary-dark uppercase tracking-tight">{selectedProductForVariant.name}</h3>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Select Measurement Batch</p>
                                </div>
                                <button onClick={() => setSelectedProductForVariant(null)} className="p-2 text-gray-300 hover:text-primary"><X size={20} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedProductForVariant.variants.map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => addToCart(selectedProductForVariant, v)}
                                        className="bg-gray-50 border-2 border-transparent hover:border-primary hover:bg-primary/5 p-5 rounded-2xl text-left transition-all active:scale-95 flex flex-col gap-0.5"
                                    >
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{v.uom}</p>
                                        <p className="text-lg font-black text-primary-dark">₹{v.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
