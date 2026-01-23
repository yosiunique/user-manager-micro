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
import { Subject, takeUntil } from 'rxjs';
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
  myview:boolean=false;
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
        this.myview=true;
        this.getLoanRepaymentgById(Number(empId));
      } else {
        this.myview=false;
        this.loadLoanRepayments();
      }
    });
  }

  // TRIGGER SEARCH MANUALLY
  onSearch(): void {
    this.pageIndex = 0; // Reset to first page on new search
    this.loadLoanRepayments();
  }

  loadLoanRepayments() {
    this.loading = true;
    let request;

    // Search Logic: Button-driven
    if (this.isAdvancedSearch && this.searchFullName.trim()) {
      request = this.employeeService.searchByName(this.searchFullName.trim(), this.pageIndex, this.pageSize);
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      request = this.employeeService.searchByEmployeeId(this.searchTerm.trim());
    } else {
      request = this.employeeService.getAll(this.pageIndex, this.pageSize);
    }

    request.pipe(takeUntil(this.destroy$)).subscribe({
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