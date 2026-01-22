import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from '../service/employee-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { Employee } from '../saving/model/saving';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { BaseComponent } from '../core/basecomponenet/basecomponenet';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Uploadingfile } from '../uploadfile/uploadingfile/uploadingfile';
import { Auth } from '../auth/auth';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    FormsModule, CommonModule, ReactiveFormsModule, NzTableModule,
    NzButtonModule, NzModalModule, NzDrawerModule, NzFormModule,
    NzTagModule, NzInputModule, NzDatePickerModule, NzSelectModule,
    NzIconModule, NzInputNumberModule, NzCardModule, NzListModule,
    NzGridModule, NzAvatarModule, NzPaginationModule, NzDividerModule,
    NzSkeletonModule
  ],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent extends BaseComponent<Employee> implements OnInit, OnDestroy {

  employees: Employee[] = [];
  drawerVisible = false;
  currentId?: number;

  employeeForm!: FormGroup;
  
  // Search State
  searchTerm: string = '';      // For Employee ID
  searchFullName: string = '';  // For Full Name
  isAdvancedSearch: boolean = false;
  
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    protected override modal: NzModalService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    protected auth: Auth
  ) {
    super(employeeService, modal)
  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      const employeeId = params['employeeId'];
      if (employeeId) {
        this.searchTerm = employeeId;
        this.loadEmployees();
      } else {
        this.loadEmployees();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TRIGGER SEARCH MANUALLY
  onSearch(): void {
    this.pageIndex = 0;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    let request;

    if (this.isAdvancedSearch && this.searchFullName.trim()) {
      // Searching by Name
      request = this.employeeService.searchByName(this.searchFullName.trim(), this.pageIndex, this.pageSize);
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Searching by Employee ID
      request = this.employeeService.searchByEmployeeId(this.searchTerm.trim());
    } else {
      // Load All
      request = this.employeeService.getAll(this.pageIndex, this.pageSize);
    }

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.handleEmployeeSuccess(data);
      },
      error: () => {
        this.message.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  private handleEmployeeSuccess(data: any): void {
    // Handling both Paginated and Single Object responses
    this.employees = data.content || (data.id ? [data] : []);
    this.total = data.totalElements || (data.id ? 1 : 0);
    this.pageSize = data.size || this.pageSize;
    this.pageIndex = data.number || 0;
    this.loading = false;
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
    this.loadEmployees();
  }

  onPageChange(index: number): void {
    this.pageIndex = index - 1;
    this.loadEmployees();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
    this.loadEmployees();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeFullName: ['', Validators.required],
      membershipId: ['', Validators.required]
    });
  }

  openDrawer(employee?: Employee): void {
    this.drawerVisible = true;
    if (employee) {
      this.isEditMode = true;
      this.currentId = employee.id;
      this.employeeForm.patchValue({ ...employee });
    } else {
      this.isEditMode = false;
      this.currentId = undefined;
      this.employeeForm.reset();
    }
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.message.error("Please fill all required fields");
      return;
    }
    const formValue: Employee = { ...this.employeeForm.value };
    const request = this.isEditMode && this.currentId
      ? this.employeeService.update(this.currentId, formValue)
      : this.employeeService.create(formValue);

    request.subscribe({
      next: (response) => {
        this.message.success(this.isEditMode ? "Updated successfully" : "Created successfully");
        this.drawerVisible = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.message.error(err.error?.message || "Operation failed");
        this.drawerVisible = false;
      }
    });
  }

  deleteEmployee(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this employee?',
      nzContent: '<b style="color: red;">This action cannot be undone.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.employeeService.delete(id).subscribe({
          next: () => {
            this.message.success('Employee deleted');
            this.loadEmployees();
          },
          error: () => this.message.error('Delete failed')
        });
      },
      nzCancelText: 'No'
    });
  }

  importCsv() {
    this.modal.create({
      nzTitle: 'Uploading file',
      nzContent: Uploadingfile,
      nzData: 'employee'
    }).afterClose.subscribe(() => this.loadEmployees());
  }

  haveRole(roleName: string) {
    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }
}