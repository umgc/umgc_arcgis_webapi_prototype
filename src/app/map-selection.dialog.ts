import {
    Component,
    Inject,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressLocatorService } from './address-locator.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-dialog-map-selection',
    template: '<div id="mapViewNode" #mapViewNode></div>',
})
export class AppDialogMapSelectionComponent implements AfterViewInit {
    @ViewChild('mapViewNode', { static: true })
    private mapViewEl: ElementRef;

    view: any;
    closerObserver: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private addressLocator: AddressLocatorService,
        private dialogRef: MatDialogRef<AppDialogMapSelectionComponent>
    ) {
        this.closerObserver = new Subject<any>();
    }

    ngAfterViewInit(): void {
        this.initializeMap();
    }

    initializeMap(): void {
        this.closerObserver.subscribe(results => {
            this.dialogRef.close(results);
        });

        this.addressLocator.initializeClientMap(
            this.data.portalItemId,
            this.mapViewEl,
            this.closerObserver
        );
    }
}
