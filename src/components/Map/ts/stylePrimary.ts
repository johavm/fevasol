import { Style, Stroke, Circle, Fill } from 'ol/style';

// Estilo para las líneas
const lineStyle = new Style({
    stroke: new Stroke({
        color: 'red',
        width: 2
    })
});

// Estilo para los puntos
const pointStyle = new Style({
    image: new Circle({
        radius: 5,
        fill: new Fill({ color: 'blue' })
    })
});

// Función para combinar estilos
const combinedStyle = (feature: any) => {
    if (feature.getGeometry().getType() === 'LineString' || feature.getGeometry().getType() === 'MultiLineString') {
        return lineStyle;
    } else if (feature.getGeometry().getType() === 'Point') {
        return pointStyle;
    }
};

export default combinedStyle
