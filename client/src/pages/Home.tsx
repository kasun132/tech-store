import { useEffect, useMemo, useState } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { categories, fallbackImages, initialCatalog, money, type Category, type Product, whatsappNumber } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Mic, ShoppingBag, MessageSquare, Terminal, Upload, Save, X, Zap, Headphones, Cable, Smartphone, Radio, Bot, SlidersHorizontal, ChevronRight } from "lucide-react";


export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [catalog, setCatalog] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem("sakith-catalog") || "null") || initialCatalog; } catch { return initialCatalog; }
  });
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([{ role: "assistant", content: "SYSTEM ONLINE. Tell me what accessory you need and I’ll route you to the right module." }]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [source, setSource] = useState(() => localStorage.getItem("sakith-source") || "<!-- Sakith Tech Store custom source area -->\n<!-- Add the word magenta to switch the storefront accent. -->");
  const [initializationRequested, setInitializationRequested] = useState(false);
  const persistentCatalog = trpc.catalog.list.useQuery();
  const persistentSettings = trpc.catalog.settings.useQuery();
  const initializeCatalog = trpc.catalog.initialize.useMutation({ onSuccess: data => { if (data.length) { setCatalog(data as Product[]); localStorage.setItem("sakith-catalog", JSON.stringify(data)); } } });
  const saveCatalogProduct = trpc.catalog.save.useMutation({ onSuccess: saved => { if (saved) { setCatalog(current => { const withoutOld = current.filter(product => product.id !== editingProduct?.id && product.id !== saved.id); const next = [...withoutOld, saved as Product]; localStorage.setItem("sakith-catalog", JSON.stringify(next)); return next; }); } } });
  const saveSourceOverride = trpc.catalog.saveSettings.useMutation();

  useEffect(() => {
    if (persistentCatalog.data?.length) {
      setCatalog(persistentCatalog.data as Product[]);
      localStorage.setItem("sakith-catalog", JSON.stringify(persistentCatalog.data));
    } else if (persistentCatalog.data && !initializationRequested) {
      setInitializationRequested(true);
      initializeCatalog.mutate({ products: initialCatalog.map(({ id: _id, ...product }) => product) });
    }
  }, [persistentCatalog.data]);

  useEffect(() => {
    if (persistentSettings.data?.sourceOverride) setSource(persistentSettings.data.sourceOverride);
  }, [persistentSettings.data]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = catalog.filter(product => (activeCategory === "ALL" || product.category === activeCategory) && (!normalized || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id);
  }, [activeCategory, catalog, query, sort]);

  const persistCatalog = (next: Product[]) => { setCatalog(next); localStorage.setItem("sakith-catalog", JSON.stringify(next)); };
  const whatsappLink = (product: Product) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Sakith Tech Store, I want to order: ${product.name} (${money(product.price)}). Please confirm availability.`)}`;

  const startVoiceSearch = () => {
    const Recognition = (window as typeof window & { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (!Recognition) { setVoiceText("Voice search unavailable in this browser"); return; }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = event => { const text = Array.from(event.results).map(result => result[0].transcript).join(""); setVoiceText(text); setQuery(text); };
    recognition.onerror = () => setVoiceText("No signal — try again");
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const aiChat = trpc.ai.chat.useMutation({ onSuccess: result => setChatMessages(messages => [...messages, { role: "assistant", content: result.text }]) });
  const uploadImage = trpc.media.uploadImage.useMutation();
  const sendChat = () => {
    const text = chatInput.trim(); if (!text || aiChat.isPending) return;
    setChatMessages(messages => [...messages, { role: "user", content: text }]); setChatInput("");
    aiChat.mutate({ message: text, catalog: catalog.slice(0, 80).map(p => `${p.name} | ${p.category} | ${money(p.price)}`) });
  };

  const saveProduct = () => { if (!editingProduct) return; const exists = catalog.some(product => product.id === editingProduct.id); const localNext = exists ? catalog.map(product => product.id === editingProduct.id ? editingProduct : product) : [...catalog, editingProduct]; persistCatalog(localNext); saveCatalogProduct.mutate(exists ? editingProduct : { ...editingProduct, id: undefined }); setEditingProduct(null); };
  const uploadPreview = (file: File) => { if (!editingProduct) return; const reader = new FileReader(); reader.onload = async () => { const base64 = String(reader.result); try { const uploaded = await uploadImage.mutateAsync({ fileName: file.name, contentType: file.type, base64 }); setEditingProduct(current => current ? { ...current, image: uploaded.url } : current); } catch { /* Keep the existing storage-backed image when upload fails. */ } }; reader.readAsDataURL(file); };

  const customAccent = source.toLowerCase().includes("magenta") ? "#ff45c0" : "#54ddff";
  const startNewProduct = () => setEditingProduct({ id: Math.max(...catalog.map(product => product.id), 0) + 1, name: "NEW MODULE // MK-01", category: activeCategory === "ALL" ? "Chargers" : activeCategory, price: 1290, image: fallbackImages[activeCategory === "ALL" ? "Chargers" : activeCategory], tag: "NEW", description: "New owner-added accessory module." });

  return <div className="store-shell" style={{ "--custom-accent": customAccent } as React.CSSProperties}>
    <div className="scanline-overlay" />
    <header className="site-header">
      <div className="brand-lockup"><div className="brand-mark">ST<span>_</span></div><div><div className="brand-name">SAKITH TECH STORE</div><div className="brand-status">// ACCESSORY GRID // ONLINE</div></div></div>
      <nav className="header-links"><a href="#catalog">CATALOG</a><a href="#signal">SIGNAL</a><button className="text-button" onClick={() => setSourceOpen(true)}>SOURCE</button></nav>
      <div className="header-actions"><span className="system-pill"><i /> SYSTEMS NOMINAL</span><button className="icon-button" onClick={() => setChatOpen(true)} aria-label="Open AI shopping assistant"><MessageSquare size={18} /></button></div>
    </header>

    <main>
      <section className="hero-section" id="signal">
        <div className="hero-copy"><div className="eyebrow"><span>ERR_001</span> / DEVICE ACCESSORY DEPOT</div><h1>POWER UP<br /><em>YOUR SIGNAL.</em></h1><p>Chargers, cases, cables and audio hardware for the next version of you. Browse the grid. Find your upgrade.</p><div className="hero-buttons"><a href="#catalog" className="primary-button">ENTER CATALOG <ChevronRight size={17} /></a><button className="outline-button" onClick={() => setChatOpen(true)}><Bot size={17} /> ASK THE SYSTEM</button></div></div>
        <div className="hero-visual"><div className="orbital-ring ring-a" /><div className="orbital-ring ring-b" /><div className="core-device"><div className="core-label">S_T / 2026</div><div className="core-bars"><span /><span /><span /><span /><span /></div><div className="core-symbol">✦</div></div><div className="floating-code code-a">0x7A // PWR</div><div className="floating-code code-b">SYNC: 100%</div></div>
      </section>

      <section className="category-strip" aria-label="Product categories">{categories.map(({ name, icon: Icon, code }) => <button key={name} className={`category-tile ${activeCategory === name ? "selected" : ""}`} onClick={() => { setActiveCategory(name); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}><Icon size={21} /><span>{name}</span><small>{code} // 050</small></button>)}</section>

      <section className="catalog-section" id="catalog"><div className="section-heading"><div><div className="eyebrow">// INVENTORY SCAN COMPLETE</div><h2>{activeCategory === "ALL" ? "ALL MODULES" : activeCategory.toUpperCase()}</h2></div><span className="result-count">{filteredProducts.length} RESULTS / 250 TOTAL</span></div>
        <div className="search-bar"><Search size={19} /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products, categories, model codes..." /><button className={`voice-trigger ${isListening ? "listening" : ""}`} onClick={startVoiceSearch}><Mic size={18} /> {isListening ? "LISTENING" : "VOICE SEARCH"}</button><button className="filter-trigger" onClick={() => setSort(sort === "featured" ? "low" : sort === "low" ? "high" : "featured")}><SlidersHorizontal size={17} /> {sort === "featured" ? "FEATURED" : sort === "low" ? "LOW → HIGH" : "HIGH → LOW"}</button></div>{voiceText && <div className="voice-transcript"><Mic size={13} /> TRANSCRIPT: “{voiceText}” <button onClick={() => setVoiceText("")}><X size={13} /></button></div>}
        <div className="product-grid">{filteredProducts.map(product => <article className="product-card" key={product.id}><div className="product-image-wrap"><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><span className="product-code">#{String(product.id).padStart(3, "0")}</span></div><div className="product-info"><div className="product-category">{product.category} / READY STOCK</div><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><strong>{money(product.price)}</strong><a className="whatsapp-button" href={whatsappLink(product)} target="_blank" rel="noreferrer">Order Now on WhatsApp</a></div><button className="edit-product" onClick={() => setEditingProduct(product)}>EDIT MODULE</button></div></article>)}</div>
      </section>

      <section className="owner-panel"><div><div className="eyebrow">// OWNER CONSOLE</div><h2>MAKE THE GRID YOURS.</h2><p>Update product details, replace imagery, and save your catalog locally while you shape the live storefront.</p></div><div className="owner-actions"><button className="outline-button" onClick={startNewProduct}><Upload size={17} /> ADD PRODUCT</button><button className="outline-button" onClick={() => setEditingProduct(catalog[0])}><Upload size={17} /> EDIT PRODUCTS</button><button className="outline-button" onClick={() => setSourceOpen(true)}><Terminal size={17} /> OPEN SOURCE AREA</button></div></section>
    </main>

    <footer><div className="brand-name">SAKITH TECH STORE</div><span>© 2026 / BUILD_001 / SRI LANKA</span><span>WHATSAPP: 075 937 5358</span></footer>

    {chatOpen && <div className="chat-drawer"><div className="chat-header"><div><Bot size={18} /> SHOPPING ASSISTANT</div><button onClick={() => setChatOpen(false)}><X size={18} /></button></div><AIChatBox messages={chatMessages} onSendMessage={text => { setChatMessages(messages => [...messages, { role: "user", content: text }]); aiChat.mutate({ message: text, catalog: catalog.slice(0, 80).map(p => `${p.name} | ${p.category} | ${money(p.price)}`) }); }} isLoading={aiChat.isPending} height="450px" placeholder="Ask about chargers, audio..." suggestedPrompts={["Find a charger for travel", "What earbuds are ready?"]} /></div>}

    {editingProduct && <Dialog open={Boolean(editingProduct)} onOpenChange={open => !open && setEditingProduct(null)}><DialogContent className="editor-dialog"><DialogHeader><DialogTitle>EDIT MODULE // #{editingProduct.id}</DialogTitle></DialogHeader><div className="editor-grid"><label>Product name<Input value={editingProduct.name} onChange={event => setEditingProduct({ ...editingProduct, name: event.target.value })} /></label><label>Price (LKR)<Input type="number" value={editingProduct.price} onChange={event => setEditingProduct({ ...editingProduct, price: Number(event.target.value) })} /></label><label className="wide">Description<Textarea value={editingProduct.description} onChange={event => setEditingProduct({ ...editingProduct, description: event.target.value })} /></label><label className="wide">Product image<input type="file" accept="image/*" onChange={event => event.target.files?.[0] && uploadPreview(event.target.files[0])} /></label><img className="editor-preview" src={editingProduct.image} alt="Preview" /></div><Button className="save-button" onClick={saveProduct}><Save size={16} /> SAVE MODULE</Button></DialogContent></Dialog>}

    {sourceOpen && <Dialog open={sourceOpen} onOpenChange={setSourceOpen}><DialogContent className="source-dialog"><DialogHeader><DialogTitle>SOURCE AREA // CUSTOM OVERRIDES</DialogTitle></DialogHeader><p className="source-note">Write and save your custom HTML/CSS notes here. The area is persisted in this browser for your next storefront iteration.</p><Textarea className="source-editor" value={source} onChange={event => setSource(event.target.value)} /><Button onClick={() => { localStorage.setItem("sakith-source", source); saveSourceOverride.mutate({ sourceOverride: source }); setSourceOpen(false); }}><Save size={16} /> SAVE SOURCE</Button></DialogContent></Dialog>}
  </div>;
}

type SpeechRecognition = { lang: string; interimResults: boolean; onstart: (() => void) | null; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };


