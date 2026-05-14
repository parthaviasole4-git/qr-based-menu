import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0; // Disable static rendering for this page

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, key);

  // Parse page number from URL params (awaiting Promise for Next.js 15+)
  const params = await searchParams;
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const page = parseInt(pageStr, 10) || 1;
  const pageSize = 10;
  
  // Calculate range for Supabase (0-indexed)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch data with total count
  const { data: users, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching users:', error);
  }

  const totalRecords = count || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Star Rating Helper
  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-zinc-500 italic">No rating</span>;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]' : 'text-zinc-600'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Customer Reviews Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">Real-time feedback and ratings from your customers</p>
          </div>
          <div className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-zinc-300">Total Records: {totalRecords}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 border-b border-white/10 uppercase tracking-wider text-zinc-400 text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer (Phone)</th>
                    <th className="px-6 py-4 font-semibold">Consent</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold w-full">Comment</th>
                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-zinc-300 bg-black/50 px-2 py-1 rounded-md border border-white/5">
                            {user.phone.replace('whatsapp:', '')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.consent ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {renderStars(user.rating)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs md:max-w-md truncate text-zinc-300">
                            {user.comment ? user.comment : <span className="text-zinc-600 italic">No comment provided</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-400 whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No reviews found for this page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="bg-black/40 border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Showing <span className="font-medium text-white">{totalRecords === 0 ? 0 : from + 1}</span> to <span className="font-medium text-white">{Math.min(to + 1, totalRecords)}</span> of <span className="font-medium text-white">{totalRecords}</span> results
              </span>
              
              <div className="flex gap-2">
                {hasPrevPage ? (
                  <Link 
                    href={`/dashboard?page=${page - 1}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 border border-white/10 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Previous
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-900 border border-white/5 rounded-lg cursor-not-allowed">
                    Previous
                  </button>
                )}
                
                {hasNextPage ? (
                  <Link 
                    href={`/dashboard?page=${page + 1}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 border border-white/10 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Next
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-900 border border-white/5 rounded-lg cursor-not-allowed">
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
