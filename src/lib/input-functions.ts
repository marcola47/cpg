/////////////////////////////////////////////////////////////////////////////////////////////////
/** Validators **/
type AddressProps = {
  uf: string,
  city: string,
  neighborhood: string,
  street: string,
  streetNumber: string,
  complement: string
}

export function validateAddress(address: AddressProps): string | number {
  return 0;
}

type PersonalDataProps = {
  name?: string,
  email?: string,
  password?: string,
  cpf?: string,
  phone?: string
}

export function validatePersonalData(personalData: PersonalDataProps): string | number {
  return 0;
}

type CardDataProps = {
  number: string,
  name: string,
  date: string,
  cvv: string,
  appId?: string
}

export async function validateCardData(cardData: CardDataProps): Promise<string | number> {
  try {
    if (!cardData.appId)
      return ("Algumas chaves de APIs estão faltando.")
    
    const res = await fetch(`https://api.pagar.me/core/v5/tokens?appId=${cardData.appId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        type: 'card',
        card: {
          number: cardData.number.replace(/\D/g, ""),
          holder_name: cardData.name,
          exp_month: cardData.date.split("/")[0],
          exp_year: cardData.date.split("/")[1],
          cvv: cardData.cvv
        }
      })
    })
  
    const { id } = await res.json();
  
    if (!id)
      return("Dados do cartão inválidos. Por favor, verifique os dados e tente novamente.");
    
    return 0;
  }

  catch (error: any) {
    console.log(error.message)

    if (error.message === "Failed to fetch")
      return "Ocorreu um erro ao realizar a verificação do cartão. Caso tenha um VPN ativo, tente desativar ou mudar sua rede de internet.";

    return error.message;
  }
}

export function validateCNPJ(value: string): boolean {
  let cnpj = value.replace(/[^\d]+/g, ''); 
  let a: number[] = [];
  let b: number = 0;
  const c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4 , 3, 2];

  for (let i = 0; i < 12; i++) {
    a[i] = parseInt(cnpj.charAt(i));
    b += a[i] * c[i + 1];
  }
  
  let x: number;
  if ((x = b % 11) < 2) 
    a[12] = 0;
  else  
    a[12] = 11 - x;
  
  b = 0;

  for (let y = 0; y < 13; y++)
    b += (a[y] * c[y]);
  
  if ((x = b % 11) < 2)
    a[13] = 0;
  else 
    a[13] = 11 - x;

  if ((parseInt(cnpj.charAt(12)) !== a[12]) || (parseInt(cnpj.charAt(13)) !== a[13]))
    return false;
  
  return true
}

export function validateCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  let sum = 0, remainder;
  
  for (let i = 1; i <= 9; i++) 
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);

  remainder = (sum * 10) % 11;

  if ((remainder == 10) || (remainder == 11))  
    remainder = 0;
  
  if (remainder != parseInt(cpf.substring(9, 10))) 
    return false;

  sum = 0;
  
  for (let i = 1; i <= 10; i++) 
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);

  remainder = (sum * 10) % 11;

  if ((remainder == 10) || (remainder == 11))  
    remainder = 0;
  
  if (remainder != parseInt(cpf.substring(10, 11))) 
    return false;
  
  return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/** Formatters **/
export function formatCNPJ(value: string) {
  let cnpj = value.replace(/\D/g, "");

  if (cnpj.length > 12)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, "$1.$2.$3/$4-$5");

  else if (cnpj.length > 8)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4}).*/, "$1.$2.$3/$4");

  else if (cnpj.length > 5)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  
  else
    cnpj = cnpj.replace(/^(\d{2})(\d{1,3})/, "$1.$2");

  return cnpj;
}

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

export function formatNumberOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatURI(value: string) {
  return value.replace(/[^a-z0-9/-]/g, "");
}

export function formatCurrency(value: string | number) {  
  if (value === "" || Number.isNaN(value) || value === undefined || value === null) 
    return "0,00";
  
  let negative = false;

  if (typeof value === "number" && value < 0)
    negative = true;

  value = String(value);
  value = parseInt(value.replace(/[\D]+/g,''));

  if (value > 2147483647)
    value = 2147483647
  
  value = value + '';
  value = value.replace(/([0-9]{2})$/g, "$1");

  if (value.length === 11) 
    value = value.slice(0, -1).replace(/([0-9]{3})([0-9]{3})([0-9]{2}$)/g, ".$1.$2,$3")

  else if (value.length >= 9) 
    value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{2}$)/g, ".$1.$2,$3")

  else if (value.length >= 6) 
    value = value.replace(/([0-9]{3})([0-9]{2}$)/g, ".$1,$2");

  else if (value.length === 5)
    value = value.replace(/([0-9]{3})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 4)
    value = value.replace(/([0-9]{2})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 3)
    value = value.replace(/([0-9]{1})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 2)
    value = value.replace(/([0-9]{2})$/g, "0,$1");

  else if (value.length === 1)
    value = value.replace(/([0-9]{1})$/g, "0,0$1");

  else if (value.length <= 0)
    return "0,00";

  return negative ? `-${value}` : value;
}

export function formatCEP(value: string): string {
  let cep = value.replace(/\D/g, "");
  
  if (cep.length > 5)
    cep = cep.replace(/(\d{5})(\d{1,3}).*/, "$1-$2");
  
  else
    cep = cep.replace(/(\d{1,5})/g, '$1');
  
  return cep;
}

export function formatUF(value: string): string {
  return value.slice(0, 2).replace(/[^a-zA-Z]/g, '').toUpperCase();
}

export function formatPhone(value: string): string {
  let phone = value.replace(/\D/g, "");
  phone = phone.replace(/^0/, "");
  
  if (phone.length > 10) 
    phone = phone.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  
  else if (phone.length > 5) 
    phone = phone.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  
  else if (phone.length > 2) 
    phone = phone.replace(/^(\d\d)(\d{0,5})/, "($1) $2");

  else 
    phone = phone.replace(/^(\d*)/, "$1");
  
  return phone;
}

export function formatDate(value: string): string {
  function isValidDay(day: number, month: number, year: number): boolean {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0))
      daysInMonth[1] = 29;

    return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
  }

  let date = value.replace(/\D/g, "");

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

export function formatDateTime(value: Date | string | number | null, allowNull?: boolean) {
  if (!value) {
    if (allowNull)
      return null;

    return "Data inválida"
  } 

  else {
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
}

export function formatCardNumber(value: string): string {
  let card = value.replace(/\D/g, "");

  if (card.length > 12)
    card = card.replace(/(\d{4})(\d{1,4})(\d{1,4})(\d{1,4}).*/, "$1 $2 $3 $4");

  else if (card.length > 8)
    card = card.replace(/(\d{4})(\d{1,4})(\d{1,4}).*/, "$1 $2 $3");

  else if (card.length > 4)
    card = card.replace(/(\d{4})(\d{1,4}).*/, "$1 $2");

  return card;
}

export function formatCardDate(value: string): string {
  return value
    .replace(/[^0-9]/g, '')
    .replace(/^([2-9])$/g, '0$1')
    .replace(/^(1{1})([3-9]{1})$/g, '0$1/$2')
    .replace(/^0{1,}/g, '0')
    .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2');
}