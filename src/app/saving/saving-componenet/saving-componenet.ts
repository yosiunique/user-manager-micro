
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { Employee, SavingAndLoanRepayment } from '../model/saving';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SavingService } from '../../service/saving-service';
import { CommonModule } from '@angular/common';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { SavingCrudComponenets } from '../saving-crud-componenets/saving-crud-componenets';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../core/sharedService/shared-service';
import { EmployeeService } from '../../service/employee-service';

@Component({
  selector: 'app-saving-componenet',
  standalone: true,
  imports: [NzTableModule, NzSwitchModule,
    CommonModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzProgressModule,
    NzDividerModule,
    FormsModule,
    NzCardModule,
    NzListModule,
    NzGridModule,
    NzAvatarModule,
    NzPaginationModule,
    NzTagModule,
    NzIconModule
  ],
  templateUrl: './saving-componenet.html',
  styleUrl: './saving-componenet.css',
})
export class SavingComponenet extends BaseComponent<any> implements OnInit, OnDestroy {

  employees: Employee[] = [];
  myEmployees: Employee[] = [];
  searchTerm: string = '';
  employeeId?: number;
  uploading = false;
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();
  
  private msg = inject(NzMessageService);
  private employeeService = inject(EmployeeService);

  constructor(
    private savingService: SavingService,
    private auth: Auth,
    modal: NzModalService,
    private dataService: SharedService,
    private route: ActivatedRoute
  ) {
    super(savingService, modal);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const empId = params['employeeId'];
      if (empId) {
        this.employeeId = empId;
        this.searchTerm = empId;
        this.searchSubject.next(empId);
        this.getsavingById(Number(empId));
      } else {
        this.loadSavings();
      }
    });
    this.setupSearch();
  }

  loadSavings() {
    this.loading = true;
    // Using employee-service instead of saving-service to load the list
    const request = this.searchTerm && this.searchTerm.trim() !== ''
      ? this.employeeService.searchByEmployeeId(this.searchTerm)
      : this.employeeService.getAll(this.pageIndex, this.pageSize);

    request.subscribe({
      next: (data) => this.handleEmployeeSuccess(data),
      error: (error) => {
        console.error("Failed to load employee data", error);
        this.loading = false;
      }
    });
  }

  private handleEmployeeSuccess(data: any): void {
    this.employees = data.content;
    this.myEmployees = data.content; // Assigning to both for visual consistency in your roles
    this.total = data.totalElements;
    this.pageSize = data.size;
    this.pageIndex = data.number;
    this.loading = false;
  }

  onPageChange($event: number) {
    this.pageIndex = $event - 1;
    this.loadSavings();
  }

  onPageSizeChange($event: number) {
    this.pageSize = $event;
    this.loadSavings();
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




  uploadFile() {


    this.modal.create({
      nzTitle: 'Uploading file',
      nzContent: Uploadingfile,
      nzData: 'saving',
      nzOkText: null,
      nzCancelText: null
    });
    this.modal._afterAllClosed.subscribe({
      next: () => {
        this.loadSavings()
      }
    })


  }






  // This method remains linked to SavingCrudComponenets as per your requirement
  getsavingById(id: number) {
    const modal = this.modal.create({
      nzTitle: 'Saving Details',
      nzContent: SavingCrudComponenets,
      nzData: {
        id: id,
        status: 'details'
      },
      nzWidth: 1200, // Adjusted for better viewing
    });

    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
    });
  }

   haveRole(roleName: string) {

    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }

  reloadPage() {
    location.reload();
  }


  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        this.pageIndex = 0;
        this.searchTerm = term;
        return this.employeeService.searchByEmployeeId(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.handleEmployeeSuccess(data),
      error: () => this.loading = false
    });
  }

  onSearchChange(value: string): void {
    if (!value || value.trim() === '') {
      this.searchTerm = '';
      this.pageIndex = 0;
      this.loadSavings();
      return;
    }
    this.searchSubject.next(value);
  }

  // ... Other methods (createSaving, uploadFile, haveRole, reloadPage) remain exactly the same ...

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}















































// import { Component, inject, OnInit } from '@angular/core';
// import { NzTableModule } from "ng-zorro-antd/table";
// import { NzSwitchModule } from "ng-zorro-antd/switch";
// import { SavingAndLoanRepayment } from '../model/saving';
// import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
// import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
// import { SavingService } from '../../service/saving-service';
// import { CommonModule } from '@angular/common';
// import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NzIconModule } from 'ng-zorro-antd/icon';
// import { NzUploadModule } from 'ng-zorro-antd/upload';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzListModule } from 'ng-zorro-antd/list';
// import { NzGridModule } from 'ng-zorro-antd/grid';
// import { NzAvatarModule } from 'ng-zorro-antd/avatar';
// import { NzPaginationModule } from 'ng-zorro-antd/pagination';
// import { NzTagModule } from 'ng-zorro-antd/tag';
// import { NzProgressModule } from 'ng-zorro-antd/progress';
// import { SavingCrudComponenets } from '../saving-crud-componenets/saving-crud-componenets';
// import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { Auth } from '../../auth/auth';
// import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';
// import { ActivatedRoute } from '@angular/router';
// import { SharedService } from '../../core/sharedService/shared-service';
// import { EmployeeService } from '../../service/employee-service';
// 
// @Component({
//   selector: 'app-saving-componenet',
//   standalone: true,
//   imports: [NzTableModule, NzSwitchModule,
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
//   templateUrl: './saving-componenet.html',
//   styleUrl: './saving-componenet.css',
// })
// export class SavingComponenet extends BaseComponent<SavingAndLoanRepayment> implements OnInit {


