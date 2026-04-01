"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'market' | 'groups' | 'lost'>('market');
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingData, setEditingData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyData();
    }
  }, [user, activeTab]);

  async function fetchMyData() {
    setLoading(true);
    let tableName = '';
    if (activeTab === 'market') tableName = 'listings';
    if (activeTab === 'groups') tableName = 'groups';
    if (activeTab === 'lost') tableName = 'lost_found';

    const { data } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
      
    if (data) setItems(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد أنك تبي تحذف هذا الإعلان نهائياً؟ 🗑️")) return;
    
    let tableName = activeTab === 'market' ? 'listings' : activeTab === 'groups' ? 'groups' : 'lost_found';
    await supabase.from(tableName).delete().eq('id', id);
    
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    let tableName = activeTab === 'market' ? 'listings' : activeTab === 'groups' ? 'groups' : 'lost_found';
    
    const { error } = await supabase
      .from(tableName)
      .update({
        title: editingData.title,
        description: editingData.description,
        ...(activeTab === 'market' && { price: editingData.price }),
        ...(activeTab === 'groups' && { max_members: editingData.max_members }),
        ...(activeTab === 'lost' && { is_resolved: editingData.is_resolved })
      })
      .eq('id', editingData.id);

    setIsUpdating(false);
    
    if (!error) {
      setEditingData(null);
      fetchMyData();
    } else {
      alert("حدث خطأ أثناء التحديث.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-2xl font-bold text-primary">سجل دخولك أولاً!</h2>
        <Link href="/login" className="mt-4 bg-secondary text-white px-6 py-2 rounded-xl font-bold transition">دخول</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 mt-4 px-4 sm:px-0">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-1">لوحة التحكم ⚙️</h1>
        <p className="text-gray-500 text-sm mb-6">من هنا تقدر تدير إعلاناتك، تعدلها، أو تحذفها.</p>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('market')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'market' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>السوق 🛍️</button>
          <button onClick={() => setActiveTab('groups')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'groups' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>المجموعات 👥</button>
          <button onClick={() => setActiveTab('lost')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'lost' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>المفقودات 🔍</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">جاري التحميل... ⏳</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <span className="text-5xl block mb-4">📭</span>
          <h3 className="text-xl font-bold text-primary">ما عندك إعلانات في هذا القسم</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-primary line-clamp-1">{item.title}</h3>
                {activeTab === 'lost' && item.is_resolved && <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-md">تم الحل ✅</span>}
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 bg-gray-50 p-2 rounded-lg">{item.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => setEditingData(item)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold py-2 rounded-lg transition"
                >
                  ✏️ تعديل
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold py-2 rounded-lg transition"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-primary mb-4">تعديل الإعلان ✏️</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
                <input required type="text" value={editingData.title} onChange={(e) => setEditingData({...editingData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary" />
              </div>

              {activeTab === 'market' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">السعر (ريال)</label>
                  <input required type="number" value={editingData.price} onChange={(e) => setEditingData({...editingData, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary" />
                </div>
              )}

              {activeTab === 'groups' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">العدد المطلوب (0 = مفتوح)</label>
                  <input required type="number" value={editingData.max_members} onChange={(e) => setEditingData({...editingData, max_members: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary" />
                </div>
              )}

              {activeTab === 'lost' && (
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input type="checkbox" id="resolved" checked={editingData.is_resolved} onChange={(e) => setEditingData({...editingData, is_resolved: e.target.checked})} className="w-5 h-5 accent-primary" />
                  <label htmlFor="resolved" className="font-bold text-gray-700 cursor-pointer">تم الحل (لقيت الغرض / رجعته) ✅</label>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                <textarea required rows={3} value={editingData.description} onChange={(e) => setEditingData({...editingData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary resize-none"></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={isUpdating} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-[#0c3a6b] transition disabled:opacity-70">
                  {isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => setEditingData(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}