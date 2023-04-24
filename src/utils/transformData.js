const ubigeos = require("@/utils/ubigeos.json");

export async function transformData(datos_pedido) {
	//Optimizado
	function formattedDate(date) {
		return date
			? date.split("T")[0].split("-").reverse().join("/")
			: "--/--/----";
	}

	//Optimizado
	const readArray = (array, key) => array.map((item) => item[key]);

	//Optimizado
	function fixedNumber(number, decimals) {
		if (Array.isArray(number)) {
			return number.map((item) => {
				return Math.round(item * 10 ** decimals) / 10 ** decimals;
			});
		} else {
			return Math.round(number * 10 ** decimals) / 10 ** decimals;
		}
	}

	//Optimizado
	function formatText(string) {
		return string?.trim().toUpperCase();
	}

	//Optimizado
	function getUbigeo(distrito, provincia, ubigeos) {
		const ubigeo = ubigeos.find(({ NOMBDIST, NOMBPROV }) => {
			const cleanDistrito = distrito
				.trim()
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			const cleanProvincia = provincia
				.trim()
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			return (
				cleanDistrito.includes(
					NOMBDIST.trim()
						.toLowerCase()
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, ""),
				) &&
				cleanProvincia.includes(
					NOMBPROV.trim()
						.toLowerCase()
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, ""),
				)
			);
		});

		return ubigeo ? ubigeo.UBIGEO : "Ubigeo no encontrado";
	}

	//Optimizado
	function getRuc(path, comprobante) {
		const { id_cliente } = path[0].datos_facturacion[0];
		return comprobante.toLowerCase() === "factura" ? id_cliente : "";
	}

	//Optimizado
	function getRazonSocial(path, comprobante) {
		const { nombres_facturacion } = path[0].datos_facturacion[0];
		return comprobante.toLowerCase() === "factura"
			? formatText(nombres_facturacion)
			: "";
	}

	//Optimizado
	function getNumeroDocumento(path, ruc) {
		if (path[0].datos_envio[0].dni_envio === undefined || "") {
			return ruc;
		}
		return fixedNumber(path[0].datos_facturacion[0].id_cliente, 0);
	}

	//Optimizado
	function getTipoDocumento(comprobante) {
		const comprobanteLow = comprobante.toLowerCase();

		const documentoPorComprobante = {
			factura: "RUC",
			boleta: "DNI",
		};

		return documentoPorComprobante[comprobanteLow] || "DNI";
	}

	return new Promise((resolve, reject) => {
		try {
			const result = [];
			datos_pedido.forEach((path) => {
				const numero_orden = path[0].cabecera_pedido[0].numero_orden;
				const codigo_orden = "";
				const fecha_registro = formattedDate(
					path[0].cabecera_pedido[0].fecha_pedido,
				);
				const fecha_pago = formattedDate(path[0].situacion_pagos[0].fecha_pago);
				const fecha_nacimiento = "";
				const email_comprador = formatText(
					path[0].datos_facturacion[0].email_facturacion,
				);
				const mailing_promocional = formatText(
					path[0].terminos_legales[0].acepta_condiciones,
				);
				const nombre_comprador = formatText(
					path[0].datos_facturacion[0].nombres_facturacion,
				);
				const telefono_comprador = fixedNumber(
					path[0].datos_facturacion[0].telefono_facturacion,
					0,
				);
				const sku = fixedNumber(
					readArray(path[0].detalle_pedido, "sku"),
					0,
					10,
				);
				const nombre_producto = readArray(path[0].detalle_pedido, "title").map(
					(item) => {
						return formatText(item);
					},
				);
				const cantidad = readArray(path[0].detalle_pedido, "quantity_sku");
				const moneda = path[0].datos_facturacion[0].moneda;
				const precio_catalogo = readArray(path[0].detalle_pedido, "price");
				const precio_sale = fixedNumber(
					readArray(path[0].detalle_pedido, "sale_price"),
					2,
					10,
				);
				const descuento_catalogo = precio_catalogo.map((precio, index) => {
					return fixedNumber(precio - precio_sale[index], 2);
				});
				const descuento_condicion = 0;
				const precio_unitario = precio_sale;
				const sub_total = precio_unitario.map((precio, index) => {
					return fixedNumber(precio * cantidad[index], 2);
				});
				const total_precio_envio = fixedNumber(
					path[0].resumen_pedido[0].costo_envio,
					2,
				);
				const precio_envio = fixedNumber(
					total_precio_envio / cantidad.length,
					4,
				);
				const venta_total = sub_total.map((precio) => {
					return fixedNumber(precio + precio_envio, 4);
				});
				const gran_total_samishop = path[0].resumen_pedido[0].gran_total;
				const gran_total = fixedNumber(
					venta_total.reduce((a, b) => a + b, 0),
					2,
				);
				const precio_total_procesado = venta_total;
				const total_descuento = descuento_catalogo;
				const nombre_receptor = formatText(
					path[0].datos_envio[0].nombres_envio,
				);
				const direccion = formatText(path[0].datos_envio[0].direccion_envio);
				const direccion2 = formatText(path[0].datos_envio[0].referencia_envio);
				const distrito = formatText(path[0].datos_envio[0].distrito);
				const provincia = formatText(path[0].datos_envio[0].provincia);
				const distrito_provincia = `${distrito} | ${provincia}`;
				const departamento = formatText(path[0].datos_envio[0].departamento);
				const ubigeo = fixedNumber(getUbigeo(distrito, provincia, ubigeos), 0);
				const pais = formatText(path[0].datos_envio[0].pais)
					.replace(/PERU/g, "PERÚ")
					.replace(/\n/g, "");
				const telefono = fixedNumber(path[0].datos_envio[0].telefono_envio, 0);
				const codigo_promocion = path[0].cupon;
				const metodo_pago = path[0].situacion_pagos[0].metodo_pago;
				const estado_orden = path[0].situacion_pagos[0].estado_pago;
				const tipo_comprobante = path[0].datos_facturacion[0].tipo_de_doc;
				const ruc = getRuc(path, tipo_comprobante);
				const razon_social = formatText(getRazonSocial(path, tipo_comprobante));
				const direccion_facturacion = `${direccion} ${direccion2}`;
				const distrito_provincia_facturacion = distrito_provincia;
				const departamento_facturacion = departamento;
				const ubigeo_facturacion = ubigeo;
				const pais_facturacion = pais;
				const regalo = "NO";
				const de = "";
				const para = "";
				const mo = numero_orden.replace("ss", "MO");
				const id_pago = path[0].situacion_pagos[0].mo;
				const numero_documento = getNumeroDocumento(path, ruc);
				const tipo_documento = getTipoDocumento(tipo_comprobante);
				const total_sin_igv = venta_total.map((precio) => {
					return fixedNumber(precio / 1.18, 4);
				});
				const porcentaje_cupon = 0;
				const total_orden = fixedNumber(
					venta_total.reduce((a, b) => a + b, 0),
					2,
				);
				const total_orden_final = fixedNumber(
					total_orden - (total_orden - gran_total_samishop),
					2,
				);
				const descuento_cupon = fixedNumber(
					(total_orden - gran_total_samishop) / cantidad.length,
					2,
				);

				const fecha_entrega = "";
				const pedido_sap = "";
				const codigo_vendedor = "";
				const comision_vendedor = "";
				const servicion_envio = formatText(
					path[0].datos_envio[0].servicio_envio,
				);

				result.push({
					NUMERO_ORDEN: numero_orden,
					CODIGO_DE_ORDEN: codigo_orden,
					FECHA_REGISTRO: fecha_registro,
					FECHA_PAGO: fecha_pago,
					FECHA_NACIMIENTO: fecha_nacimiento,
					EMAIL_COMPRADOR: email_comprador,
					MAILING_PROMOCIONAL: mailing_promocional,
					NOMBRE_COMPRADOR: nombre_comprador,
					TELEFONO_COMPRADOR: telefono_comprador,
					SKU: sku,
					NOMBRE_PRODUCTO: nombre_producto,
					CANTIDAD: cantidad,
					MONEDA: moneda,
					PRECIO_CATALOGO: precio_catalogo,
					PRECIO_SALE: precio_sale,
					DESCUENTO_CATALOGO: descuento_catalogo,
					DESCUENTO_CONDICION: descuento_condicion,
					PRECIO_UNITARIO: precio_unitario,
					SUB_TOTAL: sub_total,
					PRECIO_ENVIO: precio_envio,
					VENTA_TOTAL: venta_total,
					DESCUENTO_CUPON: descuento_cupon,
					PRECIO_TOTAL_PROCESADO: precio_total_procesado,
					TOTAL_DESCUENTO: total_descuento,
					NOMBRE_RECEPTOR: nombre_receptor,
					DIRECCION: direccion,
					DIRECCION_2: direccion2,
					DISTRITO_PROVINCIA: distrito_provincia,
					DEPARTAMENTO: departamento,
					UBIGEO: ubigeo,
					PAIS: pais,
					TELEFONO: telefono,
					CODIGO_PROMOCION: codigo_promocion,
					METODO_DE_PAGO: metodo_pago,
					ESTADO_ORDEN: estado_orden,
					TIPO_COMPROBANTE: tipo_comprobante,
					RUC: ruc,
					RAZON_SOCIAL: razon_social,
					DIRECCION_DE_FACTURACION: direccion_facturacion,
					DISTRITO_PROVINCIA_FACTURACION: distrito_provincia_facturacion,
					DEPARTAMENTO_FACTURACION: departamento_facturacion,
					UBIGEO_FACTURACION: ubigeo_facturacion,
					PAIS_DE_FACTURACION: pais_facturacion,
					REGALO: regalo,
					DE: de,
					PARA: para,
					MO: mo,
					ID_PAGO: id_pago,
					TIPO_DOCUMENTO: tipo_documento,
					NUMERO_DOCUMENTO: numero_documento,
					TOTAL_SIN_IGV: total_sin_igv,
					PORCENTAJE_CUPON: porcentaje_cupon,
					TOTAL_ORDEN: total_orden_final,
					FECHA_ENTREGA: fecha_entrega,
					PEDIDO_SAP: pedido_sap,
					CODIGO_VENDEDOR: codigo_vendedor,
					COMISION_VENDEDOR: comision_vendedor,
					SERVICIO_ENVIO: servicion_envio,
					//**************//
					TOTAL_PRECIO_ENVIO: total_precio_envio,
					TOTAL_ORDEN_PRE: total_orden,
					DISTRITO: distrito,
					PROVINCIA: provincia,
					GRAN_TOTAL_SAMISHOP: gran_total_samishop,
					GRAN_TOTAL: gran_total,
					//**************//
				});
			});
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
}
