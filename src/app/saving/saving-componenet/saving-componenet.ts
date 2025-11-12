import { Component, OnInit } from '@angular/core';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { SavingAndLoanRepayment } from '../model/saving';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { SavingService } from '../../service/saving-service';
import { CommonModule } from '@angular/common';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SavingCrudComponenets } from '../saving-crud-componenets/saving-crud-componenets';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-saving-componenet',
  imports: [NzTableModule, NzSwitchModule ,
    CommonModule ,
    NzModalModule ,
    NzInputModule ,
    NzButtonModule,
    ReactiveFormsModule  ,
    NzUploadModule,
    NzProgressModule ,
    NzDividerModule ,
    FormsModule 


  ],
  templateUrl: './saving-componenet.html',
  styleUrl: './saving-componenet.css',
})
export class SavingComponenet  extends BaseComponent<SavingAndLoanRepayment> implements OnInit {
reloadPage() {
throw new Error('Method not implemented.');
}
  saving:SavingAndLoanRepayment[]=[];
  searchControl=new FormControl('search');
    searchTerm:string='';
  searchSubject = new Subject<string>(); 
  destroy$ = new Subject<void>();
  constructor( private  savingService:SavingService ,
    modal:NzModalService
  ) { 
    super(savingService,modal);
  }
  ngOnInit(): void {
   this.loadSavings();
       this.setupSearch();

  }




  loadSavings(){
    this.savingService.getAll(this.pageIndex,this.pageSize).subscribe({
      next:(data)=>{
        this.saving=data.content;
        this.pageIndex=data.number;
        this.total=data.totalElements;
       this.pageSize=data.size; 
        console.log("saving data loaded successfully",data)
      },
      error:(error)=>{
        console.log("failed to load saving data",error)
      }
    }); 
  }



  addNewSaving(){

  }


clear(){

}

    onPageChange($event: number) {
 this.pageIndex=$event-1;
  this.loadSavings();
}
onPageSizeChange($event: number) {

  this.pageSize=$event;
  this.loadSavings();
}




selectedFile: File | null = null;
  metadataList: any[] = [];
  uploading = false;



  handleChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.modal.error({ nzContent: 'Please select a CSV file first!' });
      return;
    }

    this.uploading = true;
    this.savingService.importCsv(this.selectedFile).subscribe({
      next: (response: any) => {
        this.uploading = false;
        this.modal.success({ nzContent: 'CSV uploaded successfully!' });
        console.log('Upload response:', response);
        
        // Example: If backend returns uploaded data, show them
        this.metadataList = response || [];
      },
      error: (err) => {
        this.uploading = false;
        console.error('Upload failed:', err);
        this.modal.error({ nzContent: 'File upload failed. Please try again.' });
      }
    });
  }



getsavingById(employeeId:string){
 this.modal.create({
      nzTitle:'Saving Details',
      nzContent:SavingCrudComponenets,
      nzData:{
        id:employeeId
      },
       nzWidth:3000,
       nzStyle:{
      // top: '100px',       // vertical offset from top
      // left: '100px',       // horizontal offset from left
      // right: 'auto',      // remove default centering if needed
      // transform: 'none'
       }
    })
}




onSearchChange(value: string): void {
  if(value.length===0 || value.trim()==='' || value==null || value===undefined){
    this.loadSavings();
    return;
  }
    this.searchSubject.next(value);
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(800),             
      distinctUntilChanged(),       
      switchMap(term => {
        this.loading = true;
        this.pageIndex = 0;          
        return this.savingService.getsavingByEmployeeId(term, this.pageIndex, this.pageSize);
      }),
      takeUntil(this.destroy$)        // 🧹 clean up on destroy
    ).subscribe({
      next: (data) => {
        this.saving = data.content;
        this.total = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number ;
        this.loading = false;
        console.log('search results:', data);
      },
      error: (err) => {
        console.error('Error during search:', err);
        this.loading = false;
      }
    });
  }



  

 ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }






}


















