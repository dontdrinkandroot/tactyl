import {Routes} from '@angular/router';
import {IoComponent} from './io/io.component';
import {GridComponent} from "./grid/grid.component";
import {MixerComponent} from "./mixer/mixer.component";

export const routes: Routes = [
    {
        path: 'io',
        component: IoComponent
    },
    {
        path: 'grid',
        component: GridComponent
    },
    {
        path: 'mixer',
        component: MixerComponent
    },
    {
        path: '',
        redirectTo: 'io',
        pathMatch: 'full'
    }
];
