import { Injectable, ElementRef } from '@angular/core';
import esri = __esri;
import { loadModules } from 'esri-loader';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface IZoneSelectionData {
    CODE_LABEL: string;
    GEN_CODE: string;
    OBJECTID: number;
}

export interface ISuggestionRequest {
    maxSuggestions?: number;
    text: string;
    countryCode?: string;
    f?: 'JSON' | 'PJSON';
    searchExtent?: esri.Extent;
}

const ARCGIS_SUGGEST_SERVER =
    'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?';

const ARCGIS_FINDCAN_SERVER =
    'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=';

@Injectable()
export class AddressLocatorService {
    private mapDirectory: {
        [index: string]: {
            mapLayer: esri.WebMap;
        };
    } = {};

    private WebMap: esri.WebMapConstructor;
    private MapView: esri.MapViewConstructor;
    private MapSearchWidget: esri.widgetsSearchConstructor;
    private GeometryPoint: esri.PointConstructor;

    constructor(private http: HttpClient) {}

    async initializeClientMap(
        portalItemId: string,
        mapContainer: ElementRef,
        doneSubject?: Subject<IZoneSelectionData>
    ): Promise<any> {
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#methods-summary
        let clientMap = this.mapDirectory[portalItemId];

        /**
         * Future implementation if this service is used accross different
         * citites, this will hopefully saving on re-loading a city's maps
         * really not sure this is needed (in terms of preformance)
         */
        if (!clientMap) {
            clientMap = this.mapDirectory[portalItemId] = {} as any;
        }

        // WebMap may have already been loaded if a straight address
        // check was the first here.
        if (!clientMap.mapLayer) {
            await this.loadMap(portalItemId);
        }

        console.log(mapContainer.nativeElement.id);
        // await this.loadViewMap(portalItemId, mapContainer);

        const mapViewLayer = await this.loadViewMap(portalItemId, mapContainer);

        const searchWidget = new this.MapSearchWidget({
            view: mapViewLayer,
        });

        mapViewLayer.ui.add(searchWidget, {
            position: 'top-right',
            index: 2,
        });

        // Creating an custom options for the default map popup
        mapViewLayer.popup.actions.push({
            title: 'Select Zone',
            id: 'selected-zone',
            className: 'esri-icon-map-pin',
        } as any);

        mapViewLayer.popup.on('trigger-action', event => {
            // Ignore all actions, exected the custom one we created.
            if (event.action.id !== 'selected-zone') {
                return;
            }

            this.zonebyMapSelection(portalItemId, mapViewLayer, doneSubject);
        });
    }

    async initializeEsriLibs(): Promise<void> {
        try {
            [
                this.WebMap,
                this.MapView,
                this.MapSearchWidget,
                this.GeometryPoint,
            ] = await loadModules([
                'esri/WebMap',
                'esri/views/MapView',
                'esri/widgets/Search',
                'esri/geometry/Point',
            ]);
            console.log('modules loaded');
        } catch (error) {
            console.log(error);
        }
    }

    async findZoneByAddressCandidate(
        domElement: ElementRef,
        portalItemId: string,
        text: string,
        magickey: string
    ): Promise<IZoneSelectionData> {
        const clientMap = this.mapDirectory[portalItemId];

        // More information https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm
        // https://developers.arcgis.com/rest/services-reference/find-address-candidates.htm
        const params = new HttpParams()
            .set('text', text)
            .set('f', 'JSON')
            .set(
                'outSr',
                clientMap.mapLayer.initialViewProperties.spatialReference.wkid?.toString()
            )
            .set('magickey', magickey);

        const addressCandidate = await this.http
            .get<any>(ARCGIS_FINDCAN_SERVER, { params })
            .toPromise();

        console.log(addressCandidate);

        // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
        const geoPointFromAddressCandidate = {
            spatialReference: addressCandidate.spatialReference,
            x: addressCandidate.candidates[0].location.x,
            y: addressCandidate.candidates[0].location.y,
        };

        const addressPoint = new this.GeometryPoint(
            geoPointFromAddressCandidate as any
        );

        const loadedMapView = await this.loadViewMap(portalItemId, domElement);

        loadedMapView.center = addressPoint;

        const searchWidget = new this.MapSearchWidget({
            view: loadedMapView,
        });

        loadedMapView.ui.add(searchWidget, {
            position: 'top-right',
            index: 2,
        });

        const zoneResult = await this.zoneIdByGeometryPoint(
            addressPoint,
            portalItemId,
            loadedMapView
        );

        return zoneResult;
    }

