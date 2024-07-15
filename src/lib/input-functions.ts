/////////////////////////////////////////////////////////////////////////////////////////////////
/** Formatters **/
export function formatCPF(value: string) : string {
  let cpf = value.replace(/\D/g, "");
  
  if (cpf.length > 9)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  
  else if (cpf.length > 6)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
  
  else
    cpf = cpf.replace(/(\d{3})(\d{1,3})/g, '$1.$2');
  
  return cpf;
}

export function formatDate(value: string | Date): string {
  function isValidDay(day: number, month: number, year: number): boolean {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0))
      daysInMonth[1] = 29;

    return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
  }


  let date = value.toString().replace(/\D/g, "");

  let day = date.substring(0, 2);
  let month = date.substring(2, 4);
  let year = date.substring(4, 8);

  const newDate = new Date();
  const curYear = newDate.getFullYear()

  if (day.length === 2 && (parseInt(day) < 1 || parseInt(day) > 31))
    day = "31";

  if (month.length === 2 && (parseInt(month) < 1 || parseInt(month) > 12))
    month = "12";

  if (year.length === 4 &&(parseInt(year) < 1 || parseInt(year) > curYear))
    year = curYear.toString();

  if (day.length === 2 && month.length === 2 && year.length === 4) {
    if (!isValidDay(parseInt(day), parseInt(month), parseInt(year))) {
      day = "01";
    }
  }

  if (date.length > 4) 
    date = `${day}/${month}/${year}`;
  
  else if (date.length > 2) 
    date = `${day}/${month}`;
  
  else 
    date = day;
  
  return date;
}

export function formatDateTime(value: Date | string) {
  const date = new Date(value);

  const options: any = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  
  return date.toLocaleString('pt-BR', options).replace(',', '');
}