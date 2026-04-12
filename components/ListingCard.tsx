import Link from 'next/link';

interface ListingProps {
  listing: {
    id: string;
    title: string;
    price: number;
    category: string;
    condition: string;
    created_at: string;
    image_url?: string; 
  };
}

export default function ListingCard({ listing }: ListingProps) {
  return (
    <Link href={`/market/${listing.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        
        {/* */}
        <div className="h-48 bg-gray-50 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">📦</span>
          )}
        </div>
        
        {/* تفاصيل الإعلان */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-primary line-clamp-1">{listing.title}</h3>
            <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap mr-2">
              {listing.price === 0 ? 'مجاني' : `${listing.price} ريال`}
            </span>
          </div>
          
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{listing.category}</span>
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">{listing.condition}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-2">
            <span>{new Date(listing.created_at).toLocaleDateString('ar-SA')}</span>
            <span className="flex items-center gap-1">👁️ 0</span>
          </div>
        </div>
      </div>
    </Link>
  );
}