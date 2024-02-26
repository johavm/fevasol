import { Modal } from "react-bootstrap"

function FormCountry({showFormCountry, toggleFormCountry} : any) {
  return (
   <Modal show={showFormCountry} onHide={toggleFormCountry} >
    <div>
      Aquí se selecciona el distrito
    </div>
   </Modal>
  )
}

export default FormCountry