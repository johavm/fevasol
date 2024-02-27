
function SelectBasemap({ value, onChange }: any) {
    return (
        <select className='position-absolute selectBasemap btn btn-dark' value={value} onChange={onChange}>
            <option value="OSM">OpenStreetMap</option>
            <option value="GoogleMaps">Google Maps</option>
            <option value="GoogleMapsSatelite">Google Maps Satétite</option>
        </select>
    )
}

export default SelectBasemap