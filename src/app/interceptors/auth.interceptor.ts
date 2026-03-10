import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('access_token');
    if (
        token &&
        (req.url.startsWith('https://api.everrest.educata.dev') ||
            req.url.startsWith('https://railway.stepprojects.ge')) &&
        !req.headers.has('Authorization')
    ) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
};
