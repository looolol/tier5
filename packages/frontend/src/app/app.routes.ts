import { Router, Routes } from '@angular/router';
import { AuthCallback } from './components/auth-callback/auth-callback';
import { MainPage } from './components/main-page/main-page';
import { inject } from '@angular/core';
import { Auth } from './services/auth/auth';
import { InventoryDashboard } from './components/inventory/inventory-dashboard/inventory-dashboard';
import { Matrix } from './components/matrix/matrix';


const redirectIfAuthed = () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (auth.getToken()) {
        return router.createUrlTree(['/dashboard/inventory']);
    }
    return true;
}

const tokenGuard = () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (!auth.getToken()) {
        return router.createUrlTree(['/']);
    }
    return true;
};

export const routes: Routes = [
    {
        path: '',
        component: MainPage,
        canActivate: [redirectIfAuthed],
        pathMatch: 'full'
    },
    {
        path: 'auth/callback',
        component: AuthCallback
    },
    {
        path: 'dashboard',
        component: MainPage,
        canActivate: [tokenGuard],
        children: [
            { path: '', redirectTo: 'inventory', pathMatch: 'full' },
            { path: 'inventory', component: InventoryDashboard },
            { path: 'matrix', component: Matrix }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
