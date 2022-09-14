import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-bot';
  messages: string[] = [];

  constructor(private http: HttpClient) { }

  userEntry(event: any) {
    if (event.keyCode === 13) {
      let body1 = {
        input: event.srcElement.value,
        model: 'text-search-curie-query-001'
      };
      let headers1 = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      });
      this.apiFunction('https://api.openai.com/v1/embeddings', body1, { headers: headers1 }).pipe(switchMap((result1: any) => {
        let qbedarray = result1['data'][0]['embedding'];
        let body2 = {
          vector: qbedarray,
          topK: 10, // depth hardcoded to 10
          includeMetadata: true,
          includeValues: true
        };
        let headers2 = new HttpHeaders({
          'Content-Type': 'application/json',
          'Api-Key': '2800f2d1-f88e-4028-b3e9-12d6e5c8b84a'
        });
        return this.apiFunction('https://openai-6000-10-a049be4.svc.us-west1-gcp.pinecone.io/query', body2, { headers: headers2 });
      })).subscribe(result3 => console.log(result3));
      this.messages.push(event.srcElement.value);
      event.srcElement.value = '';
      event.preventDefault();
    }
  }

  apiFunction(url: string, body: any, options: any) {
    return this.http.post<any>(url, body, options);
  }
}
