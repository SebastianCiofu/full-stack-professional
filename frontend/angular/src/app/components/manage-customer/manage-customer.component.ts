import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerRegistrationRequest } from '../../models/customer-registration-request';
import {FileService} from "../../services/file.service";

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent {

  @Input()
  customer: CustomerRegistrationRequest = {};
  @Input()
  operation: 'create' | 'update' = 'create';
  @Output()
  submit: EventEmitter<CustomerRegistrationRequest> = new EventEmitter<CustomerRegistrationRequest>();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(private fileService: FileService) {
  }

  get isCustomerValid(): boolean {
    return this.hasLength(this.customer.name) &&
      this.hasLength(this.customer.email) &&
      this.customer.age !== undefined && this.customer.age > 0 &&
      (
        this.operation === 'update' ||
        this.hasLength(this.customer.password) &&
        this.hasLength(this.customer.gender)
      )
      ;
  }

  private hasLength(input: string | undefined): boolean {
    return input !== null && input !== undefined && input.length > 0
  }

  onSubmit() {
    this.submit.emit(this.customer);
  }

  onCancel() {
    this.cancel.emit();
  }

  onFileSelected(event: Event): void {
    const input = (event as any).target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      // TODO: change to this.customer.id
      this.fileService.addImageToEvent(3, file)
        .subscribe({
          next: () => alert('Upload successful!'),
          error: err => alert('Upload failed: ' + err)
        });
    }
  }
}
