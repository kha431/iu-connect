"use client";

import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [marketAds, setMarketAds] = useState<any[]>([]);
  const [groupAds, setGroupAds] = useState<any[]>([]);
  const [lostAds, setLostAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔴 حالات (States) نافذة التعديل
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMyAds = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: marketData } = await supabase.from('market_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (marketData) setMarketAds(marketData);

        const { data: groupData } = await supabase.from('groups').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (groupData) setGroupAds(groupData);

        const { data: lostData } = await supabase.from('lost_found').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (lostData) setLostAds(lostData);
      }
      setLoading(false);
    };

    fetchMyAds();
  }, []);

  // دالة الحذف
  const handleDelete = async (e: React.MouseEvent, id: string, tableName: string) => {
    e.preventDefault();
    if (!window.confirm("هل أنت متأكد من حذف الإعلان نهائياً؟")) return;

    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      alert("حدث خطأ أثناء الحذف: " + error.message);
    } else {
      if (tableName === 'market_items') setMarketAds(prev => prev.filter(ad => ad.id !== id));
      if (tableName === 'groups') setGroupAds(prev => prev.filter(ad => ad.id !== id));
      if (tableName === 'lost_found') setLostAds(prev => prev.filter(ad => ad.id !== id));
    }
  };

  // 🔴 دالة فتح نافذة التعديل وسحب البيانات القديمة
  const openEditModal = (e: React.MouseEvent, item: any, type: string) => {
    e.preventDefault();
    setEditingType(type);
    setEditingItem(item);
    setEditFormData({ ...item }); // نسخ بيانات الإعلان الحالي للفورم
  };

  // 🔴 دالة حفظ التعديلات في السيرفر
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // تحديث البيانات في قاعدة البيانات
    const { error } = await supabase
      .from(editingType)
      .update(editFormData)
      .eq('id', editingItem.id);

    if (error) {
      alert("حدث خطأ أثناء التعديل: " + error.message);
    } else {
      // تحديث الشاشة فوراً عشان تظهر التعديلات بدون ريفرش
      if (editingType === 'market_items') {
        setMarketAds(prev => prev.map(ad => ad.id === editingItem.id ? { ...ad, ...editFormData } : ad));
      } else if (editingType === 'groups') {
        setGroupAds(prev => prev.map(g => g.id === editingItem.id ? { ...g, ...editFormData } : g));
      } else if (editingType === 'lost_found') {
        setLostAds(prev => prev.map(l => l.id === editingItem.id ? { ...l, ...editFormData } : l));
      }
      setEditingItem(null); // إغلاق النافذة
    }
    setIsSaving(false);
  };

  const hasAds = marketAds.length > 0 || groupAds.length > 0 || lostAds.length > 0;

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-8 mb-20 font-sans relative">
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#0f4c8a] mb-2">إعلاناتي 📦</h1>
          <p className="text-gray-500 font-medium">مرحباً بك في لوحة تحكم إعلاناتك</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0f4c8a] border-t-transparent rounded-full animate-spin"></div></div>
        ) : !hasAds ? (
          <div className="bg-gray-50 rounded-3xl border border-gray-100 p-16 text-center">
             <span className="text-5xl mb-4 block">📭</span>
             <h2 className="text-xl font-bold text-gray-700">لا يوجد لديك إعلانات حالياً</h2>
             <p className="text-gray-500 mt-2 mb-6">ابدأ ببيع أشيائك الزائدة الآن!</p>
             <Link href="/market/new" className="bg-[#0f4c8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0c3a6b] transition inline-block shadow-sm">
               + أضف إعلانك الأول
             </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* قسم السوق */}
            {marketAds.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f4c8a] mb-4 border-b pb-2">🛒 إعلانات السوق</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketAds.map((ad) => (
                    <Link href={`/market/${ad.id}`} key={ad.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition flex flex-col h-full">
                      <h3 className="font-bold text-lg text-[#0f4c8a] line-clamp-1">{ad.title}</h3>
                      <div className="text-[#cca01d] font-bold mt-1">{ad.price > 0 ? `${ad.price} ريال` : 'على السوم'}</div>
                      <div className="mt-4 text-xs text-gray-400">{new Date(ad.created_at).toLocaleDateString('ar-SA')}</div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                        {/* 🔴 زر التعديل مربوط بالدالة الجديدة */}
                        <button onClick={(e) => openEditModal(e, ad, 'market_items')} className="bg-blue-50 text-blue-700 py-2 rounded-lg font-bold flex-1 hover:bg-blue-100 transition border border-blue-100 text-sm">
                          تعديل ✏️
                        </button>
                        <button onClick={(e) => handleDelete(e, ad.id, 'market_items')} className="bg-red-50 text-red-700 py-2 rounded-lg font-bold flex-1 hover:bg-red-100 transition border border-red-100 text-sm">
                          حذف 🗑️
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* قسم المجموعات */}
            {groupAds.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f4c8a] mb-4 border-b pb-2">👥 المجموعات الطلابية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupAds.map((group) => (
                    <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition flex flex-col h-full">
                      <h3 className="font-bold text-lg text-[#0f4c8a] line-clamp-1">{group.title}</h3>
                      <div className="text-gray-500 text-sm mt-2 line-clamp-2">{group.description}</div>
                      <div className="mt-4 text-xs text-gray-400">{new Date(group.created_at).toLocaleDateString('ar-SA')}</div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                        {/* 🔴 زر التعديل مربوط بالدالة الجديدة */}
                        <button onClick={(e) => openEditModal(e, group, 'groups')} className="bg-blue-50 text-blue-700 py-2 rounded-lg font-bold flex-1 hover:bg-blue-100 transition border border-blue-100 text-sm">
                          تعديل ✏️
                        </button>
                        <button onClick={(e) => handleDelete(e, group.id, 'groups')} className="bg-red-50 text-red-700 py-2 rounded-lg font-bold flex-1 hover:bg-red-100 transition border border-red-100 text-sm">
                          حذف 🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* قسم المفقودات */}
            {lostAds.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f4c8a] mb-4 border-b pb-2">🔍 المفقودات والموجودات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostAds.map((lost) => (
                    <div key={lost.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-[#0f4c8a] line-clamp-1 flex-1">{lost.title}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${lost.type === 'lost' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                          {lost.type === 'lost' ? 'مفقود' : 'معثور عليه'}
                        </span>
                      </div>
                      <div className="mt-4 text-xs text-gray-400">{new Date(lost.created_at).toLocaleDateString('ar-SA')}</div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                        {/* 🔴 زر التعديل مربوط بالدالة الجديدة */}
                        <button onClick={(e) => openEditModal(e, lost, 'lost_found')} className="bg-blue-50 text-blue-700 py-2 rounded-lg font-bold flex-1 hover:bg-blue-100 transition border border-blue-100 text-sm">
                          تعديل ✏️
                        </button>
                        <button onClick={(e) => handleDelete(e, lost.id, 'lost_found')} className="bg-red-50 text-red-700 py-2 rounded-lg font-bold flex-1 hover:bg-red-100 transition border border-red-100 text-sm">
                          حذف 🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 🌟 النافذة المنبثقة للتعديل (الشيء الفخم) 🌟 */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl p-8">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-[#0f4c8a]">تعديل الإعلان ✏️</h2>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500 bg-gray-100 w-8 h-8 rounded-full font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                
                {/* الحقول المشتركة لكل الأقسام */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">العنوان</label>
                  <input required type="text" value={editFormData.title || ''} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a]" />
                </div>
                
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">التفاصيل</label>
                  <textarea required rows={3} value={editFormData.description || ''} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a] resize-none" />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">رقم الواتساب</label>
                  <input type="text" value={editFormData.whatsapp || ''} onChange={(e) => setEditFormData({...editFormData, whatsapp: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a]" dir="ltr" />
                </div>

                {/* حقول خاصة بالسوق */}
                {editingType === 'market_items' && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 text-sm">السعر (ريال)</label>
                    <input type="number" required value={editFormData.price || 0} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a]" />
                  </div>
                )}

                {/* حقول خاصة بالمفقودات */}
                {editingType === 'lost_found' && (
                  <>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-sm">مكان الفقدان/العثور</label>
                      <input type="text" value={editFormData.location || ''} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a]" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-sm">حالة الإعلان</label>
                      <select value={editFormData.is_resolved ? 'true' : 'false'} onChange={(e) => setEditFormData({...editFormData, is_resolved: e.target.value === 'true'})} className="w-full p-3 rounded-xl border outline-none focus:border-[#0f4c8a]">
                        <option value="false">نشط (لم يتم الحل)</option>
                        <option value="true">✅ تم الحل (إغلاق الإعلان)</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={isSaving} className="flex-1 bg-[#cca01d] text-white py-3 rounded-xl font-bold hover:bg-[#b38b17] transition disabled:opacity-70">
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </button>
                  <button type="button" onClick={() => setEditingItem(null)} className="px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                    إلغاء
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}