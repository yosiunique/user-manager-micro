import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { Share } from '../../saving/model/saving';
import { ShareService } from '../../service/share-service';
import { NzListModule } from "ng-zorro-antd/list";
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from '../../auth/auth';
import { Uploadingfile } from '../../uploadfile/uploadingfile/uploadingfile';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    FormsModule, CommonModule, ReactiveFormsModule, NzTableModule,
    NzButtonModule, NzModalModule, NzDrawerModule, NzFormModule,
    NzTagModule, NzInputModule, NzDatePickerModule, NzSelectModule,
    NzIconModule, NzInputNumberModule, NzListModule, NzCardModule,
    NzPaginationModule, NzAvatarModule
  ],
  templateUrl: './share.html',
  styleUrls: ['./share.css'],
})
export class ShareComponent extends BaseComponent<Share> implements OnInit, OnDestroy {

  shares: Share[] = [];
  drawerVisible = false;
  currentId?: number;
  myShare?: Share;
  shareForm!: FormGroup;

  // Search State
  searchTerm: string = '';       // For Employee ID
  searchFullName: string = '';   // For Full Name
  isAdvancedSearch: boolean = false;
  destroy$ = new Subject<void>();
avatarTemplate: TemplateRef<void> | null | undefined;

  constructor(
    private fb: FormBuilder,
    private shareService: ShareService,
    protected override modal: NzModalService,
    protected auth: Auth,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {
    super(shareService, modal);
  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      const employeeId = params['employeeId'];
      if (employeeId) {
        this.getByEmployyeeId(employeeId);
      } else {
        this.loadShares();
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
    this.loadShares();
  }

  loadShares(): void {
    this.loading = true;
    let request;

    if (this.isAdvancedSearch && this.searchFullName.trim()) {
      request = this.shareService.searchByFullName(this.searchFullName.trim(), this.pageIndex, this.pageSize);
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      request = this.shareService.searchShares(this.searchTerm.trim(), this.pageIndex, this.pageSize);
    } else {
      request = this.shareService.getAll(this.pageIndex, this.pageSize);
    }

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.handleShareSuccess(data);
      },
      error: () => {
        this.message.error('Failed to load shares');
        this.loading = false;
      }
    });
  }

  private handleShareSuccess(data: any): void {
    this.shares = data.content || [];
    this.total = data.totalElements || 0;
    this.pageSize = data.size || 10;
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
    this.loadShares();
  }

  onPageChange(index: number): void {
    this.pageIndex = index - 1;
    this.loadShares();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
    this.loadShares();
  }

  initForm(): void {
    this.shareForm = this.fb.group({
      employee: this.fb.group({
        employeeId: ['', Validators.required]
      }),
      noOfShare: [0, Validators.required],
    });
  }

  openDrawer(share?: Share): void {
    this.drawerVisible = true;
    if (share) {
      this.isEditMode = true;
      this.currentId = share.id;
      this.shareForm.patchValue(share);
    } else {
      this.isEditMode = false;
      this.currentId = undefined;
      this.shareForm.reset({ noOfShare: 0 });
    }
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  submitForm(): void {
    if (this.shareForm.invalid) {
      this.message.error("Please fill all required fields");
      return;
    }
    const formValue: Share = { ...this.shareForm.value };
    const request = this.isEditMode && this.currentId
      ? this.shareService.update(this.currentId, formValue)
      : this.shareService.create(formValue);

    request.subscribe({
      next: () => {
        this.message.success(this.isEditMode ? "Share updated" : "Share created");
        this.drawerVisible = false;
        this.loadShares();
      },
      error: (err) => this.message.error(err.error?.message || "Operation failed")
    });
  }

  deleteShare(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this share?',
      nzContent: '<b style="color: red;">This action cannot be undone.</b>',
      nzOkText: 'Yes',
      nzOkDanger: true,
      nzOnOk: () => {
        this.shareService.delete(id).subscribe({
          next: () => {
            this.message.success('Share deleted');
            this.loadShares();
          },
          error: () => this.message.error('Delete failed')
        });
      }
    });
  }

  getByEmployyeeId(employeeId: any) {
    this.shareService.searchShares(employeeId, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.myShare = response;
        this.handleShareSuccess(response);
      },
      error: (err) => this.message.error(err.error?.message || "Operation failed")
    });
  }

  uploadFileShare() {
    this.modal.create({
      nzTitle: 'Uploading file',
      nzContent: Uploadingfile,
      nzData: 'share'
    }).afterClose.subscribe(() => this.loadShares());
  }

  haveRole(roleName: string) {
    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }
}