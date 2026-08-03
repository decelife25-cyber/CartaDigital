 "use client";

import { useState } from "react";

import type { ProductoEditor } from "@/types/producto";
import type { Familia } from "@/types/familia";
import type { Alergeno } from "@/types/alergeno";

import AlergenosSelector from "./AlergenosSelector";

interface Props {
  producto: ProductoEditor;

  familias: Familia[];

  alergenos: Alergeno[];

  onGuardar: (producto: ProductoEditor) => void;

  onEliminar