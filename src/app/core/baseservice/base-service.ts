import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";



export class BaseService<T> {

    constructor(protected http:HttpClient ,protected baseUrl:string){

    }

  /***
   * get all methods 
   */
getAll(pageIndex: number, pageSize: number) {
  const params = new HttpParams()
    .set('page', `${pageIndex}`)
    .set('size', `${pageSize}`);

  const token = localStorage.getItem('jwtToken');

  // Create headers properly
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  return this.http.get<any>(`${this.baseUrl}`, { params, headers })
    .pipe(catchError(this.handleError));
}

/**
 * get by id 
 */

  getById(id: number) :Observable<any>{

  const token = localStorage.getItem('jwtToken');

  // Create headers properly
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
   return  this.http.get<any>(`${this.baseUrl}/${id}`,{headers}).
    pipe(catchError(this.handleError))
  }


  /****
   * create new data 
   * 
   */
   create(t:T) {
 
    console.log("passed Data" ,t );
 const token = localStorage.getItem('jwtToken');

  // Create headers properly
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http
      .post(this.baseUrl, t,{headers,responseType:'text'})
      .pipe(catchError(this.handleError));
  }

  /**
 *  update
 */

  update(id:number , t:T) {
   console.log("passed Data" ,t );
 const token = localStorage.getItem('jwtToken');

  // Create headers properly
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .put(
        `${this.baseUrl}/${id}`,t ,{headers ,responseType:'text'}
      )
      .pipe(catchError(this.handleError));
  }


  /***
   * search values 
   */

  search(searchValue:any) {
    console.log("searching values...",searchValue)
    const pageIndex=0;
    const pageSize=10;
    const params = new HttpParams()
      .set('name',`${searchValue}`)
      .set('page',`${pageIndex}`)
      .set('size',`${pageSize}`);

    return this.http.get<T>(`${this.baseUrl}/search`, {params});
  }

  /** 
   * 
   * searching values 
  */

  delete(id:number) {
   
    
 const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .delete(`${this.baseUrl}/${id}`,{headers})
      .pipe(catchError(this.handleError));
  }





  protected  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  

}














