import { Map, View } from 'ol';
import "ol/ol.css";
import './Styles/Map.css'
import { useEffect, useRef, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { FormValues } from '../../interfaces/form.interfaces';
import combinedStyle from './ts/stylePrimary';
import getBasemapLayer from './ts/getBasmap';
import SelectBasemap from './components/selectBasemap';
import pointerHover from './ts/pointerHover';


function Maps({ geoDataForm }: { geoDataForm: FormValues }) {
    const mapRef = useRef<Map>();
    const [basemapType, setBasemapType] = useState<string>('OSM');
    const handleChangeBasemap = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBasemapType(event.target.value);
    };
    useEffect(() => {
        if (!mapRef.current) {
            const view: View = new View({
                center: [-12.058302798722039, -77.06106554334782].reverse(),
                zoom: 15,
                projection: "EPSG:4326",
                minZoom: 11,
                maxZoom: 22
            });
            const mapInstance: Map = new Map({
                target: "map",
                view: view,
            });
            mapRef.current = mapInstance;
        }
    }, []);
    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            const basemap = getBasemapLayer(basemapType);
            map.getLayers().setAt(0, basemap);
            map.updateSize();
            console.log(map.getView().getViewStateAndExtent().extent)
        }
    }, [basemapType]);

    useEffect(() => {
        const map = mapRef.current;
        if (map && geoDataForm.geojson) {
            let capa = new VectorLayer({
                source: new VectorSource<any>({
                    features: new GeoJSON({
                        featureProjection: 'EPSG:4326'
                    }).readFeatures(JSON.parse(geoDataForm.geojson))
                }),
                minZoom: Number(`${geoDataForm.infraestructura == 'postes' ? 14 : 11}`)
            });
            map.addLayer(capa);
            capa.setStyle(combinedStyle)
            capa.set('hr', geoDataForm.hr)
            capa.set('administrado', geoDataForm.administrado)
            capa.set('infraestructura', geoDataForm.infraestructura)
            capa.set('instrumento', geoDataForm.instrumento)
            
            let extentLayer = capa.getSource()?.getExtent()
            if (extentLayer && extentLayer[0] !== Infinity) {
                map.getView().fit(extentLayer)
            }
            pointerHover(map)
        }
    }, [geoDataForm]);

    return (
        <div className='position-relative'>
            <div className="map-container" id='map'></div>
            <SelectBasemap value={basemapType} onChange={handleChangeBasemap} />
        </div>
    )
}

export default Maps;
