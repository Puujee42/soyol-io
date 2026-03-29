'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import AntiGravityCartItem from '@/components/cart/AntiGravityCartItem';
import TaobaoStickyFooter from '@/components/cart/TaobaoStickyFooter';
import UniversalProductCard from '@/components/UniversalProductCard';

export default function CartPage() {
    const { items, getTotalItems } = useCartStore();
    const { t } = useTranslation();

    const { data } = useSWR('/api/products?limit=4', (url) =>
        fetch(url).then(r => r.json())
    );
    const suggested = data?.products || [];

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] pt-20 pb-16 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent mix-blend-overlay pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-100/30 blur-[80px] pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="text-center w-full max-w-[400px] flex flex-col items-center px-6 relative z-10"
                >
                    {/* Premium Illustration Area */}
                    <div className="relative mb-10">
                        {/* Glow Behind */}
                        <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full scale-150" />
                        
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center rounded-[2rem] bg-white border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.04)] mx-auto overflow-hidden ring-1 ring-black/[0.02]"
                        >
                            {/* Inner gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent" />
                            <ShoppingBag className="w-12 h-12 sm:hidden text-orange-400 stroke-[1.5] relative z-10" />
                            
                            {/* Desktop image fallback */}
                            <Image
                                src="/images/empty-cart-3d.png"
                                alt="Empty Cart"
                                width={180}
                                height={180}
                                className="hidden sm:block object-contain relative z-10 drop-shadow-xl"
                            />
                        </motion.div>
                        
                        {/* Floating elements */}
                        <motion.div 
                            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center"
                        >
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col mb-10 w-full text-center">
                        <h2 className="text-[24px] sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
                            Таны сагс хоосон байна
                        </h2>
                        <p className="text-[15px] sm:text-[16px] text-gray-400 font-medium leading-relaxed max-w-[260px] mx-auto">
                            Сонирхсон бараагаа сагсандаа нэмж эхлээрэй
                        </p>
                    </div>

                    <Link href="/" className="w-full mb-14 block">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex w-full px-6 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF5000] text-white rounded-2xl font-black text-[15px] uppercase tracking-wide shadow-[0_8px_20px_rgba(255,80,0,0.25)] items-center justify-center gap-2.5 transition-all group"
                        >
                            {t('cart', 'continueShopping')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                        </motion.button>
                    </Link>

                    {/* Recommended Products Section */}
                    <div className="w-[100vw] px-4 overflow-x-hidden md:w-full md:px-0 text-left mt-8">
                        <div className="flex items-center gap-4 mb-6 w-full">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-gray-100" />
                            <span className="text-[12px] font-black text-gray-800 uppercase tracking-widest">Танд санал болгох</span>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-gray-100" />
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            className="flex sm:grid sm:grid-cols-2 gap-4 pb-20 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                        >
                            {suggested.length > 0
                                ? suggested.slice(0, 4).map((p: any, idx: number) => (
                                    <motion.div
                                        key={p.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="w-[160px] sm:w-auto shrink-0 snap-start"
                                    >
                                        <UniversalProductCard product={p} index={idx} disableInitialAnimation />
                                    </motion.div>
                                ))
                                : [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-[160px] sm:w-auto shrink-0 snap-start aspect-square bg-white rounded-[28px] p-4 border border-gray-100 shadow-sm animate-pulse flex flex-col gap-3">
                                        <div className="flex-1 bg-gray-50 rounded-2xl" />
                                        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
                                        <div className="h-5 w-1/2 bg-gray-200 rounded-full" />
                                    </div>
                                ))
                            }
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const readyItems = items.filter(i => i.stockStatus !== 'pre-order');
    const preOrderItems = items.filter(i => i.stockStatus === 'pre-order');

    return (
        <div className="min-h-screen bg-[#F5F5F3] pt-16 pb-[calc(env(safe-area-inset-bottom)+260px)] lg:pb-[260px]">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header with Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center justify-between px-2"
                >
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
                            </motion.div>
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('cart', 'title')}</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1 h-1 rounded-full bg-orange-500" />
                                <span className="text-xs font-medium text-gray-500 leading-none">
                                    {getTotalItems()} бараа
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Cart Sections */}
                <div className="space-y-10">
                    {/* Ready to Ship Section */}
                    {readyItems.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
                                <span className="text-[12px] font-semibold text-black">Бэлэн бараанууд</span>
                                <div className="ml-auto text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" strokeWidth={3} /> Маргааш хүргэнэ
                                </div>
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {readyItems.map((item) => (
                                        <AntiGravityCartItem key={item.id} item={item} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}

                    {/* Pre-order Section */}
                    {preOrderItems.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.7)' }} />
                                <span className="text-[12px] font-semibold text-black">Захиалгын бараанууд</span>
                                <div className="ml-auto text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" strokeWidth={2.5} /> 14 хоногт ирнэ
                                </div>
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {preOrderItems.map((item) => (
                                        <AntiGravityCartItem key={item.id} item={item} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                </div>

                {/* Recommendation Guide */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Танд санал болгох бараа</h3>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pb-10">
                        {suggested.length > 0
                            ? suggested.slice(0, 4).map((p: any, index: number) => (
                                <UniversalProductCard key={p.id} product={p} index={index} />
                            ))
                            : [1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-[3/4] bg-white rounded-[32px] border border-slate-100/50 shadow-sm animate-pulse flex flex-col p-4 gap-3"
                                >
                                    <div className="flex-1 bg-slate-50 rounded-2xl" />
                                    <div className="h-3 w-3/4 bg-slate-50 rounded-full" />
                                    <div className="h-4 w-1/2 bg-slate-50 rounded-full" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Footer */}
            <TaobaoStickyFooter />
        </div>
    );
}
