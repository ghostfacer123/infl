'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import SearchBar from '@/components/SearchBar'
import ProductCard, { Product } from '@/components/ProductCard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Load all products on mount
  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        buy_links (*)
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data as any)
    }
    setLoading(false)
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      loadAllProducts()
      return
    }

    setQuery(searchQuery)
    setLoading(true)
    setSearched(true)

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        buy_links (*)
      `)
      .or(`product_name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,quote.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data as any)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-500 to-purple-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            What Does She Use? 💄
          </h1>
          <p className="text-lg md:text-xl text-pink-100 mb-10">
            Discover products used by top Egyptian & MENA influencers.
            Find where to buy in Egypt with the best prices.
          </p>
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-purple-500">
            <div className="spinner w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 mb-4" />
            <p className="text-lg font-medium">Searching…</p>
          </div>
        )}

        {/* Empty state after search */}
        {!loading && searched && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500">
              Try searching for an influencer name, brand, or category like &quot;skincare&quot; or &quot;makeup&quot;
            </p>
          </div>
        )}

        {/* Results grid */}
        {!loading && products.length > 0 && (
          <>
            <p className="text-gray-500 mb-6 font-medium">
              {query ? `Found ${products.length} product${products.length !== 1 ? 's' : ''} for "${query}"` : `Showing all ${products.length} products`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id ?? index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}