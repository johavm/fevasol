import { FormValues } from "../../../interfaces/form.interfaces";
import { ACCEPTED_FORMATS } from "./formatAcepted";

const validateForm = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.hr) {
        errors.hr = 'Este campo es requerido';
    } else if (values.hr.length !== 13 || values.hr.split('-').length !== 3) {
        errors.hr = 'No es una hoja de ruta correcta'
    }
    if (!values.infraestructura) {
        errors.infraestructura = 'Este campo es requerido';
    }
    if (!values.administrado) {
        errors.administrado = 'Este campo es requerido';
    }
    if (!values.instrumento) {
        errors.file = 'Este campo es requerido';
    } if (!values.file) {
        errors.file = 'Este campo es requerido';
    } else {
        const extension = '.' + values.file.split(".").pop()?.toLowerCase();
        if (!ACCEPTED_FORMATS.includes(extension)) {
            errors.file = 'Archivo incorrecto!';
        }
    }

    return errors;
};

export default validateForm