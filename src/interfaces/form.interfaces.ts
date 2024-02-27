export interface FormValues {
    hr: string,
    infraestructura: "postes" | "aereo" | "subterraneo" | 'Este campo es requerido',
    administrado: string,
    file: 'Este campo es requerido' | 'Archivo incorrecto!' | '',
    instrumento: 'PAMA' | 'DIA' | 'EIA-sd' | 'ITS' ,
    geojson?: any
}
export interface CountryValues {
    departamento: String,
    provincia: String,
    distrito: String
}