import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestingPageRoutingModule } from './testing-routing.module';

import { TestingPage } from './testing.page';
import { SideMenuHeaderComponent } from "../../Components/side-menu-header/side-menu-header.component";

@NgModule({
    declarations: [TestingPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TestingPageRoutingModule,
        SideMenuHeaderComponent
    ]
})
export class TestingPageModule {}
