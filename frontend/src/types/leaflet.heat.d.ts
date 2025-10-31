declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: [number, number, number][]): void;
  }

  namespace L {
    function heatLayer(
      latlngs: [number, number, number][],
      options?: HeatLayerOptions
    ): HeatLayer;
  }
}