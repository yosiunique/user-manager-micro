import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzDrawerModule,
    NzFormModule,
    NzTagModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzInputNumberModule
  ],
  templateUrl: './share.html',
  styleUrls: ['./share.css'],
})
export class ShareComponent extends BaseComponent<Share> implements OnInit {

  shares: Share[] = [];
  drawerVisible = false;
  currentId?: number;

  shareForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shareService: ShareService,
    protected override modal: NzModalService,
    private message: NzMessageService
  ) {
    super(shareService, modal);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadShares();
  }

  initForm(): void {
    this.shareForm = this.fb.group({
      employeeId: ['', Validators.required],
      membershipId: ['', Validators.required],
      fullName: ['', Validators.required],
      totalSaving: [0, Validators.required],
      noOfShare: [0, Validators.required],
    });
  }

  loadShares(): void {
    this.loading = true;

    this.shareService.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.shares = data.content;
        this.total = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load shares');
        this.loading = false;
      }
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
      this.shareForm.reset({
        totalSaving: 0,
        noOfShare: 0
      });
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
 console.log("this is share forms ...",formValue)
    const request = this.isEditMode && this.currentId
      ? this.shareService.update(this.currentId, formValue)
      : this.shareService.create(formValue);

    request.subscribe({
      next: (response) => {
        this.message.success(this.isEditMode ? "Share updated" : "Share created");
        this.drawerVisible = false;
        this.loadShares();
      },
      error: (err) => {
        this.message.error(err.error?.message || "Operation failed");
        this.drawerVisible = false;
      }
    });
  }

  deleteShare(id: number): void {
    this.shareService.delete(id).subscribe({
      next: () => {
        this.message.success('Share deleted');
        this.loadShares();
      },
      error: () => {
        this.message.error('Delete failed');
      }
    });
  }
}


