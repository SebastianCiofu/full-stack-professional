import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss']
})
export class PhotoCardComponent {
  @Input() photo: any;
  @Input() customerId: number = 0;
  @Input() photoIndex: number = 0;

  constructor(private http: HttpClient) {}

  photoUrls: string[] = [];

  ngOnInit() {
    this.http.get<string[]>(`http://localhost:8080/api/v1/customers/${this.customerId}/profile-images`)
      .subscribe(urls => {
        this.photoUrls = urls;
        console.log(this.photoUrls);
      });
  }
}
