'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { api } from '../../../lib/api.js';

export default function ProductsPage() {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Não foi possível carregar produtos', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(categories).map(([category, products]) => (
        <Card key={category} title={category}>
          <ul className="space-y-3 text-sm text-[#7A7687]">
            {products.map((product) => (
              <li key={product.name} className="border rounded-2xl p-4">
                <p className="font-semibold text-[#3C3A47]">{product.name}</p>
                <p>{product.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {product.skinTypes.map((skin) => (
                    <Badge key={skin}>{skin}</Badge>
                  ))}
                </div>
                <p className="text-xs mt-2">Quando usar: {product.usageTime}</p>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
