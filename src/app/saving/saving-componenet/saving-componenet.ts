import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { Employee } from '../model/saving';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { SavingService } from '../../service/saving-service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../core/sharedService/shared-service';
import { EmployeeService } from '../../service/employee-service';

@Component({
  selector: 'app-saving-componenet',
  standalone: true,
  imports: [
    NzTableModule, NzSwitchModule, CommonModule, NzModalModule, NzInputModule,
    NzButtonModule, ReactiveFormsModule, NzUploadModule, NzProgressModule,
    NzDividerModule, FormsModule, NzCardModule, NzListModule, NzGridModule,
    NzAvatarModule, NzPaginationModule, NzTagModule, NzIconModule
  ],
  templateUrl: './saving-componenet.html',
  styleUrl: './saving-componenet.css',
})
export class SavingComponenet extends BaseComponent<any> implements OnInit, OnDestroy {

  employees: Employee[] = [];
  myEmployees: Employee[] = [];
  
  // Search state variables
  searchTerm: string = '';      // For Employee ID
  searchFullName: string = '';  // For Advanced Search Name
  isAdvancedSearch: boolean = false;
  
  employeeId?: number;
  uploading = false;
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
        this.getsavingById(Number(empId));
      } else {
        this.loadSavings();
      }
    });
  }

  /**
   * Manual Search Trigger (On Button Click or Enter Key)
   */
  onSearch(): void {
    this.pageIndex = 0;
    this.loadSavings();
  }

  loadSavings() {
    this.loading = true;
    let request;

    // Logic for Button-Driven Search
    if (this.isAdvancedSearch && this.searchFullName.trim()) {
      request = this.employeeService.searchByName(this.searchFullName.trim(), this.pageIndex, this.pageSize);
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      request = this.employeeService.searchByEmployeeId(this.searchTerm.trim());
    } else {
      request = this.employeeService.getAll(this.pageIndex, this.pageSize);
    }

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.handleEmployeeSuccess(data),
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
    this.loadSavings();
  }

  onPageSizeChange($event: number) {
    this.pageSize = $event;
    this.loadSavings();
  }

  createSaving() {
    this.modal.create({
      nzTitle: 'Create New Saving Record',
      nzContent: SavingCrudComponenets,
      nzData: { status: 'create' },
      nzWidth: 800,
    });
    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
    });
  }

  uploadFile() {
    this.modal.create({
      nzTitle: 'Uploading file',
      nzContent: Uploadingfile,
      nzData: 'saving',
    });
    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
    });
  }

  getsavingById(id: number) {
    this.modal.create({
      nzTitle: 'Saving Details',
      nzContent: SavingCrudComponenets,
      nzData: { id: id, status: 'details' },
      nzWidth: 1200,
    });
    this.modal._afterAllClosed.subscribe(() => {
      this.loadSavings();
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
    this.loadSavings();
  }

  haveRole(roleName: string) {
    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }

  reloadPage() {
    location.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}