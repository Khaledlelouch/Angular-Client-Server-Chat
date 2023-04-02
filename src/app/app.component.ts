import { Component, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

interface Message {
  username: string;
  text: string;
  image?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private socket$!: WebSocketSubject<Message>;
  private readonly SERVER_URL = 'ws://localhost:8080';
  public messages: Message[] = [];
  public message: string = '';
  public image: File | undefined;

  constructor() {}


  ngOnInit() {
    this.socket$ = new WebSocketSubject<Message>(this.SERVER_URL);
    this.socket$.subscribe(
      (message) => this.messages.push(message),
      (error) => console.error(error)
    );
  }

  public async sendMessage() {
    const message: Message = {
      username: 'Client',
      text: this.message,
      image: this.image ? await this.getBase64Image(this.image) : undefined
    };
    this.socket$.next(message);
    this.messages.push(message);
    this.message = '';
    this.image = undefined;
  }

  public onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.image = fileInput.files[0];
    }
  }

  public getImageUrl(base64Image: string): string {
    return `data:image/png;base64,${base64Image}`;
  }

  private async getBase64Image(img: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        resolve(base64Image.substr(base64Image.indexOf(',') + 1));
      };
      reader.readAsDataURL(img);
    });
  }


  public debugBase64(base64URL:String){
    var win = window.open();
    win?.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

}