# Maps Components Documentation

This directory contains the componentized maps functionality for the SchoolMaps feature.

## Components Overview

### 1. MapSearchBar
**Path:** `src/components/maps/MapSearchBar.tsx`

A comprehensive search and filter component that handles:
- Text-based school search
- Expandable/collapsible interface
- Search suggestions with school details
- Integration with map navigation (pan and zoom)

**Props:**
- `query`: Current search query string
- `setQuery`: Function to update search query
- `setFilteredMarkers`: Function to update filtered school markers
- `markersToShow`: Array of all available school markers
- `setSelected`: Function to set selected school marker

**Features:**
- Auto-suggestions as user types
- Clear search functionality
- School selection that updates map view
- Distance display for each school
- Responsive design with mobile-first approach

### 2. FilterDropdowns
**Path:** `src/components/maps/FilterDropdowns.tsx`

Filter dropdown components for narrowing down school search results:
- State/Negeri filter dropdown
- School type/Jenis filter dropdown

**Props:**
- `selectedNegeri`: Currently selected state
- `selectedJenis`: Currently selected school type
- `negeriList`: Array of available states
- `jenisList`: Array of available school types
- `onNegeriChange`: Callback for state selection change
- `onJenisChange`: Callback for school type selection change

### 3. SchoolInfoWindow
**Path:** `src/components/maps/SchoolInfoWindow.tsx`

The information window component that displays detailed school information when a marker is clicked.

**Props:**
- `school`: SchoolMarker object containing all school details

**Features:**
- School image display
- Contact information (phone, email)
- Address details
- Administrative information (JPN/PPD data)
- Status indicators (SKM status, cluster type)
- Responsive layout for mobile and desktop

### 4. SchoolMapMarker
**Path:** `src/components/maps/SchoolMapMarker.tsx`

Individual map marker component representing a school location.

**Props:**
- `school`: SchoolMarker object
- `onClick`: Click handler function

**Features:**
- Custom school icon
- Click interaction for info window display
- Position-based rendering on map

### 5. DummyMap
**Path:** `src/components/maps/DummyMap.tsx`

A fallback map component that displays when Google Maps API keys are not configured. Provides a visual representation of school locations without requiring external API calls.

**Props:**
- `filteredMarkers`: Array of filtered school markers to display
- `selected`: Currently selected school marker
- `setSelected`: Function to set selected school marker
- `query`: Current search query
- `setQuery`: Function to update search query
- `setFilteredMarkers`: Function to update filtered markers
- `markersToShow`: Array of all available school markers

**Features:**
- Gradient background with grid pattern for map-like appearance
- Pseudo-random positioning of school markers based on school names
- Interactive markers with hover effects and click selection
- Information panel for selected schools
- Search functionality integrated
- Visual indicators and animations
- Responsive design

### 6. DummyMapSearchBar
**Path:** `src/components/maps/DummyMapSearchBar.tsx`

A version of MapSearchBar that works without Google Maps context, specifically designed for the dummy map.

**Props:** Same as MapSearchBar but without Google Maps dependencies

**Features:**
- All search and filter functionality of the regular MapSearchBar
- Works without requiring Google Maps useMap hook
- Identical interface and behavior to the regular search bar

## Types

### SchoolMarker Type
**Path:** `src/types/maps.ts`

Comprehensive type definition for school data:

```typescript
export type SchoolMarker = {
  lat: number;
  lng: number;
  namaSekolah: string;
  kodSekolah?: string;
  noTelefon?: string;
  email?: string;
  alamatSurat?: string;
  poskodSurat?: string;
  bandarSurat?: string;
  negeri?: string;
  jenisLabel?: string;
  kluster?: string;
  lokasi?: string;
  skm_150?: boolean;
  ppd?: string;
  gred?: string;
  sesi?: string;
  bantuan?: string;
  tarikhTubuh?: string;
  distance?: number;
};
```

