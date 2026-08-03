 "use client";

import { useEffect, useState } from "react";

import ProductoEditor from "@/components/admin/ProductoEditor";

import { obtenerFamilias } from "@/lib/admin/familias";
import { obtenerProductos } from "@/lib/admin/productos";
import {
  obtenerAlergenos,
  obtenerAlergenosProducto,
  guardarAlergenosProducto,
} from "@/lib/admin/alergenos";

import type { ProductoEditor as Producto } from "@/types/producto";
import type { Familia } from "@/types/familia";
import type { Alergeno } from "@/types/alergeno";

export default function AdminPage() {

  const [familias, setFamilias] = useState<Familia[]>([]);
  const [alergenos, setAlergenos] = useState<Alergeno[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [indice, setIndice] = useState(0);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {

    const fam = await obtenerFamilias();
    const alg = await obtenerAlergenos();
    const pro = await obtenerProductos();

    const lista: Producto[] = [];

    for (const p of pro) {

      lista.push({
        ...p,
        alergenos: await obtenerAlergenosProducto(p.id),
      });

    }

    setFamilias(fam);
    setAlergenos(alg);
    setProductos(lista);

  }

  if (productos.length === 0)
    return <div className="p-6">Cargando...</div>;

  const producto = productos[indice];

  return (

    <ProductoEditor

      producto={producto}

      familias={familias}

      alergenos={alergenos}

      onAnterior={() =>
        setIndice((i) =>
          i === 0 ? productos.length - 1 : i - 1
        )
      }

      onSiguiente={() =>
        setIndice((i) =>
          i === productos.length - 1 ? 0 : i + 1
        )
      }

      onGuardar={async (p) => {

        console.log("Guardar", p);

        await guardarAlergenosProducto(
          p.id,
          p.alergenos
        );

      }}

      onNuevo={() =>
        alert("Pendiente de implementar")
      }

      onEliminar={() =>
        alert("Pendiente de implementar")
      }

    />

  );

}