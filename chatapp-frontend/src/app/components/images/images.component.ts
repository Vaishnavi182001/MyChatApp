import { Component,OnInit } from '@angular/core';
import { SideComponent } from '../side/side.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { UsersService } from '../../services/users.service';
import imageCompression from 'browser-image-compression';
import { TokenService } from '../../services/token.service';

const UPLOAD_URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  imports: [SideComponent,ToolbarComponent, FileUploadModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.css'
})
export class ImagesComponent implements OnInit {


   uploader: FileUploader = new FileUploader({
    url:UPLOAD_URL,
    disableMultipart: true,
   })
     user:any;
     selectedFile:any;
     images = [];
    //  imageId:any;
    //  imageVersion:any;

  constructor(private userServices:UsersService,private tokenSrvice:TokenService) {}
  ngOnInit() {
    this.user=this.tokenSrvice.GetPayload();
    this.GetUser();
   }

GetUser(){
    if (this.user && this.user._id) {
      this.userServices.GetAllUserById(this.user._id).subscribe(data => {
        this.images = data.results.images;
        console.log(this.images);
      });
    } else {
      console.warn('User ID is not available.');
    }
}

  // OnFileSelected(event:any){
  //   const file:File = event[0];
  //   this.ReadAsBase64(file).then(result =>{
  //     this.selectedFile = result;
  //   }).catch(err => console.log(err));
  // }

  async OnFileSelected(event: any) {
  const file: File = event[0];
   if (file.size > 10 * 1024 * 1024) { // 10MB limit
    alert('File is too large! Please select an image under 10MB.');
    return;
  }
  const options = {
    maxSizeMB: 50, // Target max size in MB
    maxWidthOrHeight: 1024, // Resize to max 1024px
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    this.ReadAsBase64(compressedFile).then(result => {
      this.selectedFile = result;
    });
  } catch (error) {
    console.error(error);
  }
}

  Upload(){
     if(this.selectedFile){
      this.userServices.AddImage({image:this.selectedFile}).subscribe(response => {
        console.log('Image uploaded successfully:', response);
        const filePath = <HTMLInputElement>document.getElementById('fileInput');
        filePath.value = '';
      }, error => {
        console.error('Error uploading image:', error);
      });
  }
}


  ReadAsBase64(file:any):Promise<any>{
      const reader  = new FileReader();
      const fileValue = new Promise((resolve, reject) => {
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
        reader.addEventListener('error', (error) => {
          reject(error);
        });
        reader.readAsDataURL(file);
      });
      return fileValue;
  }


}
