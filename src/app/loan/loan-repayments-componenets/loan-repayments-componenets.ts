import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { Employee } from '../../saving/model/saving';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { LoanRepaymentsCrudComponenets } from '../loan-repayments-crud-componenets/loan-repayments-crud-componenets';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../core/sharedService/shared-service';
import { EmployeeService } from '../../service/employee-service';

@Component({
  selector: 'app-loan-repayments-componenets',
  standalone: true,
  imports: [
    NzTableModule, NzSwitchModule, CommonModule, NzModalModule, NzInputModule,
    NzButtonModule, ReactiveFormsModule, NzUploadModule, NzProgressModule,
    NzDividerModule, FormsModule, NzCardModule, NzListModule, NzGridModule,
    NzAvatarModule, NzPaginationModule, NzTagModule, NzIconModule
  ],
  templateUrl: './loan-repayments-componenets.html',
  styleUrl: './loan-repayments-componenets.css',
})
export class LoanRepaymentsComponenets extends BaseComponent<any> implements OnInit, OnDestroy {

  employees: Employee[] = [];
  myEmployees: Employee[] = [];
  searchTerm: string = '';
  searchFullName: string = '';
  isAdvancedSearch: boolean = false;
  uploading = false;
  employeeId?: number;
  
  // Two subjects to handle debounced search for both fields
  searchSubject = new Subject<void>();
  destroy$ = new Subject<void>();
  
  private msg = inject(NzMessageService);
  private employeeService = inject(EmployeeService);

