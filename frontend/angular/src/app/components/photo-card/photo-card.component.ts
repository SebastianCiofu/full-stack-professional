import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss']
})
export class PhotoCardComponent {
  @Input() base64: string = '';

}
