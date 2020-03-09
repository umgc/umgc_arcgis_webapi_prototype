import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
} from '@angular/core';

import { loadModules } from 'esri-loader';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
    view: any;

    title = 'cdcop-app-project';

    async initializeMap(): Promise<void> {
        try {
            // Load the modules for the ArcGIS API for JavaScript
            const [
                Map,
                WebMap,
                MapView,
                Search,
                FeatureLayer,
                LayerView,
            ] = await loadModules([
                'esri/Map',
                'esri/WebMap',
                'esri/views/MapView',
                'esri/widgets/Search',
                'esri/layers/FeatureLayer',
                'esri/layers/Layer',
            ]);

            // Configure the Map
            const mapProperties = {
                basemap: 'streets-navigation-vector',
            };

            const webmap = new WebMap({
                portalItem: {
                    id: '2c3295b27e0649a181db3512bf0940d4',
                },
            });

            // webmap.when(() => {
            //     const featureLayer2 = webmap.allLayers.items.filter(
            //         layer => layer.type === 'feature'
            //     );

            //     console.log(featureLayer2);
            // });

            // const portalItem = LayerView.fromPortalItem({
            //     portalItem: {
            //         id: '2c3295b27e0649a181db3512bf0940d4',
            //     },
            // });

            // console.log(portalItem);

            // const map = new Map(mapProperties);

            // Initialize the MapView
            const mapViewProperties = {
                container: this.mapViewEl.nativeElement,
                // center: [-118.71511, 34.09042],
                // zoom: 11,
                map: webmap,
            };

            this.view = new MapView(mapViewProperties);

            this.view.popup.on('trigger-action', event => {
                // If the zoom-out action is clicked, fire the zoomOut() function
                if (event.action.id === 'selected-zone') {
                    this.selectMapZone();
                }
            });

            this.view.on('layerview-create', $event => {
                if ($event.layer.type === 'feature') {
                    console.log($event);
                }
            });

            // this.view.popup.autoOpenEnabled = false;

            // this.view.on('click', event => {
            //     this.view.popup.open({
            //         location: event.mapPoint, // location of the click on the view
            //         fetchFeatures: true, // display the content for the selected feature if a popupTemplate is defined.
            //     });
            //     console.log(this.view.popup);
            // });

            const selectZoneClose = {
                // This text is displayed as a tooltip
                title: 'Select This Zone',
                // The ID by which to reference the action in the event handler
                id: 'selected-zone',
                // Sets the icon font used to style the action button
                className: 'esri-icon-map-pin',
            };

            this.view.popup.actions.push(selectZoneClose);

            console.log(this.view.popup);

            // this.view.popup.watch('selectedFeature', graphic => {
            //     if (graphic) {
            //         const graphicTemplate = graphic.getEffectivePopupTemplate();
            //         console.log(graphicTemplate);
            //     }
            // });

            this.view.on('click', $event => {
                console.log($event);
            });

            // const search = new Search(this.view);

            // const cityZoneFeatureLayer = new FeatureLayer({
            //     url:
            //         'https://www.arcgis.com/home/webmap/viewer.html?webmap=2c3295b27e0649a181db3512bf0940d4',
            // });
            // this.view.ui.add(search, 'top-right');

            return this.view;
        } catch (error) {
            console.log('EsriLoader: ', error);
        }
    }

    onMapClick($event): void {
        console.log($event);
    }

    ngOnInit(): void {
        this.initializeMap();
    }

    ngOnDestroy(): void {
        if (this.view) {
            // destroy the map view
            this.view.container = null;
        }
    }

    selectMapZone(): void {
        console.log(this.view.popup.selectedFeature.attributes);
        // console.log(zone);
    }
}
