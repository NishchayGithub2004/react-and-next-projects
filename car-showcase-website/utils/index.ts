import { CarProps, FilterProps } from "@types"; // import interfaces 'CarProps' and 'FilterProps' from typescript file in 'types' folder

// create a function 'calculateCarRent' that takes in two parameters 'city_mpg' and 'year' as numbers and returns car rent
export const calculateCarRent = (city_mpg: number, year: number) => {
    const basePricePerDay = 50; // base rental price per day in dollars
    const mileageFactor = 0.1; // additional rate per mile driven
    const ageFactor = 0.05; // additional rate per year as per vehicle age
  
    // calculate additional rate based on mileage and age
    const mileageRate = city_mpg * mileageFactor;
    const ageRate = (new Date().getFullYear() - year) * ageFactor;

    const rentalRatePerDay = basePricePerDay + mileageRate + ageRate; // calculate total rental rate per day
  
    return rentalRatePerDay.toFixed(0); // return rental rate per day rounded to nearest integer
};

// create a function 'updateSearchParams' that takes in two parameters 'type' and 'value' as strings and return new URL with updated search parameters
export const updateSearchParams = (type: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search); // get search parameters from current URL
  
    searchParams.set(type, value); // set search parameters with 'type' and 'value' given to the function

    const newPathname = `${window.location.pathname}?${searchParams.toString()}`; // create new URL with updated search parameters
  
    return newPathname; // return the new URL
};

// create a function 'generateCarImageUrl' that takes in a parameter 'type' as string and returns the new URL with removed search parameter
export const deleteSearchParams = (type: string) => {
    const newSearchParams = new URLSearchParams(window.location.search); // get search parameters from current URL

    newSearchParams.delete(type.toLocaleLowerCase()); // remove the specified search parameter from the search parameters
    
    const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`; // create new URL with specified search parameter removed

    return newPathname; // return the new URL
};

export async function fetchCars(filters: FilterProps) {
    const { manufacturer, year, model, limit, fuel } = filters;
  
    // set the required headers for the API request which are API key and API host
    const headers: HeadersInit = {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
    };
  
    // set the required headers for the API request and fetch the data from the API
    const response = await fetch(
      `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=Toyota&year=2020&model=Corolla&limit=5&fuel_type=Petrol`,
      {
        headers: headers,
      }
    );

    // parse and return the response in JSON format
    const result = await response.json();
    return result;
}

// create a function 'generateCarImageUrl' that takes car props as mandatory parameter and angle as optional parameter and returns the URL with added search parameters to get image of that URL
export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage"); // start with a root URL
  const { make, model, year } = car; // destructure 'make', 'model' and 'year' from 'car' object
  url.searchParams.append('customer', process.env.NEXT_PUBLIC_IMAGIN_API_KEY || ''); // add 'customer' search parameter with API key
  url.searchParams.append('make', make); // add 'make' search parameter with 'make' value from 'car' object
  url.searchParams.append('modelFamily', model.split(" ")[0]); // add 'modelFamily' search parameter with first word of 'model' value from 'car' object
  url.searchParams.append('zoomType', 'fullscreen'); // add'zoomType' search parameter with value 'fullscreen'
  url.searchParams.append('modelYear', `${year}`); // add'modelYear' search parameter with 'year' value from 'car' object
  url.searchParams.append('angle', `${angle}`); // add'angle' search parameter with 'angle' value from function parameter
  return `${url}`; // return the URL with added search parameters
}