import {
    Component,
    ViewEncapsulation,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AppDialogMapSelectionComponent } from './map-selection.dialog';
import {
    AddressLocatorService,
    IZoneSelectionData,
} from './address-locator.service';

interface ISuggestionResult {
    text: string;
    magicKey: string;
    isCollection: boolean;
}

// So this is a magic string provided by ARCGIS to a given city
const PASADENA_ARCGIS_PORTALID = '2c3295b27e0649a181db3512bf0940d4';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    @ViewChild('hiddenViewNode', { static: true })
    private hiddenViewEl: ElementRef;

    title = 'cdcop-app-project';
    selectedZonebyLookup = '';
    selectedZoneByMap = '';
    addressSearchFG: FormGroup;
    suggestionList: ISuggestionResult[] = [];
    selectedSuggestion: ISuggestionResult;

    constructor(
        public dialog: MatDialog,
        private addrLocatorService: AddressLocatorService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.addrLocatorService.initializeEsriLibs();
        this.addressSearchFG = this.formBuilder.group({
            searchControl: new FormControl(''),
        });

        this.addressSearchFG
            .get('searchControl')
            .valueChanges.pipe(debounceTime(1000))
            .subscribe(userText => {
                if (
                    this.suggestionList?.length &&
                    this.suggestionList.some(x => x.magicKey === userText)
                ) {
                    const { magicKey, text } = this.suggestionList.find(
                        x => x.magicKey === userText
                    );

                    this.addrLocatorService
                        .findZoneByAddressCandidate(
                            this.hiddenViewEl,
                            PASADENA_ARCGIS_PORTALID,
                            text,
                            magicKey
                        )
                        .then(result => {
                            if (!result?.CODE_LABEL) {
                                this.selectedZonebyLookup =
                                    'Sorry, we could not find a zone for the given address';
                            }
                            this.selectedZonebyLookup = `We found a zone for that address: ${result.CODE_LABEL}`;
                        });
                    return;
                }

                this.addrLocatorService
                    .getAddressSuggestion(PASADENA_ARCGIS_PORTALID, {
                        text: userText,
                    })
                    .then(result => {
                        this.suggestionList = result.suggestions;
                    });
            });
    }

    displayFn(magicKey: string): string {
        if (!magicKey) {
            return '';
        }
        return this.suggestionList.find(x => x.magicKey === magicKey).text;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AppDialogMapSelectionComponent, {
            width: '1000px',
            height: '1000px',
            data: { portalItemId: PASADENA_ARCGIS_PORTALID },
        });

        dialogRef.afterClosed().subscribe((result: IZoneSelectionData) => {
            if (!result?.CODE_LABEL) {
                this.selectedZoneByMap =
                    'Sorry, we could not find a zone for the given address';
            }
            this.selectedZoneByMap = `We found a zone for that address: ${result.CODE_LABEL}`;
        });
    }
}
