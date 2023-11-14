import React, { useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import clsx from "clsx";

const style = {
  background: "#fff",
};

const TableRow = ({ id, item, index, moveRow, canDrag }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "item",
    canDrop: () => canDrag,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!canDrag || !ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "item",
    canDrag: canDrag,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  const cursor = isDragging ? 'move' : 'auto';

  useEffect(() => {
    if (canDrag) {
      drag(ref);
    } else {
      drop(ref);
    }
  }, [canDrag, drag, drop]);

  return (
    <div
      ref={ref}
      style={{ ...style, opacity, cursor }}
      data-handler-id={handlerId}
      className="table__row"
    >
      <div className="col__1">{index + 1}</div>
      <div className="col__1__1">{item["distancia"].km}</div>
      <div className="col__1__2">{item["distancia"].tiempo}</div>
      <div className="col__2">{item["codigo_centro"]}</div>
      <div className="col__5 table__row__div">{item["denominacion"]}</div>
      <div className="col__3">{item["localidad"]}</div>
      <div className="col__4">{item["provincia"]}</div>
      <div className="col__6">{item["codigo-localidad"]}</div>
      <div className="col__7 table__inside">
        {item["detalles"].map((item, index) => (
          <div className="table__inside__row">
            <div
              className={clsx(
                "col__7__1 col",
                item.nivel === "ESO" && "col--eso",
                item.nivel === "BACH" && "col--bach",
                item.nivel !== "BACH" && item.nivel !== "ESO" && "col--ciclo",
              )}
            >
              {item.nivel}
            </div>
            <div className="col__7__2">{item.loe}</div>
            {item.extra && <div className="col__7__3">{item.extra}</div>}
          </div>
        ))}
      </div>
      <div className="col__8 table__inside--row">
        {item["secciones"] &&
          item["secciones"].map((item, index) => (
            <div className="table__inside__row">
              <div>{item.tipo}</div>
              <div>{item.idioma}</div>
            </div>
          ))}
      </div>
      <div className="col__8">{item["poblacion"]}</div>
    </div>
  );
};

export default TableRow;
