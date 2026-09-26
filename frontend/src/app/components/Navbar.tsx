import { Menu, Package, Search, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { HarishClothsLogo } from './HarishClothsLogo';

interface NavbarProps { onCartIconReady?: (element: HTMLElement) => void; }
const categories = ['Straight Suits', 'Indo Westerns', 'Sharara Suits', 'Anarkali'];

export function Navbar({ onCartIconReady }: NavbarProps) {
  const { totalItems } = useCart();
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const [previousTotal, setPreviousTotal] = useState(totalItems);
  const [bounce, setBounce] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => { if (cartButtonRef.current && onCartIconReady) onCartIconReady(cartButtonRef.current); }, [onCartIconReady]);
  useEffect(() => {
    if (totalItems > previousTotal) {
      setBounce(true);
      const timer = window.setTimeout(() => setBounce(false), 600);
      setPreviousTotal(totalItems);
      return () => window.clearTimeout(timer);
    }
    setPreviousTotal(totalItems);
  }, [previousTotal, totalItems]);

  const search = () => {
    const query = window.prompt('What are you looking for?');
    if (query?.trim()) navigate(`/?view=all&search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#fffdf9] text-[#211b18]">
      <div className="flex h-8 items-center justify-center bg-[#211b18] px-4 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white sm:text-[11px]">Free shipping across India on orders above ₹1,999</div>
      <div className="border-b border-[#ded8d1]">
        <div className="relative mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-4 sm:px-8">
          <button type="button" onClick={() => window.dispatchEvent(new Event('toggle-filters'))} className="inline-flex size-10 items-center justify-center transition-colors hover:text-[#9a6444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a6444]" aria-label="Open shop menu and filters"><Menu className="size-[21px]" strokeWidth={1.4} /></button>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-75" aria-label="Siddhi Fashion home"><HarishClothsLogo className="h-14 w-auto sm:h-16" /></Link>
          <div className="flex items-center gap-0.5 sm:gap-2">
            <button type="button" onClick={search} className="inline-flex size-10 items-center justify-center hover:text-[#9a6444]" aria-label="Search products"><Search className="size-5" strokeWidth={1.4} /></button>
            <Link to="/my-orders" className="hidden size-10 items-center justify-center hover:text-[#9a6444] sm:inline-flex" aria-label="Track your order"><Package className="size-5" strokeWidth={1.4} /></Link>
            <Link to="/cart" aria-label={`Cart with ${totalItems} items`}><motion.div ref={cartButtonRef} animate={bounce ? { scale: [1, 1.25, 1] } : {}} className="relative flex size-10 items-center justify-center hover:text-[#9a6444]"><ShoppingBag className="size-5" strokeWidth={1.4} />{totalItems > 0 && <span className="absolute right-0.5 top-0.5 flex size-[17px] items-center justify-center rounded-full bg-[#9a6444] text-[9px] font-semibold text-white">{totalItems > 99 ? '99+' : totalItems}</span>}</motion.div></Link>
          </div>
        </div>
      </div>
      <nav className="hidden h-11 items-center justify-center gap-9 border-b border-[#e9e4de] bg-white text-[11px] font-medium uppercase tracking-[0.16em] md:flex" aria-label="Primary navigation">
        <Link to="/" className={pathname === '/' ? 'text-[#9a6444]' : 'hover:text-[#9a6444]'}>Home</Link>
        <Link to="/?view=all" className="hover:text-[#9a6444]">New arrivals</Link>
        {categories.map((category) => <Link key={category} to={`/?category=${category}`} className="hover:text-[#9a6444]">{category}</Link>)}
        <Link to="/?sale=true" className="text-[#a34539] hover:text-[#70291f]">Sale</Link>
      </nav>
    </header>
  );
}
