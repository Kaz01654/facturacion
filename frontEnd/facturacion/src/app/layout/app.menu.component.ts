import { OnInit } from '@angular/core'
import { Component } from '@angular/core'
import { LayoutService } from './service/app.layout.service'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BadgeModule } from 'primeng/badge'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextModule } from 'primeng/inputtext'
import { RadioButtonModule } from 'primeng/radiobutton'
import { RippleModule } from 'primeng/ripple'
import { SidebarModule } from 'primeng/sidebar'
import { AppMenuitemComponent } from './app.menuitem.component'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      InputTextModule,
      SidebarModule,
      BadgeModule,
      RadioButtonModule,
      InputSwitchModule,
      RippleModule,
      RouterModule,
      AppMenuitemComponent
    ],
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = []
    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
          {
            label: 'Inicio',
            items: [
              { label: 'Panel', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
            ]
          },
          {
            label: 'UI Componentes',
            items: [
              { label: 'Facturación', icon: 'pi pi-fw pi-receipt', routerLink: ['/facturacion'] },
              { label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/gastos'] },
              { label: 'Productos', icon: 'pi pi-fw pi-briefcase', routerLink: ['/productos'] },
              { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/clientes'] },
              { label: 'Impuestos', icon: 'pi pi-fw pi-calculator', routerLink: ['/impuestos'] },
              { label: 'Gráficas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/graficas'] }
              // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
              // { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
              // { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
              // { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
              // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
              // { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
              // { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
              // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
              // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
              // { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
              // { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
              // { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            ]
          },
          // {
          //     label: 'Prime Blocks',
          //     items: [
          //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
          //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
          //     ]
          // },
          // {
          //     label: 'Utilities',
          //     items: [
          //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
          //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
          //     ]
          // },
          // {
          //     label: 'Pages',
          //     icon: 'pi pi-fw pi-briefcase',
          //     items: [
          //         {
          //             label: 'Landing',
          //             icon: 'pi pi-fw pi-globe',
          //             routerLink: ['/landing']
          //         },
          //         {
          //             label: 'Auth',
          //             icon: 'pi pi-fw pi-user',
          //             items: [
          //                 {
          //                     label: 'Login',
          //                     icon: 'pi pi-fw pi-sign-in',
          //                     routerLink: ['/auth/login']
          //                 },
          //                 {
          //                     label: 'Error',
          //                     icon: 'pi pi-fw pi-times-circle',
          //                     routerLink: ['/auth/error']
          //                 },
          //                 {
          //                     label: 'Access Denied',
          //                     icon: 'pi pi-fw pi-lock',
          //                     routerLink: ['/auth/access']
          //                 }
          //             ]
          //         },
          //         {
          //             label: 'Crud',
          //             icon: 'pi pi-fw pi-pencil',
          //             routerLink: ['/pages/crud']
          //         },
          //         {
          //             label: 'Timeline',
          //             icon: 'pi pi-fw pi-calendar',
          //             routerLink: ['/pages/timeline']
          //         },
          //         {
          //             label: 'Not Found',
          //             icon: 'pi pi-fw pi-exclamation-circle',
          //             routerLink: ['/notfound']
          //         },
          //         {
          //             label: 'Empty',
          //             icon: 'pi pi-fw pi-circle-off',
          //             routerLink: ['/pages/empty']
          //         },
          //     ]
          // },
          // {
          //     label: 'Hierarchy',
          //     items: [
          //         {
          //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
          //             items: [
          //                 {
          //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
          //                     items: [
          //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
          //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
          //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
          //                     ]
          //                 },
          //                 {
          //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
          //                     items: [
          //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
          //                     ]
          //                 },
          //             ]
          //         },
          //         {
          //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
          //             items: [
          //                 {
          //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
          //                     items: [
          //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
          //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
          //                     ]
          //                 },
          //                 {
          //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
          //                     items: [
          //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
          //                     ]
          //                 },
          //             ]
          //         }
          //     ]
          // },
          // {
          //     label: 'Get Started',
          //     items: [
          //         {
          //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
          //         },
          //         {
          //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
          //         }
          //     ]
          // }
        ]
    }
}