import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { NZ_ICONS, provideNzIcons } from 'ng-zorro-antd/icon';
import {
  UserOutline, LockOutline, AccountBookOutline, BankOutline,
  BarChartOutline, BellOutline, CreditCardOutline, DashboardOutline,
  DatabaseOutline, DownOutline, FileDoneOutline, FileTextOutline,
  LineChartOutline, LogoutOutline, MenuFoldOutline, MenuUnfoldOutline,
  PieChartOutline, RiseOutline, SafetyCertificateOutline, SettingOutline,
  TeamOutline, TransactionOutline, PlusOutline, EditOutline,
  UndoOutline, DeleteOutline, KeyOutline, ReloadOutline,
  UploadOutline, EyeOutline
} from '@ant-design/icons-angular/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';

const icons: IconDefinition[] = [
  UserOutline, LockOutline, MenuFoldOutline, MenuUnfoldOutline,
  DashboardOutline, BankOutline, CreditCardOutline, SettingOutline,
  TeamOutline, DatabaseOutline, SafetyCertificateOutline, BarChartOutline,
  PieChartOutline, LineChartOutline, RiseOutline, FileTextOutline,
  TransactionOutline, FileDoneOutline, AccountBookOutline, LogoutOutline,
  BellOutline, DownOutline, PlusOutline, EditOutline, UndoOutline,
  DeleteOutline, KeyOutline, ReloadOutline, UploadOutline, EyeOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideNzIcons(icons),
    importProvidersFrom(FormsModule),
    importProvidersFrom(ReactiveFormsModule),
    provideAnimationsAsync(),
    provideNzI18n(en_US),


    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};
