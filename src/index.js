import React from 'react';
import ReactDOM from 'react-dom';

import RouteEditor from './RouteEditor/RouteEditor.jsx';

const renderDiv = document.getElementById('render');
ReactDOM.render(<RouteEditor/>, renderDiv);

const init = () => {
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 7,
    });

    const multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [],
    });
    multiRoute.editor.start();
    myMap.geoObjects.add(multiRoute);

    const customizeLastPoint = (index, name) => {
        multiRoute.model.events.once('requestsuccess', () => {
            const yandexWayPoint = multiRoute.getWayPoints().get(index);
            ymaps.geoObject.addon.balloon.get(yandexWayPoint);
            yandexWayPoint.options.set({
                preset: 'islands#grayStretchyIcon',
                iconContentLayout: ymaps.templateLayoutFactory.createClass(
                    name,
                ),
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    name,
                ),
            });
        });
    }

    ReactDOM.render(<RouteEditor myMap={myMap} multiRoute={multiRoute} customizeLastPoint={customizeLastPoint} />, renderDiv);
}

ymaps.ready(init);
