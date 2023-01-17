export interface FundRequest {
    fundrequestid: string;
    reason: string;
    requesterid: string;
    anfstatus: string;
    managerstatus: string;
    amount: number;
    date: string;
    status: string;
  }


  export interface InventoryReport{
    id: string;
    itemid: string
    type: string
    employeeid: string
    message: string
    status: string
    date: string
  }

  export interface FacilityReport{
    id: string;
    facilityid: string
    employeeid: string
    message: string
    status: string
    date: string
  }

  export interface EquipmentReport{
    id: string;
    equipmentid: string
    employeeid: string
    message: string
    status: string
    date: string
  }

  export interface Inventory {
    id: string;
    name: string;
    type: string;
    description: string;
    damagestatus: string;
    price: number;
    availabilitystatus: string;
  }

export interface  LoginCredential {
    id: string;
    department: string;
  }
export interface WarningLetter {
    id: string;
    date: string;
    description: string;
    employeeid: string;
    status: string;
  }

  export interface SalaryAdjustmentRequest {
    id: string;
    employeeid: string;
    requestdate: string;
    requesterid: string;
    salaryadjustment: number;
    status: string;
    salary: number;
    employeename: string;
    adjusted: string;
  }

  export interface PromotionEvent{
    id: string;
    name: string;
    description: string;
    type: string
    releasedate: string
    enddate: string
  }

  export interface Genre{
    id: string;
    name: string;
  }

  export interface Category{
    id: string;
    name: string;
  }

  export interface Type{
    id: string
    name: string
  }

  export interface Supplier{
    id:string
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string
  }

  export interface Advertiser{
    id:string
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string
  }

  export interface Menu{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    supplierid: string;
    typeid: string
    categoryid: string
  }

  export interface InventoryRepair{
    id: string;
    date: string;
    itemid: string;
    type: string;
    reporterid: string;
    responderid: string;
    status: string;
  }

  export interface Movie{
    id: string;
    producerid: string;
    name: string;
    description: string;
    duration: number;
    genreid: string;
    ageratingid: string;
    startdate: string;
    enddate: string;
  }

  export interface Advertisement{
    id: string;
    advertiserid: string;
    name: string;
    description: string;
    duration: number;
    ageratingid: string;
    startdate: string;
    enddate: string;
  }

  export interface AgeRating{
    id: string;
    agerating: string;
  }


  export interface Producer{
    id: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string
    
  }

  export interface Member{
    id: string
    name: string
    dob: Date
    email: string
    phone: string
    points: number
  }

  export interface InventoryPurchase{
    id: string;
    date: string;
    employeeid: string;
    itemid: string;
    type: string;
    fundrequestid: string;
    quantity: number;
  }

  export interface EquipmentPurchase{
    id: string;
    date: string;
    employeeid: string;
    equipmentid: string;
    type: string;
    fundrequestid: string;
    quantity: number;
  }

  export interface FacilityPurchase{
    id: string;
    date: string;
    employeeid: string;
    facilityid: string;
    type: string;
    fundrequestid: string;
    quantity: number;
  }


  export interface Employee{
    id: string;
    department: string;
    address: string;
    division: string;
    dob: Date;
    email: string;
    name: string;
    phone: string;
    salary: number;
    status: string;
  }

  export interface Refresh{
    refreshComponent: Function;
    refresh: boolean
  }

  export interface FiringRequest{
    id: string;
    requestdate: string;
    status: string;
    employeeid: string;
    employeename: string;
    employeedepartment: string;
    employeedivision: string;
  }

  export interface Department{
    id: string;
    name: string;
  }

  export interface Division{
    id: string;
    name: string;
  }

  export interface Auth {
    id: string;
    firsName: string;
    lastName: string;
    department: string;
    division: string;
  }


  export interface Notification {
    id: string
    employeeid: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
  }

  export interface SalaryAdjustmentRequest {
    id: string;
    salaryChange: number;
  }