  constructor(
    private loanRepaymentService: LoanRepaymentService,
    modal: NzModalService,
    private auth: Auth,
    private dataService: SharedService,
    private route: ActivatedRoute
  ) {
    super(loanRepaymentService, modal);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const empId = params['employeeId'];
      if (empId) {
        this.employeeId = empId;
        this.searchTerm = empId;  
        this.getLoanRepaymentgById(Number(empId));
      } else {
        this.loadLoanRepayments();
      }
    });
    this.setupSearch();
  }

  loadLoanRepayments() {
    this.loading = true;
    let request;

    // Logic to determine which service to call
    if (this.isAdvancedSearch && this.searchFullName.trim()) {
      request = this.employeeService.searchByName(this.searchFullName, this.pageIndex, this.pageSize);
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      request = this.employeeService.searchByEmployeeId(this.searchTerm);
    } else {
      request = this.employeeService.getAll(this.pageIndex, this.pageSize);
    }

    request.subscribe({
      next: (data: any) => this.handleEmployeeSuccess(data),
      error: (error) => {
        console.error("Failed to load employee data", error);
        this.loading = false;
      }
    });
  }

  private handleEmployeeSuccess(data: any): void {
    this.employees = data.content || [];
    this.myEmployees = data.content || [];
    this.total = data.totalElements || 0;
    this.pageSize = data.size || 10;
    this.pageIndex = data.number || 0;
    this.loading = false;
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
      nzTitle: 'Loan Repayments Details',
      nzContent: LoanRepaymentsCrudComponenets,
      nzData: { id: employeeId, status: 'details' },
      nzWidth: 1200,
    });

    this.modal._afterAllClosed.subscribe(() => {
      this.loadLoanRepayments();
    });
  }

  createLoanRepayments() {
    const modal = this.modal.create({
      nzTitle: 'Create New Loan Repayment Record',
      nzContent: LoanRepaymentsCrudComponenets,
      nzData: { status: 'create' },
      nzWidth: 800,
    });
    this.modal._afterAllClosed.subscribe(() => this.loadLoanRepayments());
  }

  uploadFile(): void {
    this.modal.create({
      nzTitle: 'Uploading Loan Repayments',
      nzContent: Uploadingfile,
      nzData: 'loan-repayment'
    });
    this.modal._afterAllClosed.subscribe(() => this.loadLoanRepayments());
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next();
  }

  onFullNameSearchChange(value: string): void {
    this.searchFullName = value;
    this.searchSubject.next();
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(() => {
        this.loading = true;
        this.pageIndex = 0;
        
        if (this.isAdvancedSearch && this.searchFullName.trim()) {
           return this.employeeService.searchByName(this.searchFullName, this.pageIndex, this.pageSize);
        } else if (this.searchTerm.trim()) {
           return this.employeeService.searchByEmployeeId(this.searchTerm);
        } else {
           return this.employeeService.getAll(this.pageIndex, this.pageSize);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: any) => this.handleEmployeeSuccess(data),
      error: () => this.loading = false
    });
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearch = !this.isAdvancedSearch;
    if (!this.isAdvancedSearch) {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchFullName = '';
    this.pageIndex = 0;
    this.loadLoanRepayments();
  }

  haveRole(roleName: string): boolean {
    const userRoles = this.auth.getUserRoles();
    if (!userRoles) return false;
    const roles = userRoles.map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}





// import { CommonModule } from '@angular/common';
// import { Component, inject, OnInit } from '@angular/core';
// import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NzIconModule } from 'ng-zorro-antd/icon';

// import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
// import { NzProgressModule } from 'ng-zorro-antd/progress';
// import { NzSwitchModule } from 'ng-zorro-antd/switch';
// import { NzTableModule } from 'ng-zorro-antd/table';
// import { NzUploadModule } from 'ng-zorro-antd/upload';
// import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzListModule } from 'ng-zorro-antd/list';
// import { NzGridModule } from 'ng-zorro-antd/grid';
// import { NzAvatarModule } from 'ng-zorro-antd/avatar';
// import { NzPaginationModule } from 'ng-zorro-antd/pagination';
// import { NzTagModule } from 'ng-zorro-antd/tag';
// import { LoanRepayment } from '../model/loan-repaymenet';
// import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
// import { SavingCrudComponenets } from '../../saving/saving-crud-componenets/saving-crud-componenets';
// import { SavingService } from '../../service/saving-service';
// import { LoanRepaymentService } from '../../service/loan-repayment-service';
// import { LoanRepaymentsCrudComponenets } from '../loan-repayments-crud-componenets/loan-repayments-crud-componenets';
// import { Auth } from '../../auth/auth';
// import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';
// import { ActivatedRoute } from '@angular/router';
// import { SharedService } from '../../core/sharedService/shared-service';

// @Component({
//   selector: 'app-loan-repayments-componenets',
//   standalone: true,
//   imports: [
//     NzTableModule, NzSwitchModule,
//     CommonModule,
//     NzModalModule,
//     NzInputModule,
//     NzButtonModule,
//     ReactiveFormsModule,
//     NzUploadModule,
//     NzProgressModule,
//     NzDividerModule,
//     FormsModule,
//     NzCardModule,
//     NzListModule,
//     NzGridModule,
//     NzAvatarModule,
//     NzPaginationModule,
//     NzTagModule,
//     NzIconModule
//   ],
//   templateUrl: './loan-repayments-componenets.html',
//   styleUrl: './loan-repayments-componenets.css',
// })
// export class LoanRepaymentsComponenets extends BaseComponent<LoanRepayment> implements OnInit {


//   loan: LoanRepayment[] = [];
//   myLoan: LoanRepayment[] = [];
//   searchControl = new FormControl('search');
//   searchTerm: string = '';
//   searchFullName: string = '';
//   isAdvancedSearch: boolean = false;

//   metadataList: any[] = [];
//   selectedFile: File | null = null;
//   uploading = false;
//   employeeId?: number;
//   searchSubject = new Subject<string>();
//   destroy$ = new Subject<void>();
//   private msg = inject(NzMessageService);
//   constructor(private loanRepaymentService: LoanRepaymentService,
//     modal: NzModalService,
//     private auth: Auth,
//     private dataService: SharedService,
//     private route: ActivatedRoute
//   ) {
//     super(loanRepaymentService, modal);
//   }
//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const employeeId = params['employeeId'];
//       if (employeeId) {
//         this.employeeId = employeeId;
//         this.getLoanRepaymentgById(employeeId);

//       } else {
//         this.loadLoanRepayments();
//         this.searchSubject.next(employeeId);
//       }
//     });

//     this.setupSearch();

//   }




//   loadLoanRepayments() {
//     this.loanRepaymentService.getAll(this.pageIndex, this.pageSize).subscribe({
//       next: (data) => {
//         this.loan = [];   // important: reset before rendering

//         data.content.forEach((dataItem: LoanRepayment) => {
//           const empId = dataItem.loan.employee.employeeId;

//           const exists = this.loan.some(
//             (item: LoanRepayment) =>
//               item.loan.employee.employeeId === empId
//           );

//           if (!exists) {
//             this.loan.push(dataItem);
//           }
//         });

//         this.pageIndex = data.number;
//         this.total = data.totalElements;
//         this.pageSize = data.size;


//       },
//       error: (error) => {
//         console.log("failed to load saving data", error)
//       }
//     });
//   }



//   addNewLoanRepayments() {

//   }


//   clear() {

//   }

//   onPageChange($event: number) {
//     this.pageIndex = $event - 1;
//     this.loadLoanRepayments();
//   }
//   onPageSizeChange($event: number) {

//     this.pageSize = $event;
//     this.loadLoanRepayments();
//   }






//   getLoanRepaymentgById(employeeId: number) {
//     const modal = this.modal.create({
//       nzTitle: 'LoanRepayments Details',
//       nzContent: LoanRepaymentsCrudComponenets,
//       nzData: {
//         id: employeeId,
//         status: 'details'
//       },
//       nzWidth: 3000,
//       nzStyle: {

//       }
//     });

//     this.modal._afterAllClosed.subscribe(() => {
//       if (this.employeeId) {
//         this.dataService.loanRepayById$.subscribe({
//           next: (data: any) => {

//             this.myLoan = data.content
//             this.pageIndex = data.number;
//             this.pageSize = data.size;
//             this.total = data.totalElements;
//             this.loading = false;
//             this.destroy$.next();
//             this.destroy$.complete();

//             this.loan = data.content;
//             this.pageIndex = data.number;
//             this.total = data.totalElements;
//             this.pageSize = data.size;

//             console.log("myLoan", this.myLoan)





//           },

//         })
//       } else {
//         this.loadLoanRepayments();
//       }
//     });

//   }




//   createLoanRepayments() {


//     const modal = this.modal.create({
//       nzTitle: 'Create New LoanRepayments Record ',
//       nzContent: LoanRepaymentsCrudComponenets,
//       nzData: {

//         status: 'create'
//       },
//       nzWidth: 800,
//       nzOkText: null,
//       nzCancelText: null,
//       nzStyle: {

//         // position: 'absolute',
//         // top: '100px',       // vertical offset from top
//         // left: '100px',       // horizontal offset from left
//         // right: 'auto',      // remove default centering if needed
//         // transform: 'none'
//       }
//     })
//     this.modal._afterAllClosed.subscribe(() => {
//       this.loadLoanRepayments();
//     });


//   }



//   onSearchChange(value: string): void {
//     this.searchTerm = value;
//     this.triggerSearch();
//   }

//   onFullNameSearchChange(value: string): void {
//     this.searchFullName = value;
//     this.triggerSearch();
//   }

//   triggerSearch(): void {
//     if (!this.searchTerm.trim() && !this.searchFullName.trim()) {
//       this.loadLoanRepayments();
//       return;
//     }
//     this.searchSubject.next(this.searchTerm);
//   }

//   toggleAdvancedSearch(): void {
//     this.isAdvancedSearch = !this.isAdvancedSearch;
//     if (!this.isAdvancedSearch) {
//       this.clearSearch();
//     }
//   }

//   clearSearch(): void {
//     this.searchTerm = '';
//     this.searchFullName = '';
//     this.loadLoanRepayments();
//   }

//   setupSearch(): void {
//     this.searchSubject.pipe(
//       debounceTime(800),
//       distinctUntilChanged(),
//       switchMap(() => {
//         this.loading = true;
//         this.pageIndex = 0;

//         return (this.loanRepaymentService as any).searchLoanRepayments(
//           this.searchTerm,
//           this.isAdvancedSearch ? this.searchFullName : null,
//           this.pageIndex,
//           this.pageSize
//         );
//       }),
//       takeUntil(this.destroy$)        // 🧹 clean up on destroy
//     ).subscribe({
//       next: (data: any) => {
//         this.loan = data.content;
//         this.total = data.totalElements;
//         this.pageSize = data.size;
//         this.pageIndex = data.number;
//         this.loading = false;
//         console.log('search results:', data);
//       },
//       error: (err) => {
//         console.error('Error during search:', err);
//         this.loading = false;
//       }
//     });
//   }





//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }








//   //upload handlers
//   handleChange(event: any): void {
//     const files = event.target?.files[0];

//     this.selectedFile = files;
//     console.log('Selected file', this.selectedFile);

//   }

//   uploadFile(): void {


//     this.modal.create({
//       nzTitle: 'Uploading Loan Repayments',
//       nzContent: Uploadingfile,
//       nzData: 'loan-repayment'
//     })


//     this.modal._afterAllClosed.subscribe({
//       next: () => {
//         this.loadLoanRepayments();
//       }
//     })
//   }


//   reloadPage() {
//     location.reload();
//   }

//   haveRole(roleName: string) {

//     const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
//     return roles.includes(roleName);
//   }

// }

