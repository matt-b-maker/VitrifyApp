import { Component, Input, OnInit, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-side-menu-header',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './side-menu-header.component.html',
  styleUrls: ['./side-menu-header.component.scss'],
})
export class SideMenuHeaderComponent {

  @Input() title: string | undefined;

  constructor() { }

}
