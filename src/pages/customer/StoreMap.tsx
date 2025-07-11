
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";

const StoreMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);

  // Create a 10x5 grid (10 aisles, 5 shelves per aisle)
  const aisles = Array.from({ length: 10 }, (_, i) => i + 1);
  const shelves = ['A', 'B', 'C', 'D', 'E'];

  // Mock product locations
  const productLocations: Record<string, { aisle: number; shelf: string }> = {
    'milk': { aisle: 1, shelf: 'A' },
    'bread': { aisle: 2, shelf: 'B' },
    'sugar': { aisle: 3, shelf: 'C' },
    'rice': { aisle: 4, shelf: 'D' },
    'apples': { aisle: 5, shelf: 'E' },
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHighlightedCells([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const foundProducts = Object.entries(productLocations).filter(([product]) =>
      product.includes(query)
    );

    const cellsToHighlight = foundProducts.map(
      ([_, location]) => `${location.aisle}-${location.shelf}`
    );

    setHighlightedCells(cellsToHighlight);
  };

  const getCellClass = (aisle: number, shelf: string) => {
    const cellId = `${aisle}-${shelf}`;
    const isHighlighted = highlightedCells.includes(cellId);
    
    return `
      w-12 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center
      text-xs font-medium cursor-pointer transition-all duration-300
      ${isHighlighted 
        ? 'bg-store-blue text-white border-store-blue shadow-lg scale-105 animate-pulse' 
        : 'bg-white hover:bg-blue-50 hover:border-blue-300'
      }
    `;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Store Map
          </CardTitle>
          <CardDescription>
            Search for products to see their location in the store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="store-button">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Store Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Store Layout</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 border-gray-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-store-blue rounded"></div>
                  <span>Product Found</span>
                </div>
              </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-11 gap-1">
              <div className="text-center text-sm font-medium text-gray-600 py-2">
                Shelf
              </div>
              {aisles.map((aisle) => (
                <div key={aisle} className="text-center text-sm font-medium text-gray-600 py-2">
                  A{aisle}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            {shelves.map((shelf) => (
              <div key={shelf} className="grid grid-cols-11 gap-1">
                <div className="flex items-center justify-center text-sm font-medium text-gray-600 py-2">
                  {shelf}
                </div>
                {aisles.map((aisle) => (
                  <div
                    key={`${aisle}-${shelf}`}
                    className={getCellClass(aisle, shelf)}
                    title={`Aisle ${aisle}, Shelf ${shelf}`}
                  >
                    {aisle}{shelf}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Search Results */}
          {highlightedCells.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-store-blue">Found Products:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(productLocations)
                  .filter(([product]) => product.includes(searchQuery.toLowerCase()))
                  .map(([product, location]) => (
                    <Badge key={product} variant="secondary" className="bg-blue-100 text-store-blue">
                      {product} - Aisle {location.aisle}, Shelf {location.shelf}
                    </Badge>
                  ))}
              </div>
              <Button className="store-button mt-2">
                Navigate to Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreMap;
