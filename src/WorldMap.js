

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = () => {
    const [countries, setCountries] = useState(null);
    const [info, setInfo] = useState({ name: '', submissions: 0 });
    const geoJsonLayerRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [highlightedCountry, setHighlightedCountry] = useState(null);

    // Sample data for country submissions (replace with your actual data)
    const countryData = {
        "United States of America": 44,
        "Canada": 9,
        "Brazil": 15,
        "Morocco": 5,  // Combined data for Morocco and Western Sahara
        // Add more countries and their submission counts
    };

    const mergeMoroccoWesternSahara = (geoJson) => {
        let morocco = null;
        let westernSahara = null;
        const otherFeatures = [];

        geoJson.features.forEach(feature => {
            if (feature.properties.ADMIN === 'Morocco') {
                morocco = feature;
            } else if (feature.properties.ADMIN === 'Western Sahara') {
                westernSahara = feature;
            } else {
                otherFeatures.push(feature);
            }
        });

        if (morocco && westernSahara) {
            // Combine the geometries
            const mergedGeometry = {
                type: 'MultiPolygon',
                coordinates: []
            };

            // Add Morocco's coordinates
            if (morocco.geometry.type === 'MultiPolygon') {
                mergedGeometry.coordinates = [...morocco.geometry.coordinates];
            } else if (morocco.geometry.type === 'Polygon') {
                mergedGeometry.coordinates = [morocco.geometry.coordinates];
            }

            // Add Western Sahara's coordinates
            if (westernSahara.geometry.type === 'MultiPolygon') {
                mergedGeometry.coordinates = [...mergedGeometry.coordinates, ...westernSahara.geometry.coordinates];
            } else if (westernSahara.geometry.type === 'Polygon') {
                mergedGeometry.coordinates.push(westernSahara.geometry.coordinates);
            }

            // Create a new feature with the merged geometry
            const mergedFeature = {
                type: 'Feature',
                properties: { ...morocco.properties, ADMIN: 'Morocco', NAME: 'Morocco' },
                geometry: mergedGeometry
            };

            // Add the merged feature to the other features
            otherFeatures.push(mergedFeature);
        } else {
            // If either Morocco or Western Sahara is missing, add the available one
            if (morocco) otherFeatures.push(morocco);
            if (westernSahara) otherFeatures.push(westernSahara);
        }

        // Create a new GeoJSON object with the merged features
        return {
            type: 'FeatureCollection',
            features: otherFeatures
        };
    };
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(response => response.json())
            .then(data => {
                const mergedData = mergeMoroccoWesternSahara(data);
                setCountries(mergedData);
            });
    }, []);

    const getColor = (countryName) => {
        const submissions = countryData[countryName] || 0;
        return submissions > 40 ? '#A6C8FF' :
            submissions > 30 ? '#B9D3FF' :
                submissions > 20 ? '#CCDEFF' :
                    submissions > 10 ? '#DEE9FF' :
                        submissions > 0  ? '#F0F5FF' :
                            '#FFFFFF';
    };

    /*const style = (feature) => {
        return {
            fillColor: highlightedCountry === feature.properties.ADMIN
                ? '#FFA500'  // Highlight color (orange)
                : getColor(feature.properties.ADMIN),
            weight: highlightedCountry === feature.properties.ADMIN ? 1 : 0.3,
            opacity: 1,
            color: '#000000',  // Black border for all countries
            fillOpacity: highlightedCountry === feature.properties.ADMIN ? 0.8 : 0.7
        };
    };*/
    const style = (feature) => {
        return {
            fillColor: highlightedCountry === feature.properties.ADMIN
                ? '#FFA500'  // Highlight color (orange)
                : getColor(feature.properties.ADMIN),
            weight: highlightedCountry === feature.properties.ADMIN ? 0.5 : 0.2,
            opacity: 1,
            color: highlightedCountry === feature.properties.ADMIN ? '#FFA500' : '#CCCCCC',
            fillOpacity: highlightedCountry === feature.properties.ADMIN ? 0.7 : 0.6
        };
    };


    const highlightFeature = (e) => {
        const layer = e.target;
        const { ADMIN: name } = layer.feature.properties;

        setHighlightedCountry(name);

        setInfo({
            name: name,
            submissions: countryData[name] || 'No data'
        });

        const bounds = e.target.getBounds();
        const leafletMap = e.target._map;
        const point = leafletMap.latLngToContainerPoint(bounds.getCenter());

        setTooltipPosition({ x: point.x, y: point.y });
        setShowTooltip(true);
    };

    const resetHighlight = (e) => {
        setHighlightedCountry(null);
        setShowTooltip(false);
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };

    return (
        <div className="world-map-container" style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>World Map of Submissions</h2>
            <div style={{ display: 'flex', height: '600px' }}>
                <div style={{ width: '75%', position: 'relative' }}>
                    <MapContainer
                        center={[0, 0]}
                        zoom={2}
                        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                        zoomControl={true}
                        minZoom={1}
                        maxZoom={8}
                        maxBounds={[[-90, -180], [90, 180]]}
                        maxBoundsViscosity={1.0}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            noWrap={true}
                            bounds={[[-90, -180], [90, 180]]}
                        />
                        {countries && (
                            <GeoJSON
                                data={countries}
                                style={style}
                                onEachFeature={onEachFeature}
                                ref={geoJsonLayerRef}
                            />
                        )}
                    </MapContainer>
                    {showTooltip && (
                        <div style={{
                            position: 'absolute',
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                            backgroundColor: 'white',
                            padding: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}>
                            <strong>{info.name}</strong><br />
                            Submissions: {info.submissions}
                        </div>
                    )}
                </div>
                <div style={{ width: '25%', padding: '0 20px' }}>
                    <h3>Statistics</h3>
                    <p>Total Submissions: {Object.values(countryData).reduce((a, b) => a + b, 0)}</p>
                    <p>Countries with Submissions: {Object.keys(countryData).length}</p>
                    <h3>Top Countries</h3>
                    <ul>
                        {Object.entries(countryData)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([country, count]) => (
                                <li key={country}>{country}: {count}</li>
                            ))
                        }
                    </ul>
                    <h3>Legend</h3>
                    <div>
                        <div style={{backgroundColor: '#A6C8FF', width: '20px', height: '20px', display: 'inline-block'}}></div> 40+ submissions
                    </div>
                    <div>
                        <div style={{backgroundColor: '#B9D3FF', width: '20px', height: '20px', display: 'inline-block'}}></div> 31-40 submissions
                    </div>
                    <div>
                        <div style={{backgroundColor: '#CCDEFF', width: '20px', height: '20px', display: 'inline-block'}}></div> 21-30 submissions
                    </div>
                    <div>
                        <div style={{backgroundColor: '#DEE9FF', width: '20px', height: '20px', display: 'inline-block'}}></div> 11-20 submissions
                    </div>
                    <div>
                        <div style={{backgroundColor: '#F0F5FF', width: '20px', height: '20px', display: 'inline-block'}}></div> 1-10 submissions
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorldMap;
