import {
  addDoc,
  getDocs,
  collection,
  Timestamp,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
} from "@firebase/firestore";
import secureLocalStorage from "react-secure-storage";
import {
  Advertisement,
  Advertiser,
  Auth,
  Employee,
  EquipmentPurchase,
  EquipmentReport,
  FacilityPurchase,
  FacilityReport,
  FiringRequest,
  LoginCredential,
  Menu,
  Movie,
  Notification,
  Producer,
  PromotionEvent,
  SalaryAdjustmentRequest,
  Supplier,
} from "../additionalComponents/interfaces/interface";

import { app, database } from "../database/firebaseconfig";
import { generateEmployeePassword } from "../utils/generator";
import { hashPassword } from "../utils/encryptor";

export async function queryEmployeesAmount() {
  var counter = 0;
  const q = collection(database, "employees");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}
export async function acceptSelectedFiringRequest(
  firingRequest: FiringRequest
) {
  const docRef = doc(database, "firingrequests", firingRequest.id);
  updateDoc(docRef, {
    status: "Accepted",
  });

  const q = collection(database, "employees");

  const qEmployee = query(q, where("id", "==", firingRequest.employeeid));

  const data = await getDocs(qEmployee).then((item) => {
    item.docs.slice(0, 1).map((e) => {
      const docRef2 = doc(database, "employees", e.id);
      updateDoc(docRef2, {
        status: "Inactive",
      });
    });
  });
}

export async function queryPromotionEvents() {
  const array = [];
  const q = collection(database, "events");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
      array[i].type = "Event";
    });
  });

  const array2 = [];
  const q2 = collection(database, "promotions");

  const data2 = await getDocs(q2).then((e) => {
    e.docs.map((item, i) => {
      array2.push(item.data());
      array2[i].id = item.id;
      array2[i].type = "Promotion";
    });
  });

  return array.concat(array2);
}

