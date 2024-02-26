import { Modal } from 'react-bootstrap';
import { filetogeojson, kmltogeojson, kmztogeojson } from '../../ts/converterGeo';
import { FormValues } from "../../interfaces/form.interfaces";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRef } from 'react';

function FormLoadingLayer({ setGeoJSONDataForm, toggleForm, showForm }: any) {
    const ACCEPTED_FORMATS = [".kmz", ".kml", ".geojson"];
    const inputRef = useRef<HTMLInputElement>(null);
    const initialValues: FormValues = {
        hr: "",
        infraestructura: "postes",
        administrado: "amov",
        file: ''
    }


    const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
        setSubmitting(true);
        const selectedFile = inputRef.current?.files?.[0];
        if (selectedFile) {
            const extension = selectedFile.name.split(".").pop()?.toLowerCase();
            let geojson;
            switch (extension) {
                case "kmz":
                    try {
                        geojson = await kmztogeojson(selectedFile);
                    } catch (error) {
                        console.error(error);
                    }
                    break;
                case "kml":
                    try {
                        geojson = await kmltogeojson(selectedFile);
                    } catch (error) {
                        console.error(error);
                    }
                    break;
                case "geojson":
                    try {
                        geojson = await filetogeojson(selectedFile);
                    } catch (err) {
                        console.error(err);
                    }
                    break;
                default:
                    alert("Formato incorrecto. Por favor, seleccione un archivo con uno de estos formatos: " + ACCEPTED_FORMATS.join(", "));
            }
            setGeoJSONDataForm({ geojson: JSON.stringify(geojson, null, 2), ...values })
        }
        toggleForm()
        setSubmitting(false);
    };

    const validate = (values: FormValues) => {
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
        if (!values.file) {
            errors.file = 'Este campo es requerido';
        } else {
            const extension = '.' + values.file.split(".").pop()?.toLowerCase();
            if (!ACCEPTED_FORMATS.includes(extension)) {
                errors.file = 'Archivo incorrecto!';
            }
        }

        return errors;
    };
    return (
        <Modal show={showForm} onHide={toggleForm}>
            <div className='mb-3'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={validate}
                >
                    {({ isSubmitting }) => (
                        <Form className='container-fluid m-0 p-6 row d-flex smb-3'>
                            <div className='d-flex justify-content-center'>
                                <h1 className='p-2'>Datos del proyecto</h1>
                            </div>
                            <div className="row">
                                <label className='col-form-label text-sm-start me-3' htmlFor="inputHR">Hoja de Ruta</label>
                                <Field className='form-control' id='inputHR' type="text" name="hr" placeholder="E-123456-2023" />
                                <ErrorMessage name="hr" component="div" className="text-danger" />
                            </div>
                            <div className="row">
                                <label className='col-form-label text-sm-start me-3' htmlFor="infraestructuraSelect">Infraestructura</label>
                                <Field className='form-select' as="select" name="infraestructura" id="infraestructuraSelect">
                                    <option value="postes">Postes</option>
                                    <option value="aereo">Cableado aéreo</option>
                                    <option value="subterraneo">Cableado subterráneo</option>
                                </Field>
                                <ErrorMessage name="infraestructura" component="div" className="text-danger" />
                            </div>
                            <div className="row">
                                <label className='col-form-label text-sm-start me-3' htmlFor="administradoSelect">Administrado</label>
                                <Field className='form-select' as="select" name="administrado" id="administradoSelect">
                                    <option value="amov">América Móvil</option>
                                    <option value="telefonica">Telefonica del Perú</option>
                                </Field>
                                <ErrorMessage name="administrado" component="div" className="text-danger" />
                            </div>
                            <div className="row">
                                <label className='col-form-label text-sm-start me-3' htmlFor="fileKMZ">KMZ</label>
                                <Field innerRef={inputRef} className='form-control' id='fileKMZ' type="file" name="file" accept={ACCEPTED_FORMATS.join(", ")} />
                                <ErrorMessage name="file" component="div" className="text-danger" />
                            </div>
                            <div className='d-flex justify-content-end'>
                                <button type="submit" className='btn btn-dark mt-3' disabled={isSubmitting}>
                                    {isSubmitting ? 'Cargando...' : 'Cargar información'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
}

export default FormLoadingLayer