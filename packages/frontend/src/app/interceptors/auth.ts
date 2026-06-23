import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from '@angular/core';
import { Auth } from '../services/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(Auth);
    const token = auth.getToken();

    const membershipType = auth.membershipType();
    const membershipId = auth.membershipId();

    if (token && req.url.includes('/api')) {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`
        };

        if (membershipType) headers['x-membership-type'] = membershipType.toString();
        if (membershipId) headers['x-destiny-membership-id'] = membershipId;


        const clonedRequest = req.clone({ setHeaders: headers });
        return next(clonedRequest);
    }
    
    return next(req);
}