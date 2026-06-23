import { Router, Routes } from '@angular/router';
import { AuthCallback } from './components/auth/auth-callback/auth-callback';
import { MainPage } from './components/main-page/main-page';
import { InventoryPage } from './components/inventory/inventory-page';
import { inject } from '@angular/core';
import { Auth } from './services/auth/auth';


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
            { path: 'inventory', component: InventoryPage },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
