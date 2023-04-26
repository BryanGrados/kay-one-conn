import { crearOrden, obtenerOrden } from "@/lib/redis";
import { transformData } from "@/utils/transformData";
import axios from "axios";

const apiURL = process.env.SAMISHOP_API_URL;
const apiToken = process.env.SAMISHOP_API_TOKEN;

const oldOrden = /^SS(?:[0-9]{4})-(?:[0-9]{8})-(?:[0-9]{4})$/;
const newOrden = /^ss(?:[0-9]{13})$/;

export default async function handler(req, res) {
	const { orden } = req.query;

	//Validar si la orden cumple con el formato
	if (!oldOrden.test(orden) && !newOrden.test(orden)) {
		return res.status(400).json({ message: "Formato de orden no válida" });
	}

	//Obtener la orden en redis
	const isOrdenOnRedis = await obtenerOrden(orden);

	if (isOrdenOnRedis) {
		console.log("Orden encontrada en redis");
		return res.status(200).json(isOrdenOnRedis);
	}

	//Obtener los datos de la orden en la API
	const response = await axios.get(`${apiURL}/${encodeURIComponent(orden)}`, {
		headers: {
			Authorization: apiToken,
		},
	});

	let ordenData = await transformData([
		[response.data?.obj?.[0]?.datos_pedido?.datos_pedido[0]],
	]);
	//convert with javascript [{}] to {}
	ordenData = ordenData[0];

	console.log("Orden encontrada en API");
	//Guardar la orden en redis
	await crearOrden(ordenData);

	return res.status(200).json(ordenData);
}
