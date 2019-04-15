import React from 'react';

import './style.scss';

const Point = ({ name, onRemovePoint, onDragStart, onDragOver, onDragEnd }) => {
    return (
        <div
            className="point"
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <span className="point__text">{name}</span>
            <button className="point__button" onClick={onRemovePoint}>X</button>
        </div>
    );
}

export default Point;
