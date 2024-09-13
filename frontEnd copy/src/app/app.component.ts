import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private titleService: Title, private primengConfig: PrimeNGConfig) {
    this.titleService.setTitle("IPF");
    this.primengConfig.ripple = true;
  }
}
