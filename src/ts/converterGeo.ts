import { kml as toGeoJSON } from "@tmcw/togeojson";
import JSZip from "jszip";

async function kmltogeojson(file: File): Promise<any> {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
        reader.onload = () => {
            const geojsonFile = toGeoJSON(
                new DOMParser().parseFromString(reader.result as string, "text/xml")
            );
            resolve(geojsonFile);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
    });
    reader.readAsText(file, "text/xml");
    return await promise;
}

async function kmztogeojson(file: File): Promise<any> {
    const zip = new JSZip();
    const kml = await zip.loadAsync(file).then((zip) => {
        return zip.file(/\.kml$/i)[0];
    });
    const kmlString = await kml.async("string");
    const geojson = toGeoJSON(new DOMParser().parseFromString(kmlString, "text/xml"));
    return geojson;
}

async function filetogeojson(file: File): Promise<any>  {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) =>{
      try{
        reader.onload = () => {
          const objeto = JSON.parse(reader.result as string);
          resolve(objeto)
        }
        reader.readAsText(file);
      } catch(e) {
        reject(e)
      }
    })
    return await promise
  }

export { kmltogeojson, kmztogeojson , filetogeojson}