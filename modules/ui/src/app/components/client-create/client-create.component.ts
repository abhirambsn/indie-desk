import {Component, Input} from '@angular/core';
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Textarea} from 'primeng/textarea';
import {Select} from 'primeng/select';
import ClientType from '@/app/enums/client-type.enum';

@Component({
  selector: 'app-client-create',
  imports: [
    IftaLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    Textarea,
    Select
  ],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent {
  @Input() client: Client = {} as Client;

  clientTypes = [
    { label: 'Individual', value: ClientType.INDIVIDUAL },
    { label: 'Organization', value: ClientType.ORGANIZATION }
  ];
}
