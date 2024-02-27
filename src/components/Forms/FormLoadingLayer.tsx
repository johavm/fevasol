import { Modal } from 'react-bootstrap';
import { filetogeojson, filterData, kmltogeojson, kmztogeojson } from './ts/converterGeo';
import { FormValues } from "../../interfaces/form.interfaces";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRef, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { ACCEPTED_FORMATS } from './ts/formatAcepted';
import validateForm from './ts/validateForm';
import { postData } from '../Map/ts/postData';

function FormLoadingLayer({ setGeoJSONDataForm, toggleForm, showForm }: any) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const initialValues: FormValues = {
        hr: "",
        infraestructura: "postes",
        administrado: "amov",
        instrumento: 'DIA',
        file: ''
    }
    const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
        setOpen(true);
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
            geojson = filterData(geojson, `${values.infraestructura == "postes" ? "Point" : "LineString"}`)
            if (!geojson.features[0]){
                alert(`No presenta datos de tipo: ${values.infraestructura == "postes" ? "Point" : "LineString"}`)
            } else{
                const posGeojson: any = { geojson: JSON.stringify(geojson, null, 2), ...values }
                console.log(posGeojson)
                setGeoJSONDataForm(posGeojson)
                postData('postData', posGeojson)
                toggleForm()
            }
        }
        setOpen(false);
        setSubmitting(false);
    };
    return (
        <Modal show={showForm} onHide={toggleForm}>
            <div className='mb-3'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={validateForm}
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
                                <label className='col-form-label text-sm-start me-3' htmlFor="instrumentoSelect">Infraestructura</label>
                                <Field className='form-select' as="select" name="instrumento" id="instrumentoSelect">
                                    <option value="DIA">DIA</option>
                                    <option value="PAMA">PAMA</option>
                                    <option value="ITS">ITS</option>
                                    <option value="EIA-sd">EIA-sd</option>
                                </Field>
                                <ErrorMessage name="instrumento" component="div" className="text-danger" />
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Modal>
    )
}

export default FormLoadingLayer