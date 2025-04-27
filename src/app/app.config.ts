import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {MidiService} from "./midi/midi.service";
import {MAT_ICON_DEFAULT_OPTIONS} from "@angular/material/icon";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAppInitializer(() => {
            const midiService = inject(MidiService);
            return midiService.init();
        }),
        {
            provide: MAT_ICON_DEFAULT_OPTIONS,
            useValue: { fontSet: 'material-symbols-rounded' }
        }
    ]
};
