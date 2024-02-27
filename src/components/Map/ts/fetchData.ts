import { FormValues } from "../../../interfaces/form.interfaces";

async function postData(method: string, body: FormValues) {
    try {
        if (method && body) {
            const response = await fetch(import.meta.env.VITE_URL_API, {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "method": method,
                    "administrado": body.administrado,
                    "document": body.hr,
                    "infraestructura": body.infraestructura,
                    "geojson": JSON.parse(body.geojson)
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data
        } else {
            throw new Error('Datos incompletos')
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export { postData };
