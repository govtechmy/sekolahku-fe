
export default function CalculateRadiusZoomLevel(zoom: number, latitude: number): number {
  // Earth's circumference at the equator in meters
  const earthCircumference = 40075016.686;
  
  // At zoom level 0, the entire world is visible (256 pixels)
  // Each zoom level doubles the resolution
  // The formula accounts for latitude distortion (Mercator projection)
  const metersPerPixel = (earthCircumference * Math.cos(latitude * Math.PI / 180)) / Math.pow(2, zoom + 8);
  
  // Assuming a typical viewport width of ~500 pixels for visible radius
  // Adjust this multiplier based on your map container size
  const viewportPixels = 1000; // Increased by 15% from 500
  
  return metersPerPixel * viewportPixels;
}