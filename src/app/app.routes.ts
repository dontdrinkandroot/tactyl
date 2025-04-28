import {Routes} from '@angular/router';
import {IoComponent} from './io/io.component';
import {GridComponent} from "./grid/grid.component";
import {MixerComponent} from "./mixer/mixer.component";
import {DebugComponent} from "./debug/debug.component";

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
        path: 'debug',
        component: DebugComponent
    },
    {
        path: '',
        redirectTo: 'io',
        pathMatch: 'full'
    }
];
