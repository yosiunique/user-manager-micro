import { Component, NgModule } from '@angular/core';
import { User } from '../model/user';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Userservice } from '../../service/userservice';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/auth';
import { CreteUpdateUser } from '../crete-update-user/crete-update-user';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    NzTableModule ,
    NzModalModule ,
    CommonModule ,
    NzIconModule ,
    NzButtonModule ,
    NzRadioModule,  
    NzSwitchModule,
FormsModule,



  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard  extends BaseComponent<User>{

  users: User[] = [];
   isUserEnabled = true;

  onStatusChange(value: boolean,user:User): void {
     
    user.enable=value;
    this.userService.update(user.id,user).subscribe({
      next:(data)=>{
        console.log("user updated successfully",data)
      } ,
      error:(error)=>{
        console.log("failed to update user status",error)
      }
    });
    
    console.log(`User status changed to: ${value ? 'Enabled' : 'Disabled'}`);
  }

  constructor( private userService: Userservice ,
         modal:NzModalService ,private auth:Auth) {
    super(userService,modal)
  }

  ngOnInit() {
    this.loadUsers();
    const token=this.auth.getToken();
    console.log("current token is :",this.auth.getUserRoles());
   
  }

  loadUsers() {
    this.userService.getAll(this.pageIndex ,this.pageSize).subscribe({
      next:(data)=>{
        this.users=data.content;
        this.total=data.totalElements;
        this.pageSize=data.size;
        this.pageIndex=data.number;
console.log("this is the data of ....." ,data)
this.users=data.content;

      },
      error:(error)=>{
        console.log("this is the root cause" ,error)
      }    
    })
  }

  resetPassword(id: number) {
this.modal.create({
    nzContent:CreteUpdateUser,
    nzData:{
      id:id,
      status:'isReset'
    },
    nzWidth:600,
     nzStyle:{
      top: '100px',       // vertical offset from top
      left: '100px',       // horizontal offset from left
      right: 'auto',      // remove default centering if needed
      transform: 'none'
       }
   });

  }

  toggleEnable(id: number) {
  }

  deleteUser(id: number) {
    if(id!==1){
      this.modal.confirm({
        nzTitle:'Conformation',
        nzOkText:'Yes',
        nzOnOk:()=>{
 this.userService.delete(id)
  .subscribe({
    next:(data)=>{
      this.loadUsers();
     this.modal.confirm({
      nzTitle:"successfully deleted "+id,
      nzContent:data

     })

        },
          error:(error)=>{
  this.modal.error({
      nzTitle:"failed deleted "+id,
      nzContent:error

     })
    }
  })

   
 
    },
  nzCancelText:'No'
  
  
  
  });
  

  }else{
    this.modal.confirm({
      nzContent:" Admin Can't be deleted "
    })
  }
  }

  viewHistory(id: number) {
    // Open modal with user history
  }

  updateUser(id: number) {

this.modal.create({
    nzTitle:'Update User',
    nzContent:CreteUpdateUser,
    nzData:{
      id:id,
      status:'isUpdate'
    },
    nzWidth:800,
     nzStyle:{
      top: '100px',       // vertical offset from top
      left: '100px',       // horizontal offset from left
      right: 'auto',      // remove default centering if needed
      transform: 'none'
       }
   })
  this.loadUsers();
  }

  assignRole(id: number) {
    this.modal.create({
    nzTitle:'Manage Roles',
    nzContent:CreteUpdateUser,
    nzData:{
      id:id,
      status:'isRole'
    },
    nzWidth:800,
     nzStyle:{
      top: '100px',       
      left: '100px',       
      right: 'auto',     
      transform: 'none'
       }
   })
   

  }

  removeRole(id: number) {
    // Open modal to remove role
  }

  addToGroup(id: number) {
    // Open modal to add user to group
  }

  removeFromGroup(id: number) {
    // Open modal to remove user from group
  }


  logout(){
this.auth.logout();
  }


  addNewUser(){
    this.modal.create({
      nzTitle:'Create New User',
      nzContent:CreteUpdateUser,
      nzData:{
        status:'isCreate'
      },
       nzWidth:700,
       nzStyle:{
      top: '100px',       // vertical offset from top
      left: '100px',       // horizontal offset from left
      right: 'auto',      // remove default centering if needed
      transform: 'none'
       }
    })

  this.modal.afterAllClose.subscribe({
    next:()=>{
this.loadUsers();
    }
 
  });

  

}

addNewRole(){


this.modal.create({
      nzTitle:'Create New Role',
      nzContent:CreteUpdateUser,
      nzData:{
        status:'isRole'
      },
       nzWidth:700,
       nzStyle:{
      top: '100px',       // vertical offset from top
      left: '100px',       // horizontal offset from left
      right: 'auto',      // remove default centering if needed
      transform: 'none'
       }
    })

  this.modal.afterAllClose.subscribe({
    next:()=>{
this.loadUsers();
    }
 
  });


}














selectedFile?: File;
  progress = 0;
  message = '';






onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

 

  // Optional: generate sample CSV file in browser
  downloadSampleCsv(): void {
    const data = [
      ['id', 'customerName', 'loanAmount', 'paymentDate'],
      ['1', 'John Doe', '5000', '2025-01-15'],
      ['2', 'Jane Smith', '3000', '2025-02-10']
    ];

    const csvContent = data.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_repayments.csv');
    link.click();
  }



  haveRole(roleName:string){
     
 const roles=this.auth.getUserRoles().map((role:any )=>role.roleTypes.role);
 return roles.includes(roleName);
  }



  onPageChange($event: number) {
 this.pageIndex=$event-1;
  this.loadUsers();
}
onPageSizeChange($event: number) {

  this.pageSize=$event;
  this.loadUsers();

}


}
