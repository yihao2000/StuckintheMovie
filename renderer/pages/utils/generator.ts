import { queryAdvertisementAmount, queryMenuAmount, queryMovieAmount } from "../database/query";
import Employee from "../models/employee";
import { hashPassword } from "./encryptor";


function pad(num) {
    let s = num + "";
    while (s.length < 3) s = "0" + s;
    return s;
  }


export function generateEmployeeId(department: string, division: string, i: number){
  var id: string = "";
  if (division != "None") {
    id = Number(department) + Number(division) * 100 + "" + "-" + pad(i);
  } else {
    id = Number(department) + 5 * 100 + "" + "-" + pad(i);
  }
  return id;
}

export function generateEmployeePassword(employeeName: string){

    const substrings = employeeName.split(' ');

    const firstName = substrings[0]

    const password = firstName + "!";

    return hashPassword(password)
}

export async function generateMovieId(){
  var movieid
  await queryMovieAmount().then(e => {
   movieid = "MV" + "-" + e.toLocaleString().padStart(3, "0");
 
  })
  return movieid;
}

export async function generateAdvertisementId(){
  var advertisementid
  await queryAdvertisementAmount().then(e => {
   advertisementid = "AD" + "-" + e.toLocaleString().padStart(3, "0");
 
  })
  return advertisementid;
}



export async function generateMenuId(){
  var menuid
  await queryMenuAmount().then(e => {
   menuid = "FB" + "-" + e.toLocaleString().padStart(3, "0");
 
  })
  return menuid;
}
