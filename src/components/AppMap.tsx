import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Maps from './Map/Maps'
import FormLoadingLayer from './Forms/FormLoadingLayer'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


function AppMap() {
    const [geoJSONDataForm, setGeoJSONDataForm] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(false);


    const toggleForm = () => {
        setShowForm(prevState => !prevState); // Cambiar el estado actual de showForm
    };
    return (
        <div>
            <FormLoadingLayer setGeoJSONDataForm={setGeoJSONDataForm} showForm={showForm} toggleForm={toggleForm} />
            <div className='position-relative'>
                <Maps geoDataForm={geoJSONDataForm} />
                <DropdownButton className='position-absolute loadingLayer' id="dropdown-basic-button" title="Opciones">
                    <Dropdown.Item onClick={toggleForm}>Cargar KMZ</Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    )
}

export default AppMap;
