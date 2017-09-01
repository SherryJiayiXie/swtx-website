var house_groupLayer;

function ArcGIS_Map_Init() {
    require([
        "esri/layers/Layer",
        "esri/WebMap", 
        "esri/views/MapView",
        "esri/request",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
    ], function (Layer, WebMap, MapView, esriRequest, arrayUtils, dom, on) {

        var arcgis_arcgismap = new WebMap({
            basemap: "osm"
        });

        var arcgis_view = new MapView({
            map: arcgis_arcgismap,
            container: "arcgismap",
            zoom: 10,
            center: [114.35464, 30.53006]
        });

        Layer.fromPortalItem({
            portalItem: {
                id: "a264c4d205ac44d9a3880cccc562a9bc"
            }
        }).then(function (lyr) {
            arcgis_arcgismap.add(lyr);
        })
        
    })
}

// $(function () {
//     ArcGIS_Map_Init();
// })
ArcGIS_Map_Init();