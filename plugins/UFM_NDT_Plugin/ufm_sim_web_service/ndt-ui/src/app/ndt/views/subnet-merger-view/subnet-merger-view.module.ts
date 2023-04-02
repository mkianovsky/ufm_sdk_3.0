import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubnetMergerViewComponent} from './subnet-merger-view.component';
import {InitialWizardComponent} from './components/initial-wizard/initial-wizard.component';
import {XWizardModule} from "../../../../../sms-ui-suite/x-wizard";
import {FileUploaderModule} from "../../packages/file-uploader";
import {
  SmsPluginBaseComponentModule
} from "../../../../../sms-ui-suite/sms-plugin-base-component/sms-plugin-base-component.module";
import {UploadNdtAndValidateComponent} from './components/upload-ndt-and-validate/upload-ndt-and-validate.component';
import {ValidationResultComponent} from './components/validation-result/validation-result.component';
import {XCoreAgGridModule} from "../../../../../sms-ui-suite/x-core-ag-grid/x-core-ag-grid.module";


@NgModule({
  declarations: [
    SubnetMergerViewComponent,
    InitialWizardComponent,
    UploadNdtAndValidateComponent,
    ValidationResultComponent
  ],
  imports: [
    CommonModule,
    XWizardModule,
    FileUploaderModule,
    SmsPluginBaseComponentModule,
    XCoreAgGridModule
  ]
})
export class SubnetMergerViewModule {
}
