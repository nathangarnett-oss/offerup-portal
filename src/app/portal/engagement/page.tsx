'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Downtown Bellevue, WA
const BUSINESS_LAT = 47.6101;
const BUSINESS_LNG = -122.2015;

type EngagementCategory = 'listing' | 'job' | 'service' | 'rental';

interface EngagementDot {
  lat: number;
  lng: number;
  category: EngagementCategory;
}

const categoryConfig: Record<EngagementCategory, { label: string; color: string; hex: string }> = {
  listing: { label: 'Listings', color: 'bg-blue-500', hex: '#3b82f6' },
  job: { label: 'Jobs', color: 'bg-purple-500', hex: '#a855f7' },
  service: { label: 'Services', color: 'bg-amber-500', hex: '#f59e0b' },
  rental: { label: 'Rentals', color: 'bg-teal-500', hex: '#14b8a6' },
};

// Generate realistic anonymous engagement dots around Bellevue / Greater Seattle area
function generateEngagementDots(): EngagementDot[] {
  const dots: EngagementDot[] = [];
  const categories: EngagementCategory[] = ['listing', 'job', 'service', 'rental'];
  const counts = { listing: 120, job: 45, service: 60, rental: 55 };

  // Seed-based pseudo-random for deterministic output
  let seed = 42;
  function rand() {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  }

  // Cluster centers (neighborhoods) with weights
  const clusters = [
    { lat: 47.6101, lng: -122.2015, weight: 0.25, spread: 0.015 },  // Downtown Bellevue
    { lat: 47.6062, lng: -122.3321, weight: 0.20, spread: 0.025 },  // Seattle Downtown
    { lat: 47.6588, lng: -122.3130, weight: 0.08, spread: 0.015 },  // Fremont / Wallingford
    { lat: 47.6205, lng: -122.3493, weight: 0.06, spread: 0.012 },  // Queen Anne
    { lat: 47.6650, lng: -122.2980, weight: 0.05, spread: 0.010 },  // U District
    { lat: 47.5480, lng: -122.3175, weight: 0.06, spread: 0.015 },  // Georgetown / SoDo
    { lat: 47.6142, lng: -122.1874, weight: 0.10, spread: 0.020 },  // East Bellevue / Crossroads
    { lat: 47.5301, lng: -122.2130, weight: 0.05, spread: 0.018 },  // Mercer Island area
    { lat: 47.6769, lng: -122.2060, weight: 0.07, spread: 0.020 },  // Kirkland
    { lat: 47.5841, lng: -122.1565, weight: 0.04, spread: 0.015 },  // Eastgate / Factoria
    { lat: 47.6740, lng: -122.1215, weight: 0.04, spread: 0.020 },  // Redmond
  ];

  for (const cat of categories) {
    for (let i = 0; i < counts[cat]; i++) {
      // Pick a cluster based on weights
      let r = rand();
      let cluster = clusters[0];
      let cumulative = 0;
      for (const c of clusters) {
        cumulative += c.weight;
        if (r <= cumulative) {
          cluster = c;
          break;
        }
      }

      // Generate point with gaussian-like spread (Box-Muller)
      const u1 = rand();
      const u2 = rand();
      const z0 = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
      const z1 = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.sin(2 * Math.PI * u2);

      dots.push({
        lat: cluster.lat + z0 * cluster.spread,
        lng: cluster.lng + z1 * cluster.spread,
        category: cat,
      });
    }
  }

  return dots;
}

const engagementDots = generateEngagementDots();

export default function GeographicEngagementPage() {
  const [activeCategories, setActiveCategories] = useState<Set<EngagementCategory>>(
    new Set(['listing', 'job', 'service', 'rental'])
  );
  const [mapReady, setMapReady] = useState(false);

  const toggleCategory = (cat: EngagementCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const filteredDots = engagementDots.filter((d) => activeCategories.has(d.category));

  const categoryCounts = {
    listing: engagementDots.filter((d) => d.category === 'listing').length,
    job: engagementDots.filter((d) => d.category === 'job').length,
    service: engagementDots.filter((d) => d.category === 'service').length,
    rental: engagementDots.filter((d) => d.category === 'rental').length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Geographic Engagement</h1>
          <p className="mt-1 text-sm text-gray-500">
            Anonymized view of user engagement across the Greater Seattle / Bellevue area
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
          <MapPin size={14} className="text-offerup-green" />
          Downtown Bellevue, WA
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        {(Object.entries(categoryConfig) as [EngagementCategory, typeof categoryConfig.listing][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all shadow-sm',
              activeCategories.has(key)
                ? 'border-gray-300 bg-white text-gray-800'
                : 'border-gray-200 bg-gray-100 text-gray-400'
            )}
          >
            <span className={cn('h-3 w-3 rounded-full', activeCategories.has(key) ? config.color : 'bg-gray-300')} />
            {config.label}
            <span className="text-xs text-gray-400">({categoryCounts[key]})</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" style={{ height: 'calc(100vh - 260px)' }}>
        <MapView
          dots={filteredDots}
          onReady={() => setMapReady(true)}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm text-sm text-gray-600">
        <span className="font-medium text-gray-800">Legend:</span>
        {(Object.entries(categoryConfig) as [EngagementCategory, typeof categoryConfig.listing][]).map(([key, config]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', config.color)} />
            {config.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-offerup-green text-[8px] font-bold text-white">★</span>
          Your Business
        </span>
      </div>
    </div>
  );
}

// Separate component to dynamically load Leaflet (avoid SSR issues)
function MapView({ dots, onReady }: { dots: EngagementDot[]; onReady: () => void }) {
  const [LeafletComponents, setLeafletComponents] = useState<{
    MapContainer: typeof import('react-leaflet').MapContainer;
    TileLayer: typeof import('react-leaflet').TileLayer;
    CircleMarker: typeof import('react-leaflet').CircleMarker;
    Marker: typeof import('react-leaflet').Marker;
    Popup: typeof import('react-leaflet').Popup;
    Tooltip: typeof import('react-leaflet').Tooltip;
  } | null>(null);
  const [icon, setIcon] = useState<import('leaflet').Icon | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([rl, L]) => {
      // Fix Leaflet default icon issue
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const businessIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      setLeafletComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        CircleMarker: rl.CircleMarker,
        Marker: rl.Marker,
        Popup: rl.Popup,
        Tooltip: rl.Tooltip,
      });
      setIcon(businessIcon);
      onReady();
    });
  }, [onReady]);

  if (!LeafletComponents || !icon) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-offerup-green mx-auto" />
          Loading map...
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip } = LeafletComponents;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <MapContainer
        center={[BUSINESS_LAT, BUSINESS_LNG]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Business location marker */}
        <Marker position={[BUSINESS_LAT, BUSINESS_LNG]} icon={icon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-offerup-green">Your Business</p>
              <p className="text-xs text-gray-500">Downtown Bellevue, WA</p>
            </div>
          </Popup>
        </Marker>

        {/* Engagement dots */}
        {dots.map((dot, i) => (
          <CircleMarker
            key={`${dot.category}-${i}`}
            center={[dot.lat, dot.lng]}
            radius={5}
            pathOptions={{
              color: categoryConfig[dot.category].hex,
              fillColor: categoryConfig[dot.category].hex,
              fillOpacity: 0.55,
              weight: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -5]}>
              <span className="text-xs">
                {categoryConfig[dot.category].label} engagement
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </>
  );
}