export async function queryPromotionAmount() {
  var counter = 0;
  const q = collection(database, "promotions");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertPromotion(data: PromotionEvent) {
  setDoc(doc(database, "promotions", data.id), {
    name: data.name,
    description: data.description,
    releasedate: data.releasedate,
    enddate: data.enddate,
  });
}

export async function queryEventAmount() {
  var counter = 0;
  const q = collection(database, "events");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertEvent(data: PromotionEvent) {
  setDoc(doc(database, "events", data.id), {
    name: data.name,
    description: data.description,
    releasedate: data.releasedate,
    enddate: data.enddate,
  });
}

export async function rejectSelectedFiringRequest(
  firingRequest: FiringRequest
) {
  const docRef = doc(database, "firingrequests", firingRequest.id);
  updateDoc(docRef, {
    status: "Rejected",
  });
}

export async function insertProducer(data: Producer) {
  setDoc(doc(database, "producers", data.id), {
    name: data.name,
    description: data.description,
    email: data.email,
    phone: data.phone,
    address: data.address,
  });
}

export async function insertSupplier(data: Supplier) {
  setDoc(doc(database, "suppliers", data.id), {
    name: data.name,
    description: data.description,
    email: data.email,
    phone: data.phone,
    address: data.address,
  });
}

export async function insertAdvertiser(data: Advertiser) {
  setDoc(doc(database, "advertisers", data.id), {
    name: data.name,
    description: data.description,
    email: data.email,
    phone: data.phone,
    address: data.address,
  });
}

export async function queryAgeRatings() {
  const array = [];
  const q = collection(database, "ageratings");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryGenres() {
  const array = [];
  const q = collection(database, "genres");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function querySupplierMenus(id: string) {
  const array = [];
  const q = collection(database, "menus");

  const data = await getDocs(q).then((e) => {
    var counter = 0;
    e.docs.map((item) => {
      if (item.data().supplierid == id) {
        array.push(item.data());
        array[counter].id = item.id;
        counter++;
      }
    });
  });

  return array;
}

export async function queryProducerMovies(id: string) {
  const array = [];
  const q = collection(database, "movies");

  const data = await getDocs(q).then((e) => {
    var counter = 0;
    e.docs.map((item) => {
      if (item.data().producerid == id) {
        array.push(item.data());
        array[counter].id = item.id;
        counter++;
      }
    });
  });

  return array;
}

export async function queryAdvertiserAdvertisements(id: string) {
  const array = [];
  const q = collection(database, "advertisements");

  const data = await getDocs(q).then((e) => {
    var counter = 0;
    e.docs.map((item) => {
      if (item.data().advertiserid == id) {
        array.push(item.data());
        array[counter].id = item.id;
        counter++;
      }
    });
  });

  return array;
}

export async function queryMovieAmount() {
  var counter = 0;
  const q = collection(database, "movies");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryProducers() {
  const array = [];
  const q = collection(database, "producers");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function querySuppliers() {
  const array = [];
  const q = collection(database, "suppliers");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryCategories() {
  const array = [];
  const q = collection(database, "categories");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryTypes() {
  const array = [];
  const q = collection(database, "types");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryProducerAmount() {
  var counter = 0;
  const q = collection(database, "producers");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function querySupplierAmount() {
  var counter = 0;
  const q = collection(database, "suppliers");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryAdvertiserAmount() {
  var counter = 0;
  const q = collection(database, "advertisers");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryMenuAmount() {
  var counter = 0;
  const q = collection(database, "menus");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertNewEmployee(data: Employee) {
  const coll_employees = collection(database, "employees");
  addDoc(coll_employees, {
    id: data.id,
    name: data.name,
    dob: data.dob,
    address: data.address,
    email: data.email,
    password: generateEmployeePassword(data.name),
    phone: data.phone,
    salary: data.salary,
    department: data.department,
    division: data.division,
    status: "Active",
  });
}

export async function queryWarningLetters() {
  const array = [];
  const q = collection(database, "warningletters");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryMembers() {
  var array = [];

  const q = collection(database, "members");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryEquipmentReportAmount() {
  var counter = 0;
  const q = collection(database, "equipmentreports");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryAdvertisementAmount() {
  var counter = 0;
  const q = collection(database, "advertisements");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityReportAmount() {
  var counter = 0;
  const q = collection(database, "facilityreports");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertEquipmentReport(detail: EquipmentReport) {
  setDoc(doc(database, "equipmentreports", detail.id), {
    equipmentid: detail.equipmentid,
    employeeid: detail.employeeid,
    message: detail.message,
    status: detail.status,
    date: detail.date,
  });

  const docRef = doc(database, "equipments", detail.equipmentid);
  updateDoc(docRef, {
    damagestatus: "Damaged",
  });
}

export async function queryEquipmentRepairAmount() {
  var counter = 0;
  const q = collection(database, "equipmentrepair");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityRepairAmount() {
  var counter = 0;
  const q = collection(database, "facilityRepair");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function confirmReportRepairment(selectedReport) {
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  var repairmentType = "";
  if (selectedReport.type == "Facility") {
    updateDoc(doc(database, "facilityreports", selectedReport.id), {
      status: "Reviewed",
    });

    queryFacilityRepairAmount().then((e) => {
      var id = "FF-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "facilityrepair", id), {
        date: new Date().toDateString(),
        equipmentid: selectedReport.itemid,
        reporterid: selectedReport.employeeid,
        responderid: auth.id,
        status: "Pending",
      });
    });

    repairmentType = "Facility Repairment";
  } else if (selectedReport.type == "Equipment") {
    updateDoc(doc(database, "equipmentreports", selectedReport.id), {
      status: "Reviewed",
    });
    queryEquipmentRepairAmount().then((e) => {
      var id = "EF-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "equipmentrepair", id), {
        date: new Date().toDateString(),
        equipmentid: selectedReport.itemid,
        reporterid: selectedReport.employeeid,
        responderid: auth.id,
        status: "Pending",
      });
    });

    repairmentType = "Equipment Repairment";
  }

  insertNotification(
    selectedReport.employeeid,
    repairmentType,
    "Your reported equipment/facility are able to be fixed ! We will notify you soon after the facility/equipment is fixed..."
  );

  //Insert Repairment
}

export async function queryAdvertisers() {
  const array = [];
  const q = collection(database, "advertisers");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function rejectReportRepairment(selectedReport) {
  var repairmentType = "";
  if (selectedReport.type == "Facility") {
    updateDoc(doc(database, "facilityreports", selectedReport.id), {
      status: "Reviewed",
    });
    repairmentType = "Facility Repairment";
  } else if (selectedReport.type == "Equipment") {
    updateDoc(doc(database, "equipmentreports", selectedReport.id), {
      status: "Reviewed",
    });
    repairmentType = "Equipment Repairment";
  }

  insertNotification(
    selectedReport.employeeid,
    repairmentType,
    "Your reported equipment/facility are not able to be fixed ! We will soon remove the equipment/facility from our company inventory list..."
  );
}

export async function queryNotificationAmount() {
  var counter = 0;
  const q = collection(database, "notifications");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertFacilityReport(detail: FacilityReport) {
  setDoc(doc(database, "facilityreports", detail.id), {
    facilityid: detail.facilityid,
    employeeid: detail.employeeid,
    message: detail.message,
    status: detail.status,
    date: detail.date,
  });

  setDoc(doc(database, "facilityreports", detail.id), {
    facilityid: detail.facilityid,
    employeeid: detail.employeeid,
    message: detail.message,
    status: detail.status,
  });

  const docRef = doc(database, "facilities", detail.facilityid);
  updateDoc(docRef, {
    damagestatus: "Damaged",
  });
}

export async function queryEquipmentReports() {
  var array = [];

  const q = collection(database, "equipmentreports");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryEquipmentRepairs() {
  var array = [];

  const q = collection(database, "equipmentrepair");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryFacilityRepairs() {
  var array = [];

  const q = collection(database, "facilityrepair");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryFacilityReports() {
  var array = [];

  const q = collection(database, "facilityreports");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryEquipments() {
  var array = [];

  const q = collection(database, "equipments");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function acceptLeaveRequest(requestid: string) {
  console.log(requestid);
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Accepted",
  });
}

export async function rejectLeaveRequest(requestid: string) {
  console.log(requestid);
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Rejected",
  });
}

export async function declineLeaveRequest(requestid: string) {
  const docRef = doc(database, "personalleaverequests", requestid);
  updateDoc(docRef, {
    status: "Declined",
  });
}

export async function queryFacilities() {
  var array = [];

  const q = collection(database, "facilities");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item, i) => {
      array.push(item.data());
      array[i].id = item.id;
    });
  });

  return array;
}

export async function queryWorkingTime() {
  var array = [];

  const q = collection(database, "workingtime");

  const data = await getDocs(q).then((e) => {
    e.docs.map((item) => {
      array.push(item.data());
    });
  });

  return array;
}

export async function queryEmployeeWorkingTime(employeeid: string) {
  var array = [];

  const compare = (a, b) => {
    if (parseInt(a.workingtimeid) < parseInt(b.workingtimeid)) {
      return -1;
    }
    if (parseInt(a.workingtimeid) > parseInt(b.workingtimeid)) {
      return 1;
    }
    return 0;
  };
  const q = collection(database, "workingtimedetail");

  const qWorkingTimeDetail = query(q, where("employeeid", "==", employeeid));

  const data = await getDocs(qWorkingTimeDetail).then((e) => {
    e.docs.map((item) => {
      array.push({ ...item.data() });
    });
  });

  array.sort(compare);

  return array;
}

export async function queryAllSalaryAdjustmentRequests() {
  var array = [];
  const q = collection(database, "salaryadjustmentrequests");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function acceptSelectedSalaryAdjustment(id: string) {
  setDoc(
    doc(database, "salaryadjustmentrequests", id),
    {
      status: "Accepted",
    },
    { merge: true }
  );
}

export async function rejectSelectedSalaryAdjustment(id: string) {
  setDoc(
    doc(database, "salaryadjustmentrequests", id),
    {
      status: "Rejected",
    },
    { merge: true }
  );
}

export async function queryEmployeeSalary(id: string) {
  var array = [];
  const q = collection(database, "employees");

  const qEmployees = query(q, where("id", "==", id));

  const data = await getDocs(qEmployees).then((item) => {
    item.docs.map((e) => {
      array.push(e.data());
    });
  });

  return array;
}

export async function insertEmployeeSalaryAdjustmentRequest(
  employeeList: Array<SalaryAdjustmentRequest>
) {
  var auth = secureLocalStorage.getItem("credentials") as LoginCredential;
  const q = collection(database, "salaryadjustmentrequests");

  employeeList.map(async (e) => {
    var isExist = false;
    var selectedEmployee;
    const qAdjustmentRequests = query(q, where("employeeid", "==", e.id));

    const data = await getDocs(qAdjustmentRequests).then((item) => {
      item.docs.map((a) => {
        if (a.data().employeeid === e.id && a.data().status == "Pending") {
          isExist = true;
          selectedEmployee = item.docs[0].id;
        }
      });
    });
    var salary = Number(e.salaryChange);
    console.log(salary);
    if (isExist) {
      console.log("Exist");
      console.log(selectedEmployee);
      const docRef = doc(
        database,
        "salaryadjustmentrequests",
        selectedEmployee
      );

      updateDoc(docRef, {
        salaryadjustment: salary,
        requestdate: new Date().toLocaleString(),
      });
    } else {
      console.log(salary);

      setDoc(doc(database, "salaryadjustmentrequests", "SA-" + e.id), {
        requesterid: auth.id,
        employeeid: e.id,
        requestdate: new Date().toLocaleString(),
        salaryadjustment: salary,
        status: "Pending",
        adjusted: "false",
      });
    }
  });
}

export async function queryAllFiringRequests() {
  var array = [];

  const q = collection(database, "firingrequests");
  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function insertFundRequest(
  requestAmount: number,
  requestReason: string
) {
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  console.log("Inserting");
  queryEmployeeFundRequestAmount(auth.id).then((e) => {
    console.log(e);
    setDoc(doc(database, "fundrequests", auth.id + "-1-" + e), {
      date: new Date().toLocaleString(),
      amount: requestAmount,
      reason: requestReason,
      anfstatus: "Pending",
      managerstatus: "Pending",
      requesterid: auth.id,
    });
  });
}

export async function insertPersonalLeave(
  leaveReason: string,
  leaveDate: Date
) {
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  const q = collection(database, "personalleaverequests");

  const qPersonalLeave = query(q, where("employeeid", "==", auth.id));

  var alreadyExist = false;
  const data = await getDocs(qPersonalLeave).then((item) => {
    item.docs.map((e) => {
      if (leaveDate.toDateString() == e.data().personalleavedate) {
        alreadyExist = true;
      }
    });
  });

  if (alreadyExist) {
    return true;
  }

  queryEmployeePersonalLeaveRequestAmount(auth.id).then((e) => {
    setDoc(doc(database, "personalleaverequests", auth.id + "-2-" + e), {
      employeeid: auth.id,
      personalleavedate: leaveDate.toDateString(),
      personalleavereason: leaveReason,
      status: "Pending",
    });
  });

  return false;
}

export async function queryEmployeePersonalLeave(employeeid: string) {
  var array = [];
  const q = collection(database, "personalleaverequests");

  const qFundRequests = query(q, where("employeeid", "==", employeeid));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  array.reverse();
  return array;
}

export async function queryEmployeePersonalLeaveRequestAmount(
  employeeId: string
) {
  var counter = 0;
  const q = collection(database, "personalleaverequests");

  const qEmployeePersonalLeaveRequest = query(
    q,
    where("employeeid", "==", employeeId)
  );

  const data = await getDocs(qEmployeePersonalLeaveRequest).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

interface InventoryTransaction {
  inventoryname: string;
  inventorydescription: string;
  inventoryprice: number;
  inventoryquantity: number;
  inventorytype: string;
  fundrequestid: string;
  transactiondate: string;
}

export async function queryEquipmentPurchaseAmount() {
  var counter = 0;
  const q = collection(database, "equipmentpurchase");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityPurchasePriceTotal() {
  var totalPrice = 0;
  const q = collection(database, "facilitypurchase");

  await getDocs(q).then(async (item) => {
    const promises = item.docs.map(async (e) => {
      console.log(e.data().facilityid);
      const data2 = await querySpecificFacility(e.data().facilityid);
      return e.data().quantity * data2.price;
    });

    var prices = await Promise.all(promises);

    prices.map((e) => {
      totalPrice += e;
    });
  });

  return totalPrice;
}

export async function querySpecificFacility(facilityid: string) {
  var facilityData;
  var data = await getDoc(doc(database, "facilities", facilityid)).then((e) => {
    facilityData = e.data();
  });

  return facilityData;
}

export async function queryEquipmentPurchasePriceTotal() {
  var totalPrice = 0;
  const q = collection(database, "equipmentpurchase");

  await getDocs(q).then(async (item) => {
    const promises = item.docs.map(async (e) => {
      const data2 = await querySpecificEquipment(e.data().equipmentid);
      return e.data().quantity * data2.price;
    });

    var prices = await Promise.all(promises);
    prices.map((e) => {
      totalPrice += e;
    });
  });

  return totalPrice;
}

export async function querySpecificEquipment(equipmentid: string) {
  var equipmentData;
  var data = await getDoc(doc(database, "equipments", equipmentid)).then(
    (e) => {
      equipmentData = e.data();
    }
  );

  return equipmentData;
}

export async function resetEmployeePassword(employee) {
  console.log(employee);
  var array = [];
  const q = collection(database, "employees");

  const qEmployee = query(q, where("id", "==", employee.id));
  var docId;
  const data = await getDocs(qEmployee).then((item) => {
    item.docs.slice(0, 1).map((e) => {
      item.docs.map((x) => {
        docId = x.id;
      });
      array.push(e.data());
    });
  });

  var number = Math.floor(Math.random() * 3);

  var newPassword;

  if (number == 0) {
    newPassword = employee.name.split(" ")[0] + "!";
  } else if (number == 1) {
    newPassword = [...employee.id].reverse().join("") + "!";
  } else if (number == 2) {
    newPassword = employee.id + "!";
  }

  console.log(docId);
  const docRef = doc(database, "employees", docId);

  updateDoc(docRef, {
    password: hashPassword(newPassword),
  });

  return newPassword;
}

export async function querySpecificFundRequest(fundrequestid: string) {
  var fundRequestData;
  var data = await getDoc(doc(database, "fundrequests", fundrequestid)).then(
    (e) => {
      fundRequestData = e.data();
      fundRequestData.id = e.id;
    }
  );

  return fundRequestData;
}

export async function queryEquipmentAmount() {
  var counter = 0;
  const q = collection(database, "equipments");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityPurchaseAmount() {
  var counter = 0;
  const q = collection(database, "facilitypurchase");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryFacilityAmount() {
  var counter = 0;
  const q = collection(database, "facilities");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function insertMovie(data: Movie) {
  setDoc(doc(database, "movies", data.id), {
    name: data.name,
    description: data.description,
    producerid: data.producerid,
    duration: data.duration,
    genreid: data.genreid,
    ageratingid: data.ageratingid,
    startdate: data.startdate,
    enddate: data.enddate,
  });
}

export async function insertAdvertisement(data: Advertisement) {
  setDoc(doc(database, "advertisements", data.id), {
    name: data.name,
    description: data.description,
    advertiserid: data.advertiserid,
    duration: data.duration,
    ageratingid: data.ageratingid,
    startdate: data.startdate,
    enddate: data.enddate,
  });
}

export async function insertMenu(data: Menu) {
  setDoc(doc(database, "menus", data.id), {
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    supplierid: data.supplierid,
    typeid: data.typeid,
    categoryid: data.categoryid,
  });
}

export async function queryAllInventoryPurchase() {
  var array = [];
  await queryEquipmentPurchases().then(async (e) => {
    array = array.concat(e);
  });
  await queryFacilityPurchases().then((x) => {
    array = array.concat(x);
  });

  return array;
}

export async function insertInventoryPurchaseData(props: InventoryTransaction) {
  var auth = secureLocalStorage.getItem("credentials") as LoginCredential;
  if (props.inventorytype == "Equipment") {
    var equipmentid;
    queryEquipmentAmount().then((e) => {
      e++;
      equipmentid = "EQ" + "-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "equipments", equipmentid), {
        name: props.inventoryname,
        description: props.inventorydescription,
        price: props.inventoryprice,
        damagestatus: "Undamaged",
        availabilitystatus: "Available",
      });
    });
    queryEquipmentPurchaseAmount().then((e) => {
      e++;
      setDoc(
        doc(
          database,
          "equipmentpurchase",
          "PEQ" + "-" + e.toLocaleString().padStart(3, "0")
        ),
        {
          date: props.transactiondate,
          quantity: props.inventoryquantity,
          equipmentid: equipmentid,
          fundrequestid: props.fundrequestid,
          employeeid: auth.id,
        }
      );
    });
  } else if (props.inventorytype == "Facility") {
    var facilityid;
    queryFacilityAmount().then((e) => {
      e++;
      facilityid = "FA" + "-" + e.toLocaleString().padStart(3, "0");
      setDoc(doc(database, "facilities", facilityid), {
        name: props.inventoryname,
        description: props.inventorydescription,
        price: props.inventoryprice,
        damagestatus: "Undamaged",
        availabilitystatus: "Available",
      });
    });
    queryFacilityPurchaseAmount().then((e) => {
      e++;
      setDoc(
        doc(
          database,
          "facilitypurchase",
          "PFA" + "-" + e.toLocaleString().padStart(3, "0")
        ),
        {
          date: props.transactiondate,
          quantity: props.inventoryquantity,
          facilityid: facilityid,
          fundrequestid: props.fundrequestid,
          employeeid: auth.id,
        }
      );
    });
  }
}

export async function queryEquipmentPurchases() {
  var array = [];
  const q = collection(database, "equipmentpurchase");
  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function queryFacilityPurchases() {
  var array = [];
  const q2 = collection(database, "facilitypurchase");
  const data2 = await getDocs(q2).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function queryAllFundRequest() {
  var array = [];
  const q = collection(database, "fundrequests");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e, i) => {
      array.push(e.data());
      array[i].id = e.id;
    });
  });

  return array;
}

export async function confirmSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Accepted",
  });
}

export async function cancelSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Declined",
  });
}

export async function reviseSelectedFundRequestByAnf(id: string) {
  const docRef = doc(database, "fundrequests", id);

  updateDoc(docRef, {
    anfstatus: "Revised",
  });
}

export async function queryEmployeeFundRequest(employeeid: string) {
  var array = [];
  const q = collection(database, "fundrequests");

  const qFundRequests = query(q, where("requesterid", "==", employeeid));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e) => {
      array.push(e.data());
    });
  });

  return array;
}

export async function queryEmployeeFundRequestAmount(employeeId: string) {
  var counter = 0;
  const q = collection(database, "fundrequests");

  const qFundRequests = query(q, where("requesterid", "==", employeeId));

  const data = await getDocs(qFundRequests).then((item) => {
    item.docs.map((e) => {
      counter++;
    });
  });

  return counter;
}

export async function queryEmployeePendingWarningLetterAmount(
  employeeId: string
) {
  var counter = 0;
  const q = collection(database, "warningletters");

  const qWarningLetters = query(q, where("employeeid", "==", employeeId));

  const data = await getDocs(qWarningLetters).then((item) => {
    item.docs.map((e) => {
      if (e.data().status == "Pending") {
        counter++;
      }
    });
  });

  return counter;
}
export async function queryEmployeeWarningLetterAmount(employeeId: string) {
  var counter = 0;
  const q = collection(database, "warningletters");

  const qWarningLetters = query(q, where("employeeid", "==", employeeId));

  const data = await getDocs(qWarningLetters).then((item) => {
    item.docs.map((e) => {
      if (e.data().status == "Accepted") {
        counter++;
      }
    });
  });

  return counter;
}

interface WorkingTimeDetail {
  employeeid: string;
  workingtimeid: string;
}

export async function acceptSelectedWarningLetter(id: string) {
  console.log(id);

  const data = await setDoc(
    doc(database, "warningletters", id),
    {
      status: "Accepted",
    },
    { merge: true }
  ).then(async () => {
    const docRef = doc(database, "warningletters", id);

    const docSnap = await getDoc(docRef).then((e) => {
      console.log(e.data());
      queryEmployeeWarningLetterAmount(e.data().employeeid).then((x) => {
        if (x > 3) {
          insertFiringRequest(e.data().employeeid);
        }
      });
    });
  });
}

export async function rejectSelectedWarningLetter(id: string) {
  console.log(id);
  setDoc(
    doc(database, "warningletters", id),
    {
      status: "Rejected",
    },
    { merge: true }
  );
}

export async function updateEmployeeSchedule(data: Array<WorkingTimeDetail>) {
  console.log(data[0]);
  const employeeid = data[0].employeeid;

  const q = collection(database, "workingtimedetail");
  const qWorkingTimeDetail = query(q, where("employeeid", "==", employeeid));

  const result = await getDocs(qWorkingTimeDetail).then((item) => {
    item.docs.map((a) => {
      deleteDoc(doc(database, "workingtimedetail", a.id));
    });
  });

  data.map((e) => {
    console.log(e);
    addDoc(q, {
      employeeid: e.employeeid,
      workingtimeid: e.workingtimeid,
    });
  });
}

export async function insertFiringRequest(employeeId: string) {
  const q = collection(database, "firingrequest");

  const qFiringRequest = query(q, where("employeeid", "==", employeeId));

  var alreadyExist = false;
  const data = await getDocs(qFiringRequest).then((item) => {
    item.docs.map((e) => {
      if (e.data().employeeid === employeeId && e.data().status == "Pending") {
        alreadyExist = true;
      }
    });
  });

  if (alreadyExist == false) {
    const id = "FR" + employeeId;
    setDoc(doc(database, "firingrequests", id), {
      employeeid: employeeId,
      requestDate: new Date().toLocaleString(),
      status: "Pending",
    });
  }
}

export async function getNotificationCounter(employeeId: string) {
  const coll_notifications = collection(database, "notifications");

  const q = query(coll_notifications, where("employeeid", "==", employeeId));

  var generatedId;

  const data = await getDocs(q).then((e) => {
    e.docs.map((rank, i, arr) => {
      if (arr.length - 1 === i) {
        generatedId = rank.data().id + 1;
        console.log(generatedId);
      }
    });
  });
}
export async function insertNotification(
  employeeId: string,
  title: string,
  message: string
) {
  queryNotificationAmount().then((e) => {
    var id = "NO-" + e.toLocaleString().padStart(3, "0");
    setDoc(doc(database, "notifications", id), {
      employeeid: employeeId,
      isRead: false,
      message: message,
      title: title,
      createdAt: new Date().toDateString(),
    });
  });
}

export async function insertWarningLetter(
  passedEmployeeId: string,
  warningDescription: string
) {
  const coll_warningletters = collection(database, "warningletters");

  const counter = await queryEmployeePendingWarningLetterAmount(
    passedEmployeeId
  );

  if (counter > 3) {
    return false;
  } else {
    console.log(counter);
    const id = "WL-" + passedEmployeeId + "-" + counter;

    setDoc(doc(database, "warningletters", id), {
      date: new Date().toDateString(),
      status: "Pending",
      employeeid: passedEmployeeId,
      description: warningDescription,
    });

    return true;
  }
}

export async function queryEmployees() {
  var array = [];
  const q = collection(database, "employees");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}

export async function updateAdjustmentRequestAdjustedStatus(adjustmentId) {
  const docRef = doc(database, "salaryadjustmentrequests", adjustmentId);
  updateDoc(docRef, {
    adjusted: "true",
  });
}

export async function adjustEmployeeSalary(employeeId, newSalary) {
  var id;
  const q = collection(database, "employees");

  const qEmployee = query(q, where("id", "==", employeeId));

  const data = await getDocs(qEmployee).then((item) => {
    item.docs.slice(0, 1).map((e) => {
      id = e.id;
    });
  });

  const docRef = doc(database, "employees", id);
  updateDoc(docRef, {
    salary: newSalary,
  });
}

export async function querySpecificEmployee(employeeId) {
  var array = [];
  const q = collection(database, "employees");

  const qEmployee = query(q, where("id", "==", employeeId));

  const data = await getDocs(qEmployee).then((item) => {
    item.docs.slice(0, 1).map((e) => {
      array.push(e.data());
    });
  });

  return array[0] as Employee;
}
export async function queryDivisions() {
  var array = [];

  const q = collection(database, "divisions");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}

export async function queryDepartments() {
  var array = [];

  const q = collection(database, "departments");

  const data = await getDocs(q).then((item) => {
    item.docs.map((e) => {
      array.push({ ...e.data() });
    });
  });

  return array;
}
