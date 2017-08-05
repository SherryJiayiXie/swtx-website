var house_groupLayer;

function ArcGIS_Map_Init() {
    require([
        "esri/layers/GroupLayer",
        "esri/layers/FeatureLayer",
        "esri/WebMap", 
        "esri/views/SceneView",
        "esri/widgets/LayerList",
        "esri/layers/support/Field",
        "esri/geometry/Point",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/PointSymbol3D",
        "esri/symbols/ObjectSymbol3DLayer",
        "esri/request",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
    ], function (GroupLayer, FeatureLayer, WebMap, SceneView, LayerList, Field, Point, SimpleRenderer, PointSymbol3D, ObjectSymbol3DLayer, esriRequest, 
    arrayUtils, dom, on) {
        
        var houst_fields = [
            {name: "ObjectID", alias: "ObjectID", type: "oid"},
            {name: "title", alias: "title", type: "string"},
            {name: "num", alias: "num", type: "integer"}
        ];

        house_groupLayer = new GroupLayer({
            title: "商品房",
            visibility: true,
            visibilityMode: "exclusive"
        });
        
        var arcgis_arcgismap = new WebMap({
            portalItem: {
                id: "a95fc0f743c34a83bea995e65c8dd36c"
            },
            layers: [house_groupLayer]
        });

        var arcgis_initCam = {
            position: {
                x: 114.2641,
                y: 30.6024,
                z: 20000,
                spatialReference: {
                    wkid: 4326
                }
            },
            heading: 0,
            tilt: 0
        };

        var arcgis_view = new SceneView({
            map: arcgis_arcgismap,
            container: "arcgismap",
            camera: arcgis_initCam
        });

        arcgis_view.then(function () {
            arcgis_layerList = new LayerList({
                view: arcgis_view
            })

            arcgis_view.ui.add(arcgis_layerList, "top-right");
        })

        $.getJSON("realproperty-wgs.json", function (data) {
            var features = [];

            data.forEach(function(iSender, i) {
                features.push({
                    geometry: new Point({
                        longitude: iSender.fCoord_x,
                        latitude: iSender.fCoord_y
                    }),
                    attributes: {
                        ObjectID: iSender.sInstalmentID,
                        title: iSender.sTitle,
                        num: parseInt(iSender.fPriceAverage/5)
                    }
                })
            }, this);

            var arcgis_houseRenderer = new SimpleRenderer({
                symbol: new PointSymbol3D({
                    symbolLayers: [new ObjectSymbol3DLayer({
                        resource: {
                            primitive: "cube"
                        },
                        width: 80,
                        depth: 80,
                        material: {color: "#999999"}
                    })]
                }),
                label: "平均价格",
                visualVariables: [{
                    type: "size",
                    field: "num",
                    axis: "height"
                },{
                    type: "size",
                    axis: "width-and-depth",
                    useSymbolValue: true,
                }]
            });

            var arcgis_houseLayer = new FeatureLayer({
                source: features,
                fields: houst_fields,
                objectIdField: "ObjectID",
                renderer: arcgis_houseRenderer,
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "point",
                popupTemplate: {
                    title: "{title}",
                    content: [{
                        type: "fields",
                        fieldInfos: [{
                            fieldName: "num",
                            label: "平均价格",
                            visible: true
                        }]
                    }]
                },
                title: "平均价格",
                id: "fireLayer"
            })

            house_groupLayer.add(arcgis_houseLayer, 0);
        })
    })
}

// $(function () {
//     ArcGIS_Map_Init();
// })
ArcGIS_Map_Init();