//   saving: SavingAndLoanRepayment[] = [];
//   searchControl = new FormControl('search');
//   searchTerm: string = '';
//   employeeId?: number;
//   mySaving: SavingAndLoanRepayment[] = []
//   metadataList: any[] = [];
//   selectedFile: File | null = null;
//   uploading = false
//   searchSubject = new Subject<string>();
//   destroy$ = new Subject<void>();
//   private msg = inject(NzMessageService);
//   private employeeService=inject(EmployeeService);
//   constructor(private savingService: SavingService,
//     private auth: Auth,
//     modal: NzModalService,
//     private dataService: SharedService,
//     private route: ActivatedRoute
//   ) {
//     super(savingService, modal);
//   }
//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const employeeId = params['employeeId'];
//       if (employeeId) {
//         this.employeeId = employeeId;
//         this.searchTerm = employeeId;
//         this.searchSubject.next(employeeId);
//         this.getsavingById(this.employeeId as number)
//       } else {
//         this.loadSavings();
//       }
//     });
//     this.setupSearch();

//   }




//   loadSavings() {
//     this.loading = true;
//     const request = this.searchTerm && this.searchTerm.trim() !== ''
//       ? this.savingService.getsavingByEmployeeId(this.searchTerm, this.pageIndex, this.pageSize)
//       : this.savingService.getAll(this.pageIndex, this.pageSize);

//     request.subscribe({
//       next: (data) => {
//         this.handleSavingSuccess(data);
//       },
//       error: (error) => {
//         console.error("Failed to load saving data", error);
//         this.loading = false;
//       }
//     });
//   }

//   private handleSavingSuccess(data: any): void {
//     this.saving = data.content;
//     this.total = data.totalElements;
//     this.pageSize = data.size;
//     this.pageIndex = data.number;
//     this.loading = false;
//   }



//   addNewSaving() {

//   }


//   clear() {

//   }

//   onPageChange($event: number) {
//     this.pageIndex = $event - 1;
//     this.loadSavings();
//   }
//   onPageSizeChange($event: number) {

//     this.pageSize = $event;
//     this.loadSavings();
//   }






//   getsavingById(employeeId: number) {
//     const modal = this.modal.create({
//       nzTitle: 'Saving Details',
//       nzContent: SavingCrudComponenets,
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
//         this.dataService.savingByEmployeeId$.subscribe((data: any) => {
//           this.mySaving = data.content;
//           this.pageIndex = data.number;
//           this.total = data.totalElements;
//           this.pageSize = data.size;
//           this.handleSavingSuccess(data);
//           console.log("my saving", this.mySaving)
//         });
//       } else {

//         this.loadSavings();
//       }

//     });

//   }




//   createSaving() {


//     const modal = this.modal.create({
//       nzTitle: 'Create New Saving Record ',
//       nzContent: SavingCrudComponenets,
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
//       this.loadSavings();
//     });


//   }



//   onSearchChange(value: string): void {
//     if (!value || value.trim() === '') {
//       this.searchTerm = '';
//       this.pageIndex = 0;
//       this.loadSavings();
//       return;
//     }
//     this.searchSubject.next(value);
//   }

//   setupSearch(): void {
//     this.searchSubject.pipe(
//       debounceTime(800),
//       distinctUntilChanged(),
//       switchMap(term => {
//         this.loading = true;
//         this.pageIndex = 0;
//         this.searchTerm = term;
//         return this.savingService.getsavingByEmployeeId(term, this.pageIndex, this.pageSize);
//       }),
//       takeUntil(this.destroy$)
//     ).subscribe({
//       next: (data) => {
//         this.handleSavingSuccess(data);
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





//   uploadFile() {


//     this.modal.create({
//       nzTitle: 'Uploading file',
//       nzContent: Uploadingfile,
//       nzData: 'saving',
//       nzOkText: null,
//       nzCancelText: null
//     });
//     this.modal._afterAllClosed.subscribe({
//       next: () => {
//         this.loadSavings()
//       }
//     })


//   }



//   haveRole(roleName: string) {

//     const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
//     return roles.includes(roleName);
//   }

//   reloadPage() {
//     location.reload();
//   }

// }


















