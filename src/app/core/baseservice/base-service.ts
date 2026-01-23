import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";



export class BaseService<T> {

  constructor(protected http: HttpClient, protected baseUrl: string) {

  }

  /***
   * get all methods 
   */
  getAll(pageIndex: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', `${pageIndex}`)
      .set('size', `${pageSize}`);

    return this.http.get<any>(`${this.baseUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * get by id 
   */

  getById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).
      pipe(catchError(this.handleError))
  }


  /****
   * create new data 
   * 
   */
  create(t: T) {
    console.log("passed Data", t);
    return this.http
      .post(this.baseUrl, t, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  /**
 *  update
 */

  update(id: string | number, t: T) {
    console.log("passed Data", t);
    return this.http
      .put(
        `${this.baseUrl}/${id}`, t, { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }


  /***
   * search values 
   */

  search(searchValue: any) {
    console.log("searching values...", searchValue)
    const pageIndex = 0;
    const pageSize = 10;
    const params = new HttpParams()
      .set('name', `${searchValue}`)
      .set('page', `${pageIndex}`)
      .set('size', `${pageSize}`);

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  /** 
   * 
   * searching values 
  */

  delete(id: string | number) {
    return this.http
      .delete(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }





  protected handleError(error: HttpErrorResponse): Observable<any> {
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














