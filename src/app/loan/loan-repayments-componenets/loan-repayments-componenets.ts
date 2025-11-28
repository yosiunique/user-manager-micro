import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { LoanRepayment } from '../model/loan-repaymenet';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { SavingCrudComponenets } from '../../saving/saving-crud-componenets/saving-crud-componenets';
import { SavingService } from '../../service/saving-service';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { LoanRepaymentsCrudComponenets } from '../loan-repayments-crud-componenets/loan-repayments-crud-componenets';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';

@Component({
  selector: 'app-loan-repayments-componenets',
  imports: [
    NzTableModule, NzSwitchModule,
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
  templateUrl: './loan-repayments-componenets.html',
  styleUrl: './loan-repayments-componenets.css',
})
export class LoanRepaymentsComponenets extends  BaseComponent<LoanRepayment> implements OnInit  {





  
    loan: LoanRepayment[] = [];
    searchControl = new FormControl('search');
    searchTerm: string = '';
  
    metadataList: any[] = [];
    selectedFile: File | null = null;
    uploading = false
    searchSubject = new Subject<string>();
    destroy$ = new Subject<void>();
    private msg = inject(NzMessageService);
    constructor(private loanRepaymentService: LoanRepaymentService,
      modal: NzModalService ,
      private auth:Auth 
    ) {
      super(loanRepaymentService, modal);
    }
    ngOnInit(): void {
      this.loadLoanRepayments();
      this.setupSearch();
  
    }
  
  
  
  
    loadLoanRepayments() {
      this.loanRepaymentService.getAll(this.pageIndex, this.pageSize).subscribe({
        next: (data) => {
          this.loan = data.content;
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
  
  
  
    addNewLoanRepayments() {
  
    }
  
  
    clear() {
  
    }
  
    onPageChange($event: number) {
      this.pageIndex = $event - 1;
      this.loadLoanRepayments();
    }
    onPageSizeChange($event: number) {
  
      this.pageSize = $event;
      this.loadLoanRepayments();
    }
  
  
  
  
  
  
    getLoanRepaymentgById(employeeId: number) {
      const modal = this.modal.create({
        nzTitle: 'LoanRepayments Details',
        nzContent: LoanRepaymentsCrudComponenets,
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
        this.loadLoanRepayments();
      });
  
    }
  
  
  
  
    createLoanRepayments() {
  
  
      const modal = this.modal.create({
        nzTitle: 'Create New LoanRepayments Record ',
        nzContent: LoanRepaymentsCrudComponenets,
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
        this.loadLoanRepayments();
      });
  
  
    }
  
  
  
    onSearchChange(value: string): void {
      if (value.length === 0 || value.trim() === '' || value == null || value === undefined) {
        this.loadLoanRepayments();
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
          return this.loanRepaymentService.getLoanRepaymentByEmployeeId(term, this.pageIndex, this.pageSize);
        }),
        takeUntil(this.destroy$)        // 🧹 clean up on destroy
      ).subscribe({
        next: (data) => {
          this.loan = data.content;
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
  
  
  
  
  
  
  
  
    //upload handlers
    handleChange(event: any): void {
      const files = event.target?.files[0];
  
      this.selectedFile = files;
      console.log('Selected file', this.selectedFile);
  
    }
  
    uploadFile(): void {


this.modal.create({
  nzTitle:'Uploading Loan Repayments',
  nzContent:Uploadingfile,
  nzData:'loan-repayment'
})

































      // if (!this.selectedFile) {
      //   this.modal.error({ nzContent: 'No file selected' });
      //   return;
      // }
  
      // this.uploading = true;
      // this.loanRepaymentService.importCsv(this.selectedFile).subscribe({
      //   next: (res: any) => {
      //     this.uploading = false;
      //     this.msg.success('File uploaded successfully');
      //     // If backend returns imported rows preview, set metadataList:
      //     if (Array.isArray(res)) {
      //       this.metadataList = res;
      //     } else if (res?.metadata) {
      //       this.metadataList = res.metadata;
      //     }
      //     // refresh table
      //     this.loadLoanRepayments();
      //     this.selectedFile = null;
      //   },
      //   error: (err) => {
      //     console.error('Upload error', err);
      //     this.uploading = false;
      //     this.msg.error('Upload failed');
      //   }
      // });
    }
  

   reloadPage() {
  this.selectedFile=null ;
    }

      haveRole(roleName:string){
     
 const roles=this.auth.getUserRoles().map((role:any )=>role.roleTypes.role);
 return roles.includes(roleName);
  }
  
  }

