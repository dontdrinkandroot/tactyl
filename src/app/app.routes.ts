import {Routes} from '@angular/router';
import {IoComponent} from './io/io.component';

export const routes: Routes = [
    {
        path: 'io',
        component: IoComponent
    },
    {
        path: '',
        redirectTo: 'io',
        pathMatch: 'full'
    }
];
