import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { SavingService } from '../../service/saving-service';
import { SavingAndLoanRepayment } from '../model/saving';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-saving-crud-componenets',
  imports: [
    NzTableModule, NzSwitchModule ,
    CommonModule ,
    NzModalModule ,
    NzInputModule ,
    NzButtonModule,
    ReactiveFormsModule  ,
    NzUploadModule,
    NzProgressModule ,
    NzDividerModule ,
  ],
  templateUrl: './saving-crud-componenets.html',
  styleUrl: './saving-crud-componenets.css',
})
export class SavingCrudComponenets  extends BaseComponent<SavingAndLoanRepayment> implements OnInit {
saving:SavingAndLoanRepayment[]=[];
  searchControl=new FormControl('search');
  constructor( private  savingService:SavingService ,
    modal:NzModalService,
     @Inject(NZ_MODAL_DATA) protected id:any 
  ) { 
    super(savingService,modal);
  }
  ngOnInit(): void {
   this.loadSavings();
  }




  loadSavings(){
    this.savingService.getsavingByEmployeeId(this.id.id,this.pageIndex,this.pageSize).subscribe({
      
      next:(data)=>{
        this.saving=data.content;
        this.pageIndex=data.number;
        this.total=data.totalElements;
       this.pageSize=data.size; 
        console.log("saving data loaded successfully",data)
      },
      error:(error)=>{
        console.log("failed to load saving data",error)
      }
    }); 
  }



  addNewSaving(){

  }


clear(){

}

    onPageChange($event: number) {
 this.pageIndex=$event-1;
  this.loadSavings();
}
onPageSizeChange($event: number) {

  this.pageSize=$event;
  this.loadSavings();
}



deleteAll(){
  this.savingService.deleteByEmployeeId(this.id.id).subscribe({
    next:(data)=>{
      console.log("all saving records deleted successfully",data)
      this.modal.success({  
        nzTitle: 'Success',
        nzContent: 'All saving records for employee ID '+this.id.id+' deleted successfully.' 
      });
      this.loadSavings();
    },
    error:(error)=>{
      console.log("failed to delete saving records",error)
      this.modal.error({  
        nzTitle: 'Error',
        nzContent: 'Failed to delete saving records for employee ID '+this.id.id+'. Error: '+error 
      });
        
    }
  });
}

deletebyId(id:number){
  this.savingService.delete(id).subscribe({
    next:(data)=>{
      console.log("saving record deleted successfully",data)
      this.modal.success({  
        nzTitle: 'Success',
        nzContent: 'Saving record with id '+id+' deleted successfully.' 
      });
      this.loadSavings();
    },
    error:(error)=>{
      console.log("failed to delete saving record",error)
      this.modal.error({  
        nzTitle: 'Error',
        nzContent: 'Failed to delete saving record with id '+id+'. Error: '+error 
      });   

    }
  });

}

}
