import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import "ol/ol.css";
import './Styles/Map.css'
import { useEffect, useRef, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { FormValues } from '../../interfaces/form.interfaces';
import { postData } from '../../ts/fetchData';
import XYZ from 'ol/source/XYZ';
import combinedStyle from '../../ts/stylePrimary';
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition';
import { getCenter } from 'ol/extent';


function Maps({ geoDataForm }: { geoDataForm: FormValues }) {
    const mapRef = useRef<Map>();
    const [basemapType, setBasemapType] = useState<string>('OSM');
    const handleChangeBasemap = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBasemapType(event.target.value);
    };
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
                minZoom: 10
            });
            map.addLayer(capa);
            capa.setStyle(combinedStyle)
            capa.set('hr', geoDataForm.hr)
            capa.set('administrado', geoDataForm.administrado)
            let extentLayer = capa.getSource()?.getExtent()
            if (extentLayer && extentLayer[0] !== Infinity) {
                map.getView().fit(extentLayer)
            }
            postData('postData', geoDataForm).then(resp => console.log(resp.id))
            const select = new Select({
                condition: pointerMove
            })
            map.addInteraction(select)
            let popup = document.createElement('div');
            popup.id = 'popup'
            if (popup) {
                let overlay = new Overlay({
                    element: popup,
                    positioning: 'bottom-center',
                    stopEvent: false,
                    offset: [0, -10]
                });
                map.addOverlay(overlay)
                select.on('select', function (e) {
                    var feature = e.selected[0];
                    if (feature) {
                        let layer = select.getLayer(feature)
                        let coordinates = feature.getGeometry()?.getExtent()
                        if(coordinates){
                            overlay.setPosition(getCenter(coordinates));
                        }
                        popup.innerHTML = '<p><strong>Hoja de Ruta:</strong> ' + layer.get('hr') + '</p>' + '<p><strong>Ademinstrado:</strong> ' + layer.get('administrado') + '</p>'
                    } else {
                        overlay.setPosition(undefined);
                    }
                })
            }
        }
    }, [geoDataForm]);

    return (
        <div className='position-relative'>
            <div className="map-container" id='map'></div>
            <select className='position-absolute selectBasemap btn btn-dark' value={basemapType} onChange={handleChangeBasemap}>
                <option value="OSM">OpenStreetMap</option>
                <option value="GoogleMaps">Google Maps</option>
                <option value="GoogleMapsSatelite">Google Maps Satétite</option>
            </select>
        </div>
    )
}

export default Maps;
