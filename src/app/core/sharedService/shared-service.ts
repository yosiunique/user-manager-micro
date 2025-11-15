import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private token=new BehaviorSubject<any>(null);
  tokenData$=this.token.asObservable();
  setToken(token:any){
    this.token.next(token);
  }
}
