import { Component, inject, OnInit } from '@angular/core';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { SavingAndLoanRepayment } from '../model/saving';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';

@Component({
  selector: 'app-saving-componenet',
  imports: [NzTableModule, NzSwitchModule,
    CommonModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzProgressModule,
    NzDividerModule,
    FormsModule


  ],
  templateUrl: './saving-componenet.html',
  styleUrl: './saving-componenet.css',
})
export class SavingComponenet extends BaseComponent<SavingAndLoanRepayment> implements OnInit {


  saving: SavingAndLoanRepayment[] = [];
  searchControl = new FormControl('search');
  searchTerm: string = '';

  metadataList: any[] = [];
  selectedFile: File | null = null;
  uploading = false
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();
  private msg = inject(NzMessageService);
  constructor(private savingService: SavingService,
    private auth:Auth ,
    modal: NzModalService
  ) {
    super(savingService, modal);
  }
  ngOnInit(): void {
    this.loadSavings();
    this.setupSearch();

  }




  loadSavings() {
    this.savingService.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.saving = data.content;
        this.pageIndex = data.number;
        this.total = data.totalElements;
        this.pageSize = data.size;
        console.log("saving data loaded successfully", data)
      },
      error: (error) => {
        console.log("failed to load saving data", error)
      }
    });
  }



  addNewSaving() {

  }


  clear() {

  }

  onPageChange($event: number) {
    this.pageIndex = $event - 1;
    this.loadSavings();
  }
  onPageSizeChange($event: number) {

    this.pageSize = $event;
    this.loadSavings();
  }






  getsavingById(employeeId: number) {
    const modal = this.modal.create({
      nzTitle: 'Saving Details',
      nzContent: SavingCrudComponenets,
      nzData: {
        id: employeeId,
        status: 'details'
      },
      nzWidth: 3000,
      nzStyle: {
        // top: '100px',       // vertical offset from top
        // left: '100px',       // horizontal offset from left
        // right: 'auto',      // remove default centering if needed
        // transform: 'none'
      }
    });

    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
    });

  }




  createSaving() {


    const modal = this.modal.create({
      nzTitle: 'Create New Saving Record ',
      nzContent: SavingCrudComponenets,
      nzData: {

        status: 'create'
      },
      nzWidth: 800,
      nzOkText: null,
      nzCancelText: null,
      nzStyle: {

        // position: 'absolute',
        // top: '100px',       // vertical offset from top
        // left: '100px',       // horizontal offset from left
        // right: 'auto',      // remove default centering if needed
        // transform: 'none'
      }
    })
    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
    });


  }



  onSearchChange(value: string): void {
    if (value.length === 0 || value.trim() === '' || value == null || value === undefined) {
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
        this.pageIndex = data.number;
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





uploadFile(){


  this.modal.create({
    nzTitle:'Uploading file',
    nzContent:Uploadingfile ,
    nzOkText:'',
    nzCancelText:''
  })

}



   haveRole(roleName:string){
     
 const roles=this.auth.getUserRoles().map((role:any )=>role.roleTypes.role);
 return roles.includes(roleName);
  }

    reloadPage() {
    this.selectedFile=null;
  }

}


















