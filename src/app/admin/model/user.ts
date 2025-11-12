export interface User{
    
   id: number;
  userName: string;
  firstName :string;
  lastName:string;
  email: string;
  attribute:string;
  enable: boolean;
  reset:boolean;
  role: any[];
}
export interface RoleTypes{
 
  roleTypes:string;

}
export interface RoleTypesDto{
   id:any;
  role:any;

}
export interface Role{
   id:number ;
  roleTypes:any; 
}

export interface Roles{
  user:any;
  roleTypes:any;
}