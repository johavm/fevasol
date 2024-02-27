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
const StylePrimary = (feature: any) => {
    if (feature.getGeometry().getType() === 'LineString' || feature.getGeometry().getType() === 'MultiLineString') {
        return lineStyle;
    } else if (feature.getGeometry().getType() === 'Point') {
        return pointStyle;
    }
};

const pointStyleSecondary = new Style({
    image: new Circle({
        radius: 3,
        fill: new Fill({ color: generarColorAleatorio() })
    })
});

const lineStyleSecondary = new Style({
    stroke: new Stroke({
        color: generarColorAleatorio(),
        width: 1
    })
});

function generarColorAleatorio(): string {
    const r = Math.floor(Math.random() * 100) + 50; // Rojo
    const g = Math.floor(Math.random() * 100) + 50; // Verde
    const b = Math.floor(Math.random() * 100) + 50; // Azul
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    if (r > g && r > b) {
        return generarColorAleatorio();
    }
    
    return color;
}


const StyleSecondary = (feature: any) => {
    if (feature.getGeometry().getType() === 'LineString' || feature.getGeometry().getType() === 'MultiLineString') {
        return lineStyleSecondary;
    } else if (feature.getGeometry().getType() === 'Point') {
        return pointStyleSecondary;
    }
};

export {StylePrimary, StyleSecondary}
