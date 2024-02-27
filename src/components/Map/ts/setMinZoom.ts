import { LineString, MultiLineString, Point } from "ol/geom";

function setMinZoomToLayer(capa: any, minPunto: Number, minLine: Number) {
    const features = capa.getSource()?.getFeatures();

    if (features && features.length > 0) {
        const geometry = features[0].getGeometry();
        if (geometry instanceof Point) {
            capa.setMinZoom(minPunto);
        } else if (geometry instanceof LineString || geometry instanceof MultiLineString) {
            capa.setMinZoom(minLine);
        }
    }
}
export default setMinZoomToLayer