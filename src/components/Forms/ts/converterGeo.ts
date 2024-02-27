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


async function filetogeojson(file: File): Promise<any> {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    try {
      reader.onload = () => {
        const objeto = JSON.parse(reader.result as string);
        resolve(objeto)
      }
      reader.readAsText(file);
    } catch (e) {
      reject(e)
    }
  })
  return await promise
}

function findAll(geojson: any, typeFeature: Array<string>) {
  const featuresFiltered: any[] = [];

  function findPointsRecursive(feature: any) {
    if (typeFeature.includes(feature.geometry.type)) {
      featuresFiltered.push(feature);
    } else if (feature.geometry.type === 'GeometryCollection') {
      feature.geometry.geometries.forEach((geometry: any) => {
        findPointsRecursive({
          type: 'Feature',
          geometry: geometry,
          properties: feature.properties
        });
      });
    }
  }

  geojson.features.forEach((feature: any) => {
    findPointsRecursive(feature);
  });

  return featuresFiltered;
}

function filterData(geojson: any, selectedType: string) {
  let filteredFeatures: any = [];

  if (selectedType === 'Point') {
    filteredFeatures = findAll(geojson, ['Point'])
  } else if (selectedType === 'LineString') {
    filteredFeatures = findAll(geojson, ['LineString', 'MultiLineString'])
  }
  const filteredGeoJSON = {
    type: "FeatureCollection",
    features: filteredFeatures
  };
  return filteredGeoJSON
}

export { kmltogeojson, kmztogeojson, filetogeojson, filterData }