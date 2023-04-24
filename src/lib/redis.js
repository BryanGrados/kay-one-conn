import { createClient } from "redis";
import { Schema, Repository, EntityId } from "redis-om";

const url = process.env.REDIS_URL;

const ordenSchema = new Schema(
	"orden",
	{
		NUMERO_ORDEN: { type: "text" },
		CODIGO_DE_ORDEN: { type: "string" },
		FECHA_REGISTRO: { type: "text" },
		FECHA_PAGO: { type: "text" },
		FECHA_NACIMIENTO: { type: "string" },
		EMAIL_COMPRADOR: { type: "text" },
		MAILING_PROMOCIONAL: { type: "string" },
		NOMBRE_COMPRADOR: { type: "text" },
		TELEFONO_COMPRADOR: { type: "number" },
		SKU: { type: "string[]" },
		NOMBRE_PRODUCTO: { type: "string[]" },
		CANTIDAD: { type: "string[]" },
		MONEDA: { type: "string" },
		PRECIO_CATALOGO: { type: "string[]" },
		PRECIO_SALE: { type: "string[]" },
		DESCUENTO_CATALOGO: { type: "string[]" },
		DESCUENTO_CONDICION: { type: "number" },
		PRECIO_UNITARIO: { type: "string[]" },
		SUB_TOTAL: { type: "string[]" },
		PRECIO_ENVIO: { type: "number" },
		VENTA_TOTAL: { type: "string[]" },
		DESCUENTO_CUPON: { type: "number" },
		PRECIO_TOTAL_PROCESADO: { type: "string[]" },
		TOTAL_DESCUENTO: { type: "string[]" },
		NOMBRE_RECEPTOR: { type: "string" },
		DIRECCION: { type: "string" },
		DIRECCION_2: { type: "string" },
		DISTRITO_PROVINCIA: { type: "string" },
		DEPARTAMENTO: { type: "string" },
		UBIGEO: { type: "number" },
		PAIS: { type: "string" },
		TELEFONO: { type: "number" },
		CODIGO_PROMOCION: { type: "string" },
		METODO_DE_PAGO: { type: "string" },
		ESTADO_ORDEN: { type: "string" },
		TIPO_COMPROBANTE: { type: "string" },
		RUC: { type: "string" },
		RAZON_SOCIAL: { type: "string" },
		DIRECCION_DE_FACTURACION: { type: "string" },
		DISTRITO_PROVINCIA_FACTURACION: { type: "string" },
		DEPARTAMENTO_FACTURACION: { type: "string" },
		UBIGEO_FACTURACION: { type: "number" },
		PAIS_DE_FACTURACION: { type: "string" },
		REGALO: { type: "string" },
		DE: { type: "string" },
		PARA: { type: "string" },
		MO: { type: "string" },
		ID_PAGO: { type: "string" },
		TIPO_DOCUMENTO: { type: "string" },
		NUMERO_DOCUMENTO: { type: "number" },
		TOTAL_SIN_IGV: { type: "string[]" },
		PORCENTAJE_CUPON: { type: "number" },
		TOTAL_ORDEN: { type: "number" },
		FECHA_ENTREGA: { type: "string" },
		PEDIDO_SAP: { type: "string" },
		CODIGO_VENDEDOR: { type: "string" },
		COMISION_VENDEDOR: { type: "string" },
		SERVICIO_ENVIO: { type: "string" },
		TOTAL_PRECIO_ENVIO: { type: "number" },
		TOTAL_ORDEN_PRE: { type: "number" },
		DISTRITO: { type: "string" },
		PROVINCIA: { type: "string" },
		GRAN_TOTAL_ORDEN: { type: "number" },
		GRAN_TOTAL: { type: "number" },
		IMAGENES: { type: "string[]" },
	},
	{
		dataStructure: "HASH",
	},
);

const redisClient = createClient({ url });

redisClient.on("error", (err) => console.log("Redis Cliente Error", err));

const ordenRepository = new Repository(ordenSchema, redisClient);

export async function crearOrden(orden) {
	try {
		// // Reuse Redis connection across function calls
		// await redisClient.connect();

		// const ordenCreada = await ordenRepository.save(orden);

		// // Disconnect from Redis after use
		// await redisClient.disconnect();

		// console.log("Orden Creada", ordenCreada);

		// return ordenCreada;
		return orden;
	} catch (err) {
		console.error(err);
	}
}

export async function obtenerOrden(orden) {
	try {
		// Reuse Redis connection across function calls
		await redisClient.connect();

		const findOrden = await ordenRepository.fetch(orden);

		if (!findOrden.NUMERO_ORDEN) {
			await redisClient.disconnect();
			return;
		}

		// Disconnect from Redis after use
		await redisClient.disconnect();

		return findOrden;
	} catch (err) {
		console.error(err);
	}
}
