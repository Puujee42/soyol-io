'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TaobaoStickyFooter() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const toggleAllSelection = useCartStore((state) => state.toggleAllSelection);
    const selectedTotalItems = useCartStore((state) => state.getSelectedTotalItems());
    const selectedTotalPrice = useCartStore((state) => state.getSelectedTotalPrice());
    const selectedInStockPrice = useCartStore((state) => state.getSelectedTotalPriceByStatus('in-stock'));
    const selectedPreOrderPrice = useCartStore((state) => state.getSelectedTotalPriceByStatus('pre-order'));

    if (items.length === 0) return null;

    const allSelected = items.length > 0 && items.every((item) => item.selected);

    // Price animation hook
    const motionPrice = useMotionValue(selectedTotalPrice);
    const springPrice = useSpring(motionPrice, { stiffness: 100, damping: 20 });
    const displayPrice = useTransform(springPrice, (v) =>
        Math.round(v).toLocaleString('mn-MN')
    );

    useEffect(() => {
        motionPrice.set(selectedTotalPrice);
    }, [selectedTotalPrice, motionPrice]);

    return (
        <div className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+8px)] inset-x-0 z-[60] px-4 lg:bottom-8 lg:px-0">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220, delay: 0.15 }}
                    className="bg-white rounded-[20px] border border-black/[0.05] overflow-hidden"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                >
                    <div className="px-4 py-3.5 flex flex-col gap-3">

                        {/* Select all + subtotal pills */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => toggleAllSelection(!allSelected)}
                                className="flex items-center gap-2"
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${allSelected ? 'bg-[#FF5000] border-[#FF5000]' : 'border-black/[0.15] bg-white'
                                    }`}>
                                    {allSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                                </div>
                                <span className="text-[13px] font-medium text-black/60">Бүгдийг сонгох</span>
                            </button>

                            <div className="flex gap-1.5">
                                {selectedInStockPrice > 0 && (
                                    <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-semibold text-emerald-700">
                                            Бэлэн: {formatCurrency(selectedInStockPrice)}₮
                                        </span>
                                    </div>
                                )}
                                {selectedPreOrderPrice > 0 && (
                                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-[10px] font-semibold text-amber-700">
                                            Захиалга: {formatCurrency(selectedPreOrderPrice)}₮
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total + checkout */}
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] text-black/30 font-medium mb-1">
                                    Нийт дүн ({selectedTotalItems})
                                </p>
                                <div className="flex items-baseline gap-0.5">
                                    <motion.span className="text-[22px] font-bold text-black tracking-tight leading-none">
                                        {displayPrice}
                                    </motion.span>
                                    <span className="text-[14px] font-bold text-[#FF5000] ml-0.5">₮</span>
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { if (selectedTotalItems === 0) return; router.push('/checkout'); }}
                                disabled={selectedTotalItems === 0}
                                className={`h-12 px-7 rounded-[14px] flex items-center gap-2 font-bold text-[14px] transition-all ${selectedTotalItems > 0
                                    ? 'bg-black text-white'
                                    : 'bg-black/[0.06] text-black/25 cursor-not-allowed'
                                    }`}
                            >
                                Захиалах
                                <ArrowRight className="w-4 h-4 text-[#FF5000]" strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

