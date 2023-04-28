import { Schema, Repository } from "redis-om";
import { createClient } from "redis";

const url = process.env.REDIS_URL;

const ordenSchema = new Schema(
	"orden",
	{
		NUMERO_ORDEN: { type: "text" },
		CODIGO_DE_ORDEN: { type: "text" },
		FECHA_REGISTRO: { type: "text" },
		FECHA_PAGO: { type: "text" },
		FECHA_NACIMIENTO: { type: "text" },
		EMAIL_COMPRADOR: { type: "text" },
		MAILING_PROMOCIONAL: { type: "text" },
		NOMBRE_COMPRADOR: { type: "text" },
		TELEFONO_COMPRADOR: { type: "number" },
		MONEDA: { type: "text" },
		PRECIO_ENVIO_TOTAL: { type: "number" },
		// LISTADO_PRODUCTOS: { type: "" },
		DESCUENTO_CONDICION: { type: "number" },
		GRAN_TOTAL_API: { type: "number" },
		GRAN_TOTAL: { type: "number" },
		NOMBRE_RECEPTOR: { type: "text" },
		DIRECCION: { type: "text" },
		DIRECCION_2: { type: "text" },
		DISTRITO: { type: "text" },
		PROVINCIA: { type: "text" },
		DEPARTAMENTO: { type: "text" },
		UBIGEO: { type: "text" },
		DISTRITO_PROVINCIA: { type: "text" },
		PAIS: { type: "text" },
		TELEFONO: { type: "number" },
		CODIGO_PROMOCION: { type: "text" },
		METODO_DE_PAGO: { type: "text" },
		ESTADO_ORDEN: { type: "text" },
		TIPO_COMPROBANTE: { type: "text" },
		RUC: { type: "text" },
		RAZON_SOCIAL: { type: "text" },
		DIRECCION_DE_FACTURACION: { type: "text" },
		DISTRITO_PROVINCIA_FACTURACION: { type: "text" },
		DEPARTAMENTO_FACTURACION: { type: "text" },
		UBIGEO_FACTURACION: { type: "text" },
		PAIS_DE_FACTURACION: { type: "text" },
		REGALO: { type: "text" },
		DE: { type: "text" },
		PARA: { type: "text" },
		MO: { type: "text" },
		ID_PAGO: { type: "text" },
		NUMERO_DOCUMENTO: { type: "number" },
		TIPO_DOCUMENTO: { type: "text" },
		FINAL_TOTAL_SIN_IGV: { type: "number" },
		PORCENTAJE_CUPON: { type: "number" },
		TOTAL_ORDEN: { type: "number" },
		DESCUENTO_CUPON: { type: "number" },
		FECHA_ENTREGA: { type: "text" },
		PEDIDO_SAP: { type: "text" },
		CODIGO_VENDEDOR: { type: "text" },
		COMISION_VENDEDOR: { type: "text" },
		SERVICIO_ENVIO: { type: "text" },
	},
	{
		dataStructure: "JSON",
	},
);

export async function crearOrden(ordenData) {
	const redisClient = createClient({ url });
	try {
		const ordenRepository = new Repository(ordenSchema, redisClient);
		const ordenCreada = await ordenRepository.save(
			ordenData.NUMERO_ORDEN,
			ordenData,
		);
		redisClient.quit(); // cerrar la conexion
		return ordenCreada;
	} catch (err) {
		redisClient.quit(); // cerrar la conexion
		console.error(err);
	}
}

export async function obtenerOrden(orden) {
	const redisClient = createClient({ url });
	try {
		const ordenRepository = new Repository(ordenSchema, redisClient);
		const findOrden = await ordenRepository.fetch(orden);

		if (!findOrden.NUMERO_ORDEN) {
			redisClient.quit(); // cerrar la conexion
			return;
		} else {
			redisClient.quit(); // cerrar la conexion
			return findOrden;
		}
	} catch (err) {
		redisClient.quit(); // cerrar la conexion
		console.error(err);
	}
}
