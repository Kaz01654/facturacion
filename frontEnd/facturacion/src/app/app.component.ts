import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule, RouterOutlet } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { PrimeNGConfig } from 'primeng/api'
import { SvgComponent } from './components/svg/svg.component'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { TableModule } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'
import { NgxSpinnerModule } from 'ngx-spinner'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SvgComponent, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, TableModule, TooltipModule, CardModule, InputTextModule, NgxSpinnerModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(private titleService: Title, private primengConfig: PrimeNGConfig) {
    this.titleService.setTitle("IPF")
    this.primengConfig.ripple = true
  }
}
