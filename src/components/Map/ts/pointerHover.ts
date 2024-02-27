import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition';
import { getCenter } from 'ol/extent';
import { Overlay } from 'ol';

function pointerHover(map: any) {
    const select = new Select({
        condition: pointerMove // Utilizar pointerMove para resaltar al pasar el mouse
    });
    map.addInteraction(select);

    let popup = document.createElement('div');
    popup.className = 'popupHover';
    popup.style.display = 'none'; // Inicialmente oculto

    let overlay = new Overlay({
        element: popup,
        positioning: 'bottom-center',
        offset: [0, -10]
    });
    map.addOverlay(overlay);
    select.on('select', function (e) {
        const feature = e.selected[0];
        if (feature) {
            const layer = select.getLayer(feature);
            const coordinates: any = feature.getGeometry()?.getExtent();
            overlay.setPosition(getCenter(coordinates));
            popup.innerHTML = '<p><strong>Hoja de Ruta:</strong> ' + layer.get('hr') + '</p>' +
                '<p><strong>Adminstrado:</strong> ' + layer.get('administrado') + '</p>' +
                '<p><strong>Infraestructura:</strong> ' + layer.get('infraestructura') + '</p>'+
                '<p><strong>Instrumento:</strong> ' + layer.get('instrumento') + '</p>'
            popup.style.display = 'block'
        }
    });
    map.on('click', function () {
        popup.style.display = 'none'
    });
}

export default pointerHover;
