import style from './ViewRegistration.module.scss';
import { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios';

const ROLE = {
    employer: 3,
    applicant: 4
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, values, theme) {
  const style = {
    fontWeight:
    values.indexOf(name) === -1
    ? theme.typography.fontWeightRegular
    : theme.typography.fontWeightMedium,
  };
  return style
}

export default function ViewRegistration  () {
    const theme = useTheme();
    const search = createBrowserHistory().location.search; // * текущий параметр строки браузера
    const parsedSearch = queryString.parse(search); // * массив параметров строки браузера
    const role = Number(parsedSearch['role']);
    const phone = parsedSearch['phone'] ? `+${parsedSearch['phone'].trim()}` : '';

    const [sliderValueSalary, setSliderValueSalary] = useState(1500);
    const [valueName, setValueName] = useState('')
    const [valuePhone, setValuePhone] = useState(phone)
    const [valueCompanyName, setValueCompanyName] = useState('')
    const [categoriesJobs, setCategoriesJobs] = useState([]);
    const [nameCategoriesJobs, setNameCategoriesJobs] = useState([]);
    const [valueCategoryJob, setValueCategoryJob] = useState([]);
    const [locations, setLocations] = useState([]);
    const [nameLocations, setNameLocations] = useState([]);
    const [valueLocation, setValueLocation] = useState([]);
    const [errorRegistration, setErrorRegistration] = useState('');
    const [isRegistrated, setIsRegistrated] = useState(false);
    const [isSuccessRegistrated, setIsSuccessRegistrated] = useState(false);

//* запрос на получение списка параметров
useEffect(() => {
    const getDataAllParams = () => axios.get('https://api.witam.work/api-witam.pl.ua/site/public/api/allParams').then(resolve => {
        const allParams = resolve.data
        const findCategoriesData = allParams.find( item =>item.original.message === "Список категорий успешно получен")
        const findLocationsData = allParams.find( item =>item.original.message === "Список локализаций успешно получен")
        if (findCategoriesData){
         const allCategories = Object.values(findCategoriesData?.original?.data?.categories)
         setCategoriesJobs(allCategories)
         const nameCategories = allCategories.map(item=>item.name)
         setNameCategoriesJobs(nameCategories)
        }
        if (findLocationsData){
         const allLocations = Object.values(findLocationsData?.original?.data?.locations)
         setLocations(allLocations)
         const nameLocations = allLocations.map(item=>item.name)
         setNameLocations(nameLocations)
        }
    }, reject => {
        console.error(reject)})
        getDataAllParams()
}, [])

//* изменение имени
const handleChangeName = (e) => {
    setValueName(e.target.value);
  };
//* изменение телефона
const handleChangePhone = (e) => {
    setValuePhone(e.target.value);
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
const handleChangeCategoryJob = (event) => {
  const {
    target: { value },
  } = event;
  setValueCategoryJob(
    // On autofill we get a the stringified value.
    typeof value === 'string' ? value.split(',') : value,
  );
};
//* изменение локации
const handleChangeLocation = (event) => {
  const {
    target: { value },
  } = event;
  setValueLocation(
    // On autofill we get a the stringified value.
    typeof value === 'string' ? value.split(',') : value,
  );
};
//* отправка формы  
const handleSubmitRegister = (e) => {
    e.preventDefault();
    const body = {}
    body.user_type_id = role;
    body.phone_number = valuePhone;
    
    //* register for employer
    if(role === ROLE.employer){
        if(valueCompanyName){
            body.company_name = valueCompanyName
        }
        body.name = valueName
        axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/register`, body).then(result => {
    if(result.status === 200){ 
    setErrorRegistration('')
    setIsRegistrated(true)
    
    return result
    }
    console.error('в ответе пришел не статус 200');
    })
    .then(result => axios.post(`https://api.chatbullet.com/api/v1/send/a72e2cfc7a7acc4989f308f263f3ee12/1000345`, {token: result?.data?.token, user: result?.data?.data, id: role, phone: valuePhone}))
    .then(result=>{
      setIsSuccessRegistrated(true)
    })
    .catch(error => {
      if(error?.response?.data?.errors)
      {setErrorRegistration(Object.values(error.response.data.errors).join('/ '))}
      console.log(error)
    })
    }

    //* register for applicant
    if(role === ROLE.applicant){
      const selectedById = (list, selectedItems) => {
        return list.reduce((acc, value) => {
          const includesName = selectedItems.includes(value.name)
          if(includesName){ 
            acc = [...acc, value.id]
          }
          return acc
        }, []);  
      }
      const selectedVacancyId = selectedById(categoriesJobs, valueCategoryJob)
      const selectedCountryId = selectedById(locations, valueLocation)
        body.name = valueName
        body.location_id = selectedCountryId
        body.category_id = selectedVacancyId
        body.salary = sliderValueSalary
        axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/register`, body).then(result => {
          if(result.status === 200){ 
            setErrorRegistration('')
            setIsRegistrated(true)
           
          return result
          }
          console.error('в ответе пришел не статус 200');})
          .then(result => axios.post(`https://api.chatbullet.com/api/v1/send/a72e2cfc7a7acc4989f308f263f3ee12/1000345`, {token: result?.data?.token, user: result?.data?.data, id: role}))
          .then(result=>{
            setIsSuccessRegistrated(true)
          })
          .catch(error => {
            if(error?.response?.data?.errors)
            {setErrorRegistration(Object.values(error.response.data.errors).join('/ '))}
            console.log(error)
          })
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
          required
          value={valueName}
          onChange={handleChangeName}
        />

          <TextField
          style = {{marginBottom: '0.5rem'}}
          label="Телефон"
          type="tel"
          placeholder="введите номер вашего телефонного номера"
          required
          id="outlined-size-small"
          size="small"
          value={valuePhone}
          onChange={handleChangePhone}
        />

<FormControl sx={{ mb: 1 }} className={style.label}>
    <InputLabel id="demo-multiple-chip-label">Категории работы*</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          required
          value={valueCategoryJob}
          onChange={handleChangeCategoryJob}
          input={<OutlinedInput id="select-multiple-chip" label="Категории работы" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {nameCategoriesJobs.map((name) =>(
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, valueCategoryJob, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
        </FormControl>

<FormControl sx={{ mb: 1 }} className={style.label}>
    <InputLabel id="demo-multiple-chip-label">Локация*</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          required
          value={valueLocation}
          onChange={handleChangeLocation}
          input={<OutlinedInput id="select-multiple-chip" label="Локация*" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {nameLocations.map((name) =>(
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, valueLocation, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
        </FormControl>

        <label className={style.label}>
       <p className={style.textSlider}>Заработная плата {sliderValueSalary} €</p>
        <input
          className={style.inputSlider}
          type="range"
          value={sliderValueSalary}
          min="500"
          max="3500"
          step="100"
          id="myRange"
          onChange={changeSliderValueSalary}
        />
        </label>

        <Button variant="contained" type="submit" disabled={isRegistrated}>Зарегистрироваться</Button>
        {errorRegistration && <p className={style.messageError}>{errorRegistration}</p>}
        {isSuccessRegistrated && <p className={style.messageSuccess}>Регистрация успешна</p>}
      </form>}

      {role === ROLE.employer && <form className={style.formStretch} onSubmit={handleSubmitRegister}>

          <TextField
          style = {{marginBottom: '0.5rem'}}
          label="Имя"
          required
          id="outlined-size-small"
          size="small"
          value={valueName}
          onChange={handleChangeName}
        />
 
        <TextField
          style = {{marginBottom: '0.5rem'}}
          label="Телефон"
          type="tel"
          placeholder="введите номер вашего телефонного номера"
          required
          id="outlined-size-small"
          size="small"
          value={valuePhone}
          onChange={handleChangePhone}
        />

          <TextField
          style = {{marginBottom: '0.5rem'}}
          label="Название организации"
          id="outlined-size-small"
          size="small"
          value={valueCompanyName}
          onChange={handleChangeNameCompany}
        />
        
        <Button variant="contained" type="submit" disabled={isRegistrated}>Зарегистрироваться</Button>
        {errorRegistration && <p className={style.messageError}>{errorRegistration}</p>}
        {isSuccessRegistrated && <p className={style.messageSuccess}>Регистрация успешна</p>}
      </form>}
    </div>)
}

