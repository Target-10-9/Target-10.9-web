export async function addPoint(point: {
    x_Coordinate: number;
    y_Coordinate: number;
    dateTimePoint: string;
    sessionId: string;
}) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5203/api/Point`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(point),
    });

    console.log("Response :", response);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
    }

    return response.json();
}
