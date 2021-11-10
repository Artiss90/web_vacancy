import style from './ViewRegistration.module.scss';
import { styleNames } from 'utils/style-names';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import axios from 'axios';

const sn = styleNames(style);

const ROLE = {
    employer: '3',
    applicant: '4'
}

export default function ViewRegistration  () {
    const search = createBrowserHistory().location.search; // * текущий параметр строки браузера
    const parsedSearch = queryString.parse(search); // * массив параметров строки браузера
    const role = parsedSearch['role'];
    const phone = parsedSearch['phone'] || '';
    
    //* хедеры по-умолчанию
    const memoizedHeader = useMemo(() => { 
            const headers = {
            'X-Requested-With': 'XMLHttpRequest'
        }
    return headers}, []);
    
    axios.defaults.headers = memoizedHeader // хедеры по умолчанию для всех запросов

    const [sliderValueSalary, setSliderValueSalary] = useState(1500);
    const [valueName, setValueName] = useState('')
    const [valueCompanyName, setValueCompanyName] = useState('')
    const [categoriesJobs, setCategoriesJobs] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredVacancy, setFilteredVacancy] = useState([]);
    const [valueCategoryJob, setValueCategoryJob] = useState([]);
    const [valueLocation, setValueLocation] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState([]);

//* отфильтровывание выбранных стран
useEffect(() => {
   if(locations.length>0){
    setFilteredLocations(locations)
   }
}, [locations]);
useEffect(() => {
    if(locations.length>0){
        setFilteredLocations(locations.filter(item=> !selectedCountry.includes(item.name)))
    }
}, [locations, selectedCountry])

//* отфильтровывание выбранных вакансий
useEffect(() => {
   if(categoriesJobs.length>0){
    setFilteredVacancy(categoriesJobs)
   }
}, [categoriesJobs]);
useEffect(() => {
    if(categoriesJobs.length>0){
        setFilteredVacancy(categoriesJobs.filter(item=> !selectedVacancy.includes(item.name)))
    }
}, [categoriesJobs, selectedVacancy])

//* запрос на получение списка параметров
useEffect(() => {
    const getDataAllParams = () => axios.get('https://api.witam.work/api-witam.pl.ua/site/public/api/allParams').then(resolve => {
        const allParams = resolve.data
        const findCategoriesData = allParams.find( item =>item.original.message === "Список категорий успешно получен")
        const findLocationsData = allParams.find( item =>item.original.message === "Список локализаций успешно получен")
        if (findCategoriesData){
         const categories = Object.values(findCategoriesData?.original?.data?.categories)
         setCategoriesJobs(categories)
        }
        if (findLocationsData){
         const allLocations = Object.values(findLocationsData?.original?.data?.locations)
         setLocations(allLocations)
        }
    }, reject => {
        console.error(reject)})
        getDataAllParams()
}, [])

//* изменение имени
const handleChangeName = (e) => {
    setValueName(e.target.value);
  };
//* изменение имени компании
const handleChangeNameCompany = (e) => {
    setValueCompanyName(e.target.value);
  };
//* изменение ползунка
const changeSliderValueSalary = (e) => {
    e.preventDefault()
    setSliderValueSalary(e.target.value)
}
//* изменение категории роботы
const handleChangeCategoryJob = (e) => {
    //* нахождение вакансии по id 
    const getNameVacancy = (idVacancy) => {
        const fondedVacancy = categoriesJobs.find( item=> item.id === idVacancy)
        setSelectedVacancy([...selectedVacancy, fondedVacancy?.name])
       }
    
    setValueCategoryJob([...valueCategoryJob, Number(e.target.value)]);
    getNameVacancy(Number(e.target.value));
  };
//* изменение локации
const handleChangeLocation = (e) => {
    //* нахождение страны по id 
    const getNameCountry = (idCountry) => {
    const fondedCountry = locations.find( item=> item.id === idCountry)
    setSelectedCountry([...selectedCountry, fondedCountry?.name])
   }

    setValueLocation([...valueLocation,Number(e.target.value)]);
    getNameCountry(Number(e.target.value));

  };

//* отправка формы  
const handleSubmitRegister = (e) => {
    e.preventDefault();
    //     let body = {
    //         user_type_id: role,
    //         name: valueName,
    //         company_name: valueCompanyName,
    //         location_id: valueLocation,
    //         category_id: valueCategoryJob,
    //         phone_number: phone,
    //         salary: sliderValueSalary
    //   }
    const body = {}
    body.user_type_id = role;
    if(phone){
        body.phone_number = phone
    }
    //* register for employer
    if(role === ROLE.employer){
        if(valueCompanyName){
            body.company_name = valueCompanyName
        }
        body.name = valueName
        console.log(body);
        //! POST
        return
    }
    //* register for applicant
    if(role === ROLE.applicant){
        body.name = valueName
        body.location_id = valueLocation
        body.category_id = valueCategoryJob
        body.salary = sliderValueSalary
        console.log(body);
        //!POST
        return
}
}

    return (<div className={style.mainContainer}>
        {role === ROLE.applicant && <form className={style.form} onSubmit={handleSubmitRegister}>
        <label className={style.formLabel}>
            Имя
          <input
            name="name"
            required
            type="text"
            value={valueName}
            onChange={handleChangeName}
          />
        </label>

        <label className={style.formLabel}>
        Категории работы
        <p>Выбранные категории: {selectedVacancy.join(', ')}</p>
          <select
            value={valueCategoryJob}
            onChange={handleChangeCategoryJob}
          >
               <option value=''>
                выберите вакансии из списка
              </option>
            {filteredVacancy.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className={style.formLabel}>
        Локация 
        <p>Выбранные страны: {selectedCountry.join(', ')}</p>
          <select
            value={valueLocation}
            onChange={handleChangeLocation}
          >
              <option value=''>
                выберите странны из списка
              </option>
            {filteredLocations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className={style.formLabel}>
        Размер ЗП {sliderValueSalary}
        <input
          type="range"
          value={sliderValueSalary}
          min="1000"
          max="3500"
          step="500"
          id="myRange"
          onChange={changeSliderValueSalary}
        />
        </label>

          <button type="submit" >
            Сохранить
          </button>
      </form>}
      {role === ROLE.employer && <form className={style.form} onSubmit={''}>
        <label className={style.formLabel}>
            Имя
          <input
            name="name"
            required
            type="text"
            value={valueName}
            onChange={handleChangeName}
          />
        </label>

        <label className={style.formLabel}>
            Название организации
          <input
            name="company"
            required
            type="text"
            value={valueCompanyName}
            onChange={handleChangeNameCompany}
          />
        </label>

          <button type="submit" >
            Сохранить
          </button>
      </form>}
    </div>)
}