    async getAddressSuggestion(
        portalItemId: string,
        requestData: ISuggestionRequest
    ): Promise<any> {
        // More information https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm
        let loadedMap = this.mapDirectory[portalItemId];

        if (!loadedMap) {
            loadedMap = this.mapDirectory[portalItemId] = {} as any;
            await this.loadMap(portalItemId);
        }

        const params = new HttpParams()
            .set('text', requestData.text)
            .set('countryCode', requestData.countryCode ?? 'USA')
            .set(
                'maxSuggestions',
                requestData.maxSuggestions?.toString() ?? '10'
            )
            .set('f', requestData.f ?? 'JSON')
            .set(
                'searchExtent',
                JSON.stringify(
                    requestData.searchExtent ??
                        loadedMap.mapLayer.portalItem.extent
                )
            );

        const results = await this.http
            .get(ARCGIS_SUGGEST_SERVER, { params })
            .toPromise();

        console.log(results);
        return results;
    }

    private async loadMap(portalItemId: string): Promise<void> {
        this.mapDirectory[portalItemId].mapLayer = new this.WebMap({
            portalItem: { id: portalItemId },
        });

        await this.mapDirectory[portalItemId].mapLayer.load();
        return;
    }

    private loadViewMap(
        portalItemId: string,
        domElement: ElementRef
    ): Promise<esri.MapView> {
        return new Promise((resolve, reject) => {
            const clientMap = this.mapDirectory[portalItemId];

            const mapViewLayer = new this.MapView({
                container: domElement.nativeElement,
                map: clientMap.mapLayer,
            });

            /**
             * Have to listen from the layer created event to wait until
             * the layer we are looking for has been created. Otherwise
             *  any query that we execute against the feature layer will fail.
             */
            mapViewLayer.on('layerview-create', $event => {
                /** Assumption:
                 * The client's map will only contain one feature layer representing
                 * the client's zones, otherwise this may break if multiple features
                 * layers event are fired.
                 */
                if ($event.layer.type !== 'feature') {
                    return;
                }
                // Once a feature layer is detected resolve the promise
                resolve(mapViewLayer);
            });

            mapViewLayer.on('layerview-create-error', $event => {
                reject($event);
            });
        });
    }

    private async zoneIdByGeometryPoint(
        point: __esri.Point,
        portalItemId: string,
        mapView: __esri.MapView
    ): Promise<IZoneSelectionData> {
        try {
            const featureLayerView = mapView.layerViews.find(
                // This is specific to City of Pasadena, another city could have multiple
                // of feature layers and so we need a better way of determing which is the Zone Mapping feature.
                alv => alv.layer.type === 'feature'
            ) as __esri.FeatureLayerView;

            if (featureLayerView.suspended) {
                console.log('This Has Been Suspended');
            }

            const query = featureLayerView.layer.createQuery();
            query.geometry = point;
            query.outFields = ['*'];
            query.spatialRelationship = 'within';
            const queryResults = await featureLayerView.layer.queryFeatures(
                query
            );

            // There may be multiple features associated with this address point
            // select only the first one.
            return queryResults.features[0].attributes as IZoneSelectionData;
        } catch (error) {
            console.log(error);
        }
    }

    private async zonebyMapSelection(
        portalItemId: string,
        mapViewLayer: __esri.MapView,
        doneSubject: Subject<IZoneSelectionData>
    ): Promise<void> {
        // Make an assumption that if a poup has a CODE_LABEL property then is
        // a zone selection made by a Zone Map otherwise it's an Address Point
        if (mapViewLayer.popup.selectedFeature.attributes.CODE_LABEL) {
            return doneSubject.next(
                mapViewLayer.popup.selectedFeature
                    .attributes as IZoneSelectionData
            );
        }

        const addressPoint = new this.GeometryPoint(
            mapViewLayer.popup.selectedFeature.geometry
        );

        const queryResults = await this.zoneIdByGeometryPoint(
            addressPoint,
            portalItemId,
            mapViewLayer
        );

        return doneSubject.next(queryResults);
    }
}
