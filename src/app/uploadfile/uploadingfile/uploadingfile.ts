import { Component, inject } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SavingService } from '../../service/saving-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-uploadingfile',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule ,
    NzInputModule , 
    NzButtonModule,
    NzDatePickerModule,
    FormsModule
  ],
  templateUrl: './uploadingfile.html',
  styleUrls: ['./uploadingfile.css'],
})
export class Uploadingfile {
  private modal = inject(NzModalService);
  private savingService = inject(SavingService);
  private msg = inject(NzMessageService);
  private loanRepaymentService = inject(LoanRepaymentService);
  private modalRef = inject(NzModalRef);
  protected data: any = inject(NZ_MODAL_DATA);
  
  selectedFile: File | null = null;
  uploading: boolean = false;
  metadataList: any;
  forMonth: Date | null = null;


  // Handle file selection from input
  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  // For template compatibility
  handleChange(event: Event): void {
    this.handleFileSelect(event);
  }

  // For template compatibility
  handleChangeLoan(event: Event): void {
    this.handleFileSelect(event);
  }

  // Handle successful file upload
  private handleUploadSuccess(res: any): void {
    this.msg.success('File uploaded successfully');
    this.metadataList = Array.isArray(res) ? res : res?.metadata;
    this.selectedFile = null;
    this.forMonth = null; // Reset the date after successful upload
    this.modalRef.close(true);
  }

  // Handle upload errors
  private handleUploadError(err: any): void {
    console.error('Upload error', err);
    this.modal.error({
      nzTitle: 'Error',
      nzContent: err.error?.message || 'Failed to upload file',
    });
  }

  // Upload file for savings
  uploadFile(): void {
    if (!this.selectedFile) {
      this.msg.error('Please select a file');
      return;
    }

    this.uploading = true;
    this.savingService.importCsv(this.selectedFile, new Date()) // Using current date for savings as fallback
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }

  // Upload file for loan repayments
  uploadFileLoan(): void {
    if (!this.selectedFile) {
      this.msg.error('Please select a file');
      return;
    }
    
    if (!this.forMonth) {
      this.msg.error('Please select a month');
      return;
    }

    this.uploading = true;
    this.loanRepaymentService.importCsv(this.selectedFile, this.forMonth)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: any) => this.handleUploadSuccess(res),
        error: (err: any) => this.handleUploadError(err)
      });
  }







  // Removed unused method

  reloadPage(): void {
    this.modalRef.close(true);
  }


}
