import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

const getBasemapLayer = (type: string) => {
    switch (type) {
        case 'GoogleMaps':
            return new TileLayer({
                source: new XYZ({
                    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                })
            });
        case 'GoogleMapsSatelite':
            return new TileLayer({
                source: new XYZ({
                    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                })
            })
        default:
            return new TileLayer({
                source: new OSM()
            });
    }
};
export default getBasemapLayer