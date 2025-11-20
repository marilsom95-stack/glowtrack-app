'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const normalizeProducts = (payload) => {
  const data = payload?.data || payload || {};

  if (Array.isArray(data.products)) return data.products;
  if (Array.isArray(data)) return data;
  if (Array.isArray(payload?.products)) return payload.products;

  const categories = data.categories || {};

  return Object.entries(categories).flatMap(([category, categoryProducts]) =>
    (categoryProducts || []).map((product) => ({
      category,
      ...product,
    })),
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/products', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Não foi possível carregar produtos');
        }

        const payload = await response.json();
        setProducts(normalizeProducts(payload));
      } catch (error) {
        console.error('Não foi possível carregar produtos', error);
        setError('Não foi possível carregar as recomendações no momento.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      {loading && (
        <Card muted className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-[color:var(--surface-muted-strong)]" />
          <div className="h-6 w-40 animate-pulse rounded bg-[color:var(--surface-muted-strong)]" />
          <div className="h-20 w-full animate-pulse rounded bg-[color:var(--surface-muted-strong)]" />
        </Card>
      )}

      {error && !loading && (
        <Card className="border border-red-100 bg-red-50 text-sm text-red-800">
          {error}
        </Card>
      )}

      {!loading && !error && products.length === 0 && (
        <Card className="text-sm text-[color:var(--text-soft)]">
          Não temos recomendações neste momento, mas em breve teremos produtos perfeitos para ti.
        </Card>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const safetyStatus =
              product.safetyIndicator || product.safety || product.safetyStatus || 'Seguro para ti';

            return (
              <Card key={product.name} className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--text-soft)]">
                      {product.category || 'Categoria não informada'}
                    </p>
                    <p className="text-lg font-semibold text-[color:var(--text-strong)]">{product.name}</p>
                    {product.description && (
                      <p className="text-sm leading-relaxed text-[color:var(--text-soft)]">{product.description}</p>
                    )}
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {safetyStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-[color:var(--text-soft)]">
                  {product.skinTypes?.map((skin) => (
                    <Badge key={`${product.name}-${skin}`}>{skin}</Badge>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 text-sm text-[color:var(--text-soft)]">
                  <p className="text-xs text-[color:var(--text-soft)]">
                    {product.usageTime ? `Quando usar: ${product.usageTime}` : 'Perfeito para integrar na tua rotina diária.'}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => product.externalLink && window.open(product.externalLink, '_blank')}
                  >
                    Ver mais
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
