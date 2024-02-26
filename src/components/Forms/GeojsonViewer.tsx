function GeoJSONRenderer({ geoJSON }: { geoJSON: string }) {
    return (
        <pre>{geoJSON}</pre>
    );
}

export default GeoJSONRenderer