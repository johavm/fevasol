export interface FormValues {
    hr: string,
    infraestructura: "postes" | "aereo" | "subterraneo" | 'Este campo es requerido',
    administrado: string,
    file:  'Este campo es requerido' | 'Archivo incorrecto!' | ''
    geojson?: any
}