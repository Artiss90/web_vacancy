import style from './ViewRegistration.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import axios from 'axios';

const ROLE = {
    employer: 3,
    applicant: 4
}

export default function ViewRegistration  () {
    const search = createBrowserHistory().location.search; // * текущий параметр строки браузера
    const parsedSearch = queryString.parse(search); // * массив параметров строки браузера
    const role = Number(parsedSearch['role']);
    const phone = parsedSearch['phone'] || '';
    
    //* хедеры по-умолчанию
    const memoizedHeader = useMemo(() => { 
            const headers = {
            'X-Requested-With': 'XMLHttpRequest'
        }
    return headers}, []);
    
    axios.defaults.headers = memoizedHeader //* хедеры по умолчанию для всех запросов

    const [sliderValueSalary, setSliderValueSalary] = useState(1500);
    const [valueName, setValueName] = useState('')
    const [valueCompanyName, setValueCompanyName] = useState('')
    const [categoriesJobs, setCategoriesJobs] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredVacancy, setFilteredVacancy] = useState([]);
    const [valueCategoryJob, setValueCategoryJob] = useState([]);
    const [valueLocation, setValueLocation] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState([]);
    const [selectedVacancyId, setSelectedVacancyId] = useState([]);

//* отфильтровывание выбранных стран
useEffect(() => {
   if(locations.length>0){
    setFilteredLocations(locations)
   }
}, [locations]);
useEffect(() => {
    if(locations.length>0){
        setFilteredLocations(locations.filter(item=> !selectedCountryId.includes(item.name)))
    }
}, [locations, selectedCountryId])

//* отфильтровывание выбранных вакансий
useEffect(() => {
   if(categoriesJobs.length>0){
    setFilteredVacancy(categoriesJobs)
   }
}, [categoriesJobs]);
useEffect(() => {
    if(categoriesJobs.length>0){
        setFilteredVacancy(categoriesJobs.filter(item=> !selectedVacancyId.includes(item.name)))
    }
}, [categoriesJobs, selectedVacancyId])

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
        setSelectedVacancyId([...selectedVacancyId, fondedVacancy?.name])
       }
    
    setValueCategoryJob([...valueCategoryJob, Number(e.target.value)]);
    getNameVacancy(Number(e.target.value));
  };
//* изменение локации
const handleChangeLocation = (e) => {
    //* нахождение страны по id 
    const getNameCountry = (idCountry) => {
    const fondedCountry = locations.find( item=> item.id === idCountry)
    setSelectedCountryId([...selectedCountryId, fondedCountry?.name])
   }

    setValueLocation([...valueLocation,Number(e.target.value)]);
    getNameCountry(Number(e.target.value));

  };

//* отправка формы  
const handleSubmitRegister = (e) => {
    e.preventDefault();
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
        axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/register`, body).then(resolve => {
    if(resolve.status === 200){ 
    return
    }
    console.error('в ответе пришел не статус 200');
    }, reject => console.error(reject))
    }

    //* register for applicant
    if(role === ROLE.applicant){
        body.name = valueName
        body.location_id = valueLocation
        body.category_id = valueCategoryJob
        body.salary = sliderValueSalary
        axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/register`, body).then(resolve => {
    if(resolve.status === 200){ 
    return
    }
    console.error('в ответе пришел не статус 200');
    }, reject => console.error(reject))
}
}

    return (<div className={style.mainContainer}>
        <h2 className={style.headTitle}>Форма регистрации</h2>
        {role === ROLE.applicant && <form className={style.form} onSubmit={handleSubmitRegister}>
        <label className={style.label}>
            Имя
          <input
            className={style.input}
            name="name"
            required
            type="text"
            value={valueName}
            onChange={handleChangeName}
          />
        </label>

        <label className={style.label}>
        Категории работы
        <p>Выбранные категории: {selectedVacancyId.join(', ')}</p>
          <select
            className={style.input}
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

        <label className={style.label}>
        Локация 
        <p>Выбранные страны: {selectedCountryId.join(', ')}</p>
          <select
            className={style.input}
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

        <label className={style.label}>
        Размер ЗП {sliderValueSalary}
        <input
          className={style.inputSlider}
          type="range"
          value={sliderValueSalary}
          min="1000"
          max="3500"
          step="500"
          id="myRange"
          onChange={changeSliderValueSalary}
        />
        </label>

          <button type="submit" className={style.btnSubmit}>
            Сохранить
          </button>
      </form>}
      {role === ROLE.employer && <form className={style.form} onSubmit={handleSubmitRegister}>
        <label className={style.label}>
            Имя
          <input
            className={style.input}
            name="name"
            required
            type="text"
            value={valueName}
            onChange={handleChangeName}
          />
        </label>

        <label className={style.label}>
            Название организации
          <input
            className={style.input}
            name="company"
            required
            type="text"
            value={valueCompanyName}
            onChange={handleChangeNameCompany}
          />
        </label>

          <button type="submit" className={style.btnSubmit}>
            Сохранить
          </button>
      </form>}
    </div>)
}

