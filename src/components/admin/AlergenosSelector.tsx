 "use client";

import type { Alergeno } from "@/types/alergeno";

interface Props {
  alergenos: Alergeno[];
  seleccionados: string[];
  onChange: (ids: string[]) => void;
}

export default function AlergenosSelector({
  alergenos,
  seleccionados,
  onChange,
}: Props) {
  function toggle(id: string) {
    if (seleccionados.includes(id)) {
      onChange(seleccionados.filter((x) => x !== id));
    } else {
      onChange([...seleccionados, id]);
    }
  }

  return (
    <div className="space-y-3">

      <h3 className="text-lg font-semibold">
        Alérgenos
      </h3>

      <div className="grid grid-cols-2 gap-3">

        {alergenos.map((a) => (

          <label
            key={a.id}
            className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
          >

            <input
              type="checkbox"
              checked={seleccionados.includes(a.id)}
              onChange={() => toggle(a.id)}
              className="h-5 w-5"
            />

            <span className="text-xl">
              {a.icono}
            </span>

            <div>

              <div className="font-medium">
                {a.nombre}
              </div>

              <div className="text-xs text-gray-500">
                {a.sigla}
              </div>

            </div>

          </label>

        ))}

      </div>

    </div>
  );
}