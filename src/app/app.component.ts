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
      this.messages.push(event.srcElement.value);
      event.srcElement.value = '';
      event.preventDefault();
      let body1 = {
        input: event.srcElement.value,
        model: 'text-search-curie-query-001'
      };
      let headers1 = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      });
      let meta: string;
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
        return this.apiFunction('https://openai-6000-10-a049be4.svc.us-west1-gcp.pinecone.io/query', body2, { headers: headers2 }).pipe(switchMap((result2: any) => {
          let sentence = 'Answer the question as truthfully as possible using the provided context, and if the answer is not contained within the text below, say UNKNOWNContext:' + result2.Item1;
          let body3 = {
            model: 'text-davinci-002',
            prompt: 'input:' + sentence + event.srcElement.value + '?output:',
            temperature: 0,
            max_tokens: 125,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['\n']
          };
          meta = result2.Item2;
          return this.apiFunction('https://api.openai.com/v1/completions', body3, headers1);
        }));
      })).subscribe((result3: any) => this.messages.push(result3.Content['choices'][0]['text'] + '\n' + 'Read more about this question here : ' + '\n' + meta));
    }
  }

  apiFunction(url: string, body: any, options: any) {
    return this.http.post<any>(url, body, options);
  }
}
