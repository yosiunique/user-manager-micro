import { BehaviorSubject } from "rxjs";
import { BaseService } from "../baseservice/base-service";
import { NzModalService } from "ng-zorro-antd/modal";




export class BaseComponent<T> { 
    // data$ = new BehaviorSubject<T[] | null>(null);
    // item$=new BehaviorSubject<T |null>(null);
    // createData$=new BehaviorSubject<T|null>(null);
    // updateData=new BehaviorSubject<T|null>(null);
    // embeddedData$ = new BehaviorSubject<any | null>(null);
   total = 1;
  data: T[] = [];
  item: T | null = null;
  loading = false;
visible = false;
  pageSize = 10;
  pageIndex = 0;
  isFormVisible = false; // for modal
  selectedItem: T | null = null;
  isEditMode = false;
  searchQuery: string = '';// For tracking if edit or add
  fieldConfig: any[] = [];
  totalElements = 0;
  totalPages = 0;
  constructor(protected service: BaseService<T> ,
    protected modal :NzModalService
  ) {
  }

/**
 * 
 * @param i  create data 
 * 
 */

    //   }

create(i: T){
  this.service.create(i).subscribe({
  next:(data)=>{
    console.log("this data is inserted successfully" , data);
    this.modal.confirm({
      nzTitle:'Succesfully creted',
      nzContent:'this Object Created SuccessFully =['+data +']'
    })
  },
  error:(error)=>{
    this.modal.error(
      {
        nzContent:'falied to create  data :'+error +'of this data ...'
      }
    )
  }

  })
  }

  /**
   * update 
   */

  update(id:number ,u:T){
    this.service.update(id,u).subscribe({
      next:(data)=>{
         this.modal.confirm({
      nzTitle:'Succesfully updated',
      nzContent:'this Object Updated SuccessFully =['+data +']'
    })
      }
    })
  }

/**
 * get all data using  pagination
 */
  getAll() {
    this.loading = true;
    this.service.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (res:any ) => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

/**
 * get data by id
 */
  
  getById(id: number | undefined, onError: (err: any) => void, onSuccess: () => void) {
    if (id == null) return;
    this.loading=true;
    this.service.getById(id).subscribe({
      next: (data :any ) => {
        this.loading=false ;
        onSuccess()
      },
      error: err => {
        onError(err)
        this.loading=false;
      },
      complete: () => {
        console.log("complete")
        this.loading=false ;
      }

    })
  }


/**
 * 
 * create data 
 * 
 */



   delete(id: number): void {
  this.service.delete(id).subscribe({
    next:(data)=>{
      this.modal.confirm({
        nzContent:'this data is successfull deleted.... '+ data
      })
    },
    error:(error)=>{
       this.modal.confirm({
        nzContent:'failde to delete... ' + error
      })
    }
  })
  }



  /**
   * search
   */
 search(query: string): void {
    this.loading = true;
    console.log(this.getSearchQuery(query));
  this.service.search(query);
  }



  save(t: T, onError: (err: any) => void, onSuccess: () => void): void {
    // this.loading = true;
    // this.service.create(t).pipe(finalize(() => this.loading = false)).subscribe({
    //   next: () => {
    //     this.getAll(this.pageIndex, this.pageSize, null, null, []);
    //     onSuccess()
    //   },
    //   error: err => {
    //     onError(err)
    //   }
    // })
  }

 

 


  private getSearchQuery(jsonQuery: any): Array<{ key: string; value: string[] }> {
    const filters: Array<{ key: string; value: string[] }> = [];

    for (const field in jsonQuery) {
      if (jsonQuery.hasOwnProperty(field)) {
        const fieldValue = jsonQuery[field];
        if (fieldValue == null) continue
        if (typeof fieldValue === 'string' && fieldValue.includes(':')) {
          // Split operator and value by the colon delimiter
          const [operator, value] = fieldValue.split(':');

          // Push the parsed field, operator, and value into filters array

          filters.push({
            // key: `${field}.${operator}`, // Example: "name.eq", "status.contains"
            key: field, // Example: "name.eq", "status.contains"
            value: [operator, value],
          });
        } else {
          // Default assumption: Use "eq" if no explicit operator present in value
          filters.push({
            key: field,
            value: [':', this._encloseInQuotes(fieldValue)],
          });
        }
      }
    }

    return filters;
  }

  _encloseInQuotes(value: string): string {
    if (value.includes(" ")) {
      return `'${value}'`;
    }
    return value;
  }












}






