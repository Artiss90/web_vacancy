import style from './ViewRegistration.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
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
    const [valueCategoryJob, setValueCategoryJob] = useState([]);
    const [valueLocation, setValueLocation] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState([]);
    const [selectedVacancyId, setSelectedVacancyId] = useState([]);

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
const handleChangeCategoryJob = (e, newValue) => {
    //* нахождение вакансии по id 
    const getVacanciesId = newValue.map( item=> Number(item.id))
    setSelectedVacancyId(getVacanciesId) 
    
    setValueCategoryJob(newValue);
  };
//* изменение локации
const handleChangeLocation = (e, newValue) => {
    //* нахождение страны по id 
    const getCountriesId = newValue.map( item=> Number(item.id))
    setSelectedCountryId(getCountriesId)
   
    setValueLocation(newValue);
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
        body.location_id = selectedCountryId
        body.category_id = selectedVacancyId
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
        {role === ROLE.applicant && <form className={style.formStretch} onSubmit={handleSubmitRegister}>
          <TextField
          style = {{marginBottom: '0.5rem'}}
          label="Имя"
          id="outlined-size-small"
          size="small"
          value={valueName}
          onChange={handleChangeName}
        />

<div className={style.label}>
        <Autocomplete
        multiple
        value={valueCategoryJob}
        onChange={handleChangeCategoryJob}
        id="tags-outlined"
        options={categoriesJobs}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Категории работы"
          />
        )}
      />
</div>

<div className={style.label}>
        <Autocomplete
        multiple
        value={valueLocation}
        onChange={handleChangeLocation}
        id="tags-outlined"
        options={locations}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Локация"
          />
        )}
      />
</div>

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

        <Button variant="contained" type="submit">Сохранить</Button>
      </form>}

      {role === ROLE.employer && <form className={style.form} onSubmit={handleSubmitRegister}>
        <div className={style.label}>
          <TextField
          label="Имя"
          id="outlined-size-small"
          size="small"
          value={valueName}
          onChange={handleChangeName}
        />
        </div>
        <div className={style.label}>
          <TextField
          label="Название организации"
          id="outlined-size-small"
          size="small"
          value={valueCompanyName}
          onChange={handleChangeNameCompany}
        />
        </div>
        
        <Button variant="contained" type="submit">Сохранить</Button>
      </form>}
    </div>)
}

