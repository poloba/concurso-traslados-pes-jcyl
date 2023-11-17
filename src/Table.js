import React, { useState, useCallback, useEffect } from "react";
import update from "immutability-helper";
import * as XLSX from "xlsx";
import TableRow from "./TableRow";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

const Table = ({ data }) => {
  const savedData = JSON.parse(localStorage.getItem("sortedData")) || data;
  const [sortedData, setSortedData] = useState(savedData);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [canDrag, setCanDrag] = useState(false);

  // Convertir tiempo a minutos para el ordenamiento
  const timeToMinutes = (timeStr) => {
    let totalMinutes = 0;

    // Extracción y conversión de horas a minutos
    const hoursRegex = /(\d+)\s*hora/;
    const hoursMatch = timeStr.match(hoursRegex);
    if (hoursMatch) {
      totalMinutes += parseInt(hoursMatch[1]) * 60;
    }

    // Extracción y adición de minutos
    const minutesRegex = /(\d+)\s*min/;
    const minutesMatch = timeStr.match(minutesRegex);
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }

    return totalMinutes;
  };

  // Función de ordenamiento
  const sortData = (field) => {
    const newOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...data].sort((a, b) => {
      let valueA = a.distancia[field];
      let valueB = b.distancia[field];

      if (field === "tiempo") {
        valueA = timeToMinutes(valueA);
        valueB = timeToMinutes(valueB);
      } else {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }

      return newOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    setSortedData(sorted);
  };

  useEffect(() => {
    localStorage.setItem("sortedData", JSON.stringify(sortedData));
  }, [sortedData]);

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setSortedData((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderRow = useCallback(
    (item, index) => {
      return (
        <TableRow
          id={item["codigo_centro"]}
          key={item["codigo_centro"]}
          item={item}
          index={index}
          moveRow={moveRow}
          canDrag={canDrag}
        />
      );
    },
    [moveRow, canDrag]
  );

  const transformDataForExport = (data) => {
    return data.map((item) => {
      // Excluir 'posicion', 'codigo_ine' y 'poblacion' del objeto
      const { posicion, codigo_ine, poblacion, ...rest } = item;
      const newItem = { ...rest };

      // Concatenar 'detalles' en una sola cadena con saltos de línea, si existe
      if (item.detalles && item.detalles.length > 0) {
        newItem.detalles = item.detalles
          .map(
            (detalle) =>
              `Nivel: ${detalle.nivel}\n LOE: ${detalle.loe}` +
              (detalle.extra ? `\n Extra: ${detalle.extra}` : "")
          )
          .join("\n\n");
      } else {
        newItem.detalles = ""; // En caso de que no haya 'detalles'
      }

      // Concatenar 'secciones' en una sola cadena con saltos de línea, si existe
      if (item.secciones && item.secciones.length > 0) {
        newItem.secciones = item.secciones
          .map((seccion) => `Tipo: ${seccion.tipo}\n Idioma: ${seccion.idioma}`)
          .join("\n\n");
      } else {
        newItem.secciones = ""; // En caso de que no haya 'secciones'
      }

      // Incluir 'distancia' como una cadena
      if (item.distancia) {
        newItem.distancia = `Km: ${item.distancia.km}\n Tiempo: ${item.distancia.tiempo}`;
      } else {
        newItem.distancia = ""; // En caso de que no haya 'distancia'
      }

      // Concatenar 'listado' en una sola cadena con saltos de línea, si existe
      if (item.listado && item.listado.length > 0) {
        newItem.listado = item.listado
          .map((listado, index) => `${listado}${item.listado.length === 2 && index === 0 ? ', ' : ''}`)
          .join("\n\n");
      } else {
        newItem.listado = ""; // En caso de que no haya 'listado'
      }

      return newItem;
    });
  };

  const exportToExcel = () => {
    const transformedData = transformDataForExport(sortedData);
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listado exportado");
    XLSX.writeFile(wb, "listado_exportado.xlsx");
  };

  return (
    <>
      <div className="head">
        <h1>Concurso de traslados JCYL 2023/2024 - PES</h1>
        <h4>Partiendo desde Burgos</h4>
        <p>
          Incluidos los listados <span className="list list__II">II</span>
          <span className="list list__IV">IV</span>
          <span className="list list__VI">VI</span>
        </p>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => setCanDrag(!canDrag)}
            startIcon={canDrag ? <EditOffIcon /> : <EditIcon />}
          >
            {canDrag ? "Deshabilitar editar listado" : "Editar listado"}
          </Button>
          <Button
            variant="contained"
            onClick={exportToExcel}
            startIcon={<DownloadIcon />}
          >
            Descargar listado ordenado en Excel
          </Button>
        </Stack>
      </div>
      <div>
        <div className="table__head">
          <div className="col__1">Nº</div>
          <div className="col__1__0">Listado</div>
          <div className="col__1__1" onClick={() => sortData("km")}>
            Distancia
          </div>
          <div className="col__1__2" onClick={() => sortData("tiempo")}>
            Tiempo
          </div>
          <div className="col__2">Código Centro</div>
          <div className="col__5">Denominación</div>
          <div className="col__3">Localidad</div>
          <div className="col__4">Provincia</div>
          <div className="col__6">Código Localidad</div>
          <div
            className="col__7"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="col__7__1">Nivel</div>
            <div className="col__7__2">Enseñanzas LOE</div>
            <div className="col__7__3">Extra</div>
          </div>
          <div className="col__8">Secciónes SB / SL</div>
          <div className="col__8">Poblacion</div>
        </div>
        {sortedData.map((item, index) => renderRow(item, index))}
      </div>
    </>
  );
};

export default Table;
