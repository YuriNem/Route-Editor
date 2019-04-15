import React from 'react';

import './style.scss';

import Point from '../Point/Point.jsx';

export default class RouteEditor extends React.Component {
    state = {
        input: '',
        points: [],
        dragIndex: -1,
    }

    onSubmitInput = event => {
        event.preventDefault();

        const { input, points } = this.state;
        const { myMap, multiRoute } = this.props;

        if (input) {
            this.setState({
                input: '',
                points: [ ...this.mergePoints(points, multiRoute), {
                    name: input,
                    cords: myMap.getCenter(),
                }] 
            });
        }
    }

    onChangeInput = event => {
        const { points } = this.state;
        const { multiRoute } = this.props;

        this.setState({
            input: event.target.value,
            points: this.mergePoints(points, multiRoute),
        });
    }

    onRemovePoint = index => () => {
        const { points } = this.state;
        const { multiRoute } = this.props;

        this.setState({
            points: this
                .mergePoints(points, multiRoute, index),
        });
    }

    onDragStart = index => () => {
        const { points } = this.state;
        const { multiRoute } = this.props;

        this.setState({
            dragIndex: index,
            points: this
                .mergePoints(points, multiRoute),
        });
    }

    onDragEnd = () => {
        this.setState({ dragIndex: -1 });
    }

    onDragOver = index => () => {
        const { dragIndex, points } = this.state;
        const { multiRoute } = this.props;

        if (dragIndex === index) {
            return;
        }

        const dragPoints = points.map((point, i, ps) => {
            if (i === dragIndex) {
                return ps[index];
            } else if (i === index) {
                return ps[dragIndex];
            }
            return point;
        });
        this.setState({ 
            dragIndex: index,
            points: this.mergePoints(dragPoints, multiRoute, -1, true),
        });
    }

    mergePoints(points, multiRoute, filterIndex=-1, cordsPriority) {
        const multiRoutePoints = multiRoute
            .getWayPoints()
            .toArray()
            .filter((point, index) => index !== filterIndex)
            .map(point => point.geometry._coordinates);

        return points
            .filter((point, index) => index !== filterIndex)    
            .map(({ name, cords }, index) => 
            ({ name, cords: !cordsPriority ? multiRoutePoints[index] : cords }));
    }

    render() {
        const { input, points } = this.state;

        const { multiRoute, customizeLastPoint } = this.props;
        if (multiRoute) {
            if (multiRoute.getWayPoints().getLength() < points.length) {
                multiRoute.model.setReferencePoints(points.map(({ cords }) => cords));
                customizeLastPoint(points.length - 1, points[points.length - 1].name);
            } else {
                multiRoute.model.setReferencePoints(points.map(({ cords }) => cords));
            }
        }

        return (
            <div className="route-editor">
                <main className="route-editor__main">
                    <form className="route-editor__form" onSubmit={this.onSubmitInput}>
                        <input
                            className="route-editor__input"
                            type="text"
                            value={input}
                            onChange={this.onChangeInput}
                        />
                    </form>
                    <div className="route-editor__points">
                        {
                            points.map(({ name }, index) => 
                                <Point
                                    name={name}
                                    onRemovePoint={this.onRemovePoint(index)}
                                    onDragStart={this.onDragStart(index)}
                                    onDragOver={this.onDragOver(index)}
                                    onDragEnd={this.onDragEnd}
                                />
                            )
                        }
                    </div>
                </main>
                <div className="route-editor__map" id="map"></div>
            </div>
        );
    }
}
