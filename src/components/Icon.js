import L from 'leaflet';

const iconPerson = new L.Icon({
    iconUrl: '../assets/imgs/centerMarker.svg',
    iconRetinaUrl: '../assets/imgs/centerMarker.svg',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
});

export { iconPerson };