## Usage Example

```tsx
import { MapSearchBar, SchoolInfoWindow, SchoolMapMarker } from "../components/maps";
import type { SchoolMarker } from "../types/maps";

// In your component:
<MapSearchBar
  query={query}
  setQuery={setQuery}
  setFilteredMarkers={setFilteredMarkers}
  markersToShow={markersToShow}
  setSelected={setSelected}
/>

{filteredMarkers.map((school, index) => (
  <SchoolMapMarker
    key={index}
    school={school}
    onClick={() => setSelected(school)}
  />
))}

{selected && (
  <InfoWindow
    position={{ lat: selected.lat, lng: selected.lng }}
    onCloseClick={() => setSelected(null)}
  >
    <SchoolInfoWindow school={selected} />
  </InfoWindow>
)}
```

## Environment-Based Rendering

The main `SchoolMaps.tsx` component automatically detects whether Google Maps API keys are available:

```typescript
const hasGoogleMapsKeys = import.meta.env.VITE_GOOGLE_MAPS_KEY && import.meta.env.VITE_GOOGLE_MAPS_ID;

if (!hasGoogleMapsKeys) {
  // Render DummyMap
} else {
  // Render Google Maps
}
```

### Environment Variables Required

- `VITE_GOOGLE_MAPS_KEY`: Google Maps JavaScript API key
- `VITE_GOOGLE_MAPS_ID`: Google Maps Map ID for custom styling

### Fallback Behavior

When environment variables are missing or empty:
- ✅ DummyMap renders with all functionality
- ✅ Search and filter features work normally
- ✅ School selection and information display work
- ✅ Visual markers show school locations
- ✅ Responsive design maintained
- ⚠️ No real map tiles or Google Maps features
- ⚠️ School positions are pseudo-random, not geographically accurate

## Benefits of This Component Structure

### 1. **Separation of Concerns**
- Each component has a single, well-defined responsibility
- Search logic is separated from display logic
- Filter functionality is isolated and reusable

### 2. **Reusability**
- Components can be used in other parts of the application
- Easy to extend or modify individual features
- Consistent interface across similar features

### 3. **Maintainability**
- Easier to debug specific functionality
- Changes to one component don't affect others
- Clear prop interfaces make dependencies explicit

### 4. **Testing**
- Each component can be unit tested independently
- Mock props make testing scenarios easier to set up
- Isolated logic is easier to verify

### 5. **Type Safety**
- Shared types ensure consistency across components
- TypeScript provides compile-time error checking
- Clear interfaces prevent prop drilling issues

## Benefits of Dummy Map

### 1. **Development Friendly**
- No API keys required for development
- Instant setup for new developers
- No API quota concerns during development

### 2. **Graceful Degradation**
- Application remains functional without external dependencies
- Users still get core functionality
- Clear messaging about missing configuration

### 3. **Testing**
- Easier to test without external API dependencies
- Consistent behavior across different environments
- No network requests required

### 4. **Demo Mode**
- Perfect for demonstrations and presentations
- No risk of API key exposure in public demos
- Works in any environment

## File Structure

```
src/
├── components/
│   └── maps/
│       ├── MapSearchBar.tsx
│       ├── FilterDropdowns.tsx
│       ├── SchoolInfoWindow.tsx
│       ├── SchoolMapMarker.tsx
│       ├── DummyMap.tsx
│       └── index.ts
├── types/
│   └── maps.ts
└── pages/
    └── SchoolMaps.tsx
```

## Dependencies

- `@vis.gl/react-google-maps` - Google Maps React components
- `@govtechmy/myds-react` - Government design system components
- React hooks (`useState`, `useMemo`, etc.)

## Notes

- All components use TypeScript for type safety
- Components follow the existing design system patterns
- Mobile-responsive design is maintained throughout
- Error handling and loading states should be added as needed
- Consider adding unit tests for each component
