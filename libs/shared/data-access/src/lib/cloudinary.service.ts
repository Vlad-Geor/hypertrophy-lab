import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type CloudinaryUploadRes = {
  secure_url: string;
};

@Injectable()
export class CloudinaryService {
  private readonly http = inject(HttpClient);

  uploadImage(form: FormData, cloudName: string): Observable<CloudinaryUploadRes> {
    return this.http.post<CloudinaryUploadRes>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      form,
    );
  }
}
