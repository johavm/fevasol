
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { StyleSecondary } from './styleLayers';
import setMinZoomToLayer from './setMinZoom';


const getData = (map: Map, administrado: string) => {
    const view = map.getView()
    map.on('moveend', () => {
        fetch(import.meta.env.VITE_URL_API, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "method": "getData",
                "administrado": administrado,
                "layersNow": map.getAllLayers().map(item => item.get('id')).filter(item => item != undefined),
                "extend": view.getViewStateAndExtent().extent
            })
        })
            .then(resp => resp.json())
            .then((resp: any) => {
                console.log(resp)
                if (resp[0]) {
                    resp.forEach((item: any) => {
                        let capa = new VectorLayer({
                            source: new VectorSource<any>({
                                features: new GeoJSON({
                                    featureProjection: 'EPSG:4326'
                                }).readFeatures(item.geojson)
                            }),
                        });
                        setMinZoomToLayer(capa, 16, 11)
                        capa.set('id', item.id)
                        capa.set('administrado', item.administrado)
                        capa.set('infraestructura', item.infraestructura)
                        capa.set('hr', item.hr)
                        capa.set('instrumento', item.instrumento)
                        capa.setStyle(StyleSecondary)
                        map.addLayer(capa);
                    });
                }
            })
    })
}
export default getData