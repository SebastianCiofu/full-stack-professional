import { Component, OnInit } from '@angular/core';
import { CustomerDTO } from '../../models/customer-dto';
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerRegistrationRequest } from '../../models/customer-registration-request';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileService } from 'src/app/services/file.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  display = false;
  operation: 'create' | 'update' = 'create';
  customers: Array<CustomerDTO> = [];
  customer: CustomerRegistrationRequest = {};

  photoUrls: string[] = [];


  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fileService: FileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.findAllCustomers();
    this.http.get<string[]>(`http://localhost:8080/api/v1/customers/3/profile-images`)
    .subscribe(urls => {
      this.photoUrls = urls;
      console.log(this.photoUrls);
    });
  }


  private findAllCustomers() {
    this.customerService.findAll()
    .subscribe({
      next: (data) => {
        this.customers = data;
        console.log(data);
      }
    })
  }

  save(customer: CustomerRegistrationRequest) {
    if (customer) {
      if (this.operation === 'create') {
        this.customerService.registerCustomer(customer)
        .subscribe({
          next: () => {
            this.findAllCustomers();
            this.display = false;
            this.customer = {};
            this.messageService.add(
              {severity:'success',
                summary: 'Customer saved',
                detail: `Customer ${customer.name} was successfully saved`
              }
            );
          }
        });
      } else if (this.operation === 'update') {
        this.customerService.updateCustomer(customer.id, customer)
        .subscribe({
          next: () => {
            this.findAllCustomers();
            this.display = false;
            this.customer = {};
            this.messageService.add(
              {
                severity:'success',
                summary: 'Customer updated',
                detail: `Customer ${customer.name} was successfully updated`
              }
            );
          }
        });
      }
    }
  }

  deleteCustomer(customer: CustomerDTO) {
    this.confirmationService.confirm({
      header: 'Delete customer',
      message: `Are you sure you want to delete ${customer.name}? You can\'t undo this action afterwords`,
      accept: () => {
        this.customerService.deleteCustomer(customer.id)
        .subscribe({
          next: () => {
            this.findAllCustomers();
            this.messageService.add(
              {
                severity:'success',
                summary: 'Customer deleted',
                detail: `Customer ${customer.name} was successfully deleted`
              }
            );
          }
        });
      }
    });
  }

  updateCustomer(customerDTO: CustomerDTO) {
    this.display = true;
    this.customer = customerDTO;
    this.operation = 'update';
  }

  createCustomer() {
    this.display = true;
    this.customer = {};
    this.operation = 'create';
  }

  cancel() {
    this.display = false;
    this.customer = {};
    this.operation = 'create';
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
