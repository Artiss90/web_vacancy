import axios from 'axios';
import { useEffect, useMemo, useState } from 'react'
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import Loader from 'react-loader-spinner';
import { styleNames } from 'utils/style-names';
import style from './ListVacancy.module.scss'

const sn = styleNames(style);

export default function ListVacancy() {
    const [listVacancy, setListVacancy] = useState('')
    const [checkItem, setCheckItem] = useState('')
    const [infoVacancy, setInfoVacancy] = useState('')
    const [successApplyForVacancy, setSuccessApplyForVacancy] = useState(false)
    const [endList, setEndList] = useState(false)
    const [loading, setLoading] = useState(false)
    const [getEdit, setGetEdit] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [showViewDeleteVacancy, setShowViewDeleteVacancy] = useState(false)
    const [textMenu, setTextMenu] = useState('')
    const [listApply, setListApply] = useState('')
    const [valueInput, setValueInput] = useState('')
    const [fieldName, setFieldName] = useState('')
    const [listCountry, setListCountry] = useState('')
    const [listCity, setListCity] = useState('')
    const [startPagePagination, setStartPagePagination] = useState(0)
    console.log("🚀 ~ file: ListVacancy.jsx ~ line 15 ~ ListVacancy ~ infoVacancy", infoVacancy)
    
    const ROLE_CUSTOMER = 'customer';
    const ROLE_EMPLOYER = 'admin';

    const LIST_FIELD_NAME = {
        name: 'name',
        category_id: 'category_id',
        description: 'description',
        phone_number: 'phone_number',
        salary: 'salary',
        location_id: 'location_id'
    }
    
    const search = createBrowserHistory().location.search; // * текущий параметр
    const ROLE = createBrowserHistory().location.pathname.replace(/\//g, '') || ROLE_CUSTOMER; // * текущий путь

    const parsedSearch = queryString.parse(search); // * массив параметров
    const clientToken = parsedSearch.client || 'OqYL567T6iGztlLKwiaAjOp7WPSzlmY8LEeTJT2vBnTkbl1OAyh7sppHRfZX'; // ! убрать по-умолчанию после теста
    const orderBy = parsedSearch['order[by]'] || 'id';
    const orderWay = parsedSearch['order[way]'] || 'desc';
    const userId = parsedSearch['user-id'] || '88'; // ! убрать по-умолчанию после теста
    const AMOUNT_VISIBLE_VACANCY = parsedSearch['v_limit'] || 4; // ? количество отображаемых вакансий на странице
    const memoizedHeader = useMemo(() => {
        const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${clientToken}`
    }
return headers}, [clientToken]);

    axios.defaults.headers = memoizedHeader // хедеры по умолчанию для всех запросов 
    const paginationVacancy = listVacancy ? [...listVacancy].slice(startPagePagination, startPagePagination + AMOUNT_VISIBLE_VACANCY) : ''

    useEffect(() => {
        setLoading(true)
        const getDataVacancyCustomer = () => axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers?order[by]=${orderBy}&order[way]=${orderWay}`).then(resolve => {
            setListVacancy(resolve.data.data.offers)
            setLoading(false)
        }, reject => {
            setLoading(false)
            console.error(reject)})
        const getDataVacancyEmployer = () => axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/userOffers/${userId}`
    ).then(resolve => {
            setListVacancy(resolve.data.data.user_offers) 
            setLoading(false)
        }, reject => {
            setLoading(false)
            console.error(reject)})
            if(ROLE === ROLE_CUSTOMER){ getDataVacancyCustomer()}
            if(ROLE === ROLE_EMPLOYER){ getDataVacancyEmployer()}
            
    }, [ROLE, clientToken, memoizedHeader, orderBy, orderWay, userId, refresh])

    useEffect(() => {
        setLoading(true)
        const getInfoById = (vacancyID) => axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}`).then(resolve => {
            setLoading(false)
            setInfoVacancy(resolve.data.data.offer)
        }, reject => {
            setLoading(false)
            console.error(reject)})
        if (checkItem !== '') { 
            getInfoById(checkItem)
            return
        }
        setLoading(false)
    }, [checkItem, clientToken, memoizedHeader])

    const goNextPage = () => {
        const roundLengthVacancy = listVacancy.length - listVacancy.length % AMOUNT_VISIBLE_VACANCY
        setStartPagePagination(startPagePagination + AMOUNT_VISIBLE_VACANCY)
        if ((startPagePagination + AMOUNT_VISIBLE_VACANCY) === roundLengthVacancy) { // ? если дошли до конца списка - убираем кнопку далее
            setEndList(true)
            return
        }
    }
    const goPreviousPage = () => {
        if (startPagePagination >= AMOUNT_VISIBLE_VACANCY) { setStartPagePagination(startPagePagination - AMOUNT_VISIBLE_VACANCY) }
        setEndList(false)
    }
    
    const applyForVacancy = (vacancyID) => axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}/apply`).then(resolve => {
    if(resolve.status === 201){ 
    setSuccessApplyForVacancy(true)
    return
    }
    console.error('в ответе пришел не статус 201');
    }, reject => console.error(reject))

    const getUpdateDate = (id)=> {axios.patch(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${id}/dateUpdate`).then(resolve => {
        if(resolve.status === 200){ 
        setTextMenu('⏰ Поздравляю, вакансия самая первая в поиске')
        return
        }
        console.error('в ответе пришел не статус 200');
    }, reject => console.error(reject))}
    
    const getEditVacancy = (id)=> {
        axios.patch(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${id}/update`, {
        "_method": "patch",
        [LIST_FIELD_NAME.name]: fieldName === LIST_FIELD_NAME.name ? valueInput : infoVacancy.name,
        [LIST_FIELD_NAME.category_id]: [infoVacancy.categories[0].id],
        [LIST_FIELD_NAME.description]: fieldName === LIST_FIELD_NAME.description ? valueInput : infoVacancy.description,
        [LIST_FIELD_NAME.phone_number]: fieldName === LIST_FIELD_NAME.phone_number ? valueInput : infoVacancy.phone_number,
        [LIST_FIELD_NAME.salary]: fieldName === LIST_FIELD_NAME.salary ? +valueInput : infoVacancy.salary[0].salary,
        [LIST_FIELD_NAME.location_id]: fieldName === LIST_FIELD_NAME.location_id ? valueInput : infoVacancy.locations[0].id
    }).then(resolve => {
        if(resolve.status === 200){ 
        setTextMenu('Вакансия обновлена! 💾')
        setValueInput('')
        setRefresh(!refresh)
        return
        }
        console.error('в ответе пришел не статус 200');
    }, reject => {
        setValueInput('')
        setRefresh(!refresh)
        console.error(reject)})}

    // ! getListCountry не разобрался как получить города определенной страны
    const getListCountry = ()=> {axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/locations?countriesOnly=true`
    ).then(resolve => {
        if(resolve.status === 200){ 
            setListCountry(resolve.data.data.locations)
        return
        }
        console.error('в ответе пришел не статус 200');
    }, reject => console.error(reject))}

    const getListCityByCountry = (countryId)=> {axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/locations?parent[]=${countryId}`
    ).then(resolve => {
        if(resolve.status === 200){ 
        setListCity(resolve.data.data.locations[50].children)
        setTextMenu('Укажите город, в котором будет предоставлена работа')
        setListCountry('')
        return
        }
        console.error('в ответе пришел не статус 200');
    }, reject => console.error(reject))}
    
    const deleteVacancy = (id) => {axios.delete(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${id}/delete`).then(resolve => {
        if(resolve.status === 200){ 
            setTextMenu('Вакансия удалена ❌')
            return
        }
        console.error('в ответе пришел не статус 200');
        }, reject => {
            setTextMenu('Откликов ненайдено') // ? 404 ошибка когда откликов нет  
            console.error(reject)})}

    const getShowApply = (id) => {axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${id}/showApply`).then(resolve => {
        if(resolve.status === 200){ 
            setListApply(resolve.data.data.applications)
            return
        }
        console.error('в ответе пришел не статус 200');
        }, reject => {
            setTextMenu('Откликов ненайдено') // ? 404 ошибка когда откликов нет  
            console.error(reject)})}

    const changeValueInput = evt => {
        evt.preventDefault()
        setValueInput(evt.target.value)}

    const goBackList = () => {
                setLoading(true)
                setSuccessApplyForVacancy(false)
                setInfoVacancy('')
                setCheckItem('')
                setGetEdit(false)
                setTextMenu('')
                setListApply('')
                setValueInput('')
                setListCity('')
                setShowViewDeleteVacancy(false)
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            }
    return (
        <div>
            {paginationVacancy &&
                <div>
                    {loading ?
                    <div className={style.containerLoader}>
                        <Loader
                        type="TailSpin"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={6000} //6 secs
                      />
                    </div> 
                   :
                    <div className={style.container}>
                        <ul className={style.list}>
                            {!checkItem ?
                                paginationVacancy.map(({ id, updated_at, location_name, name, salary, salary_unit_name, category, category_name, description }) => {
                                    const categoryName = category ? category[0].name : category_name; 
                                    const dataCountry = location_name.split(' ');
                                    const countryAlt = dataCountry[0];
                                    const country = dataCountry[1];
                                    const city = dataCountry[2];

                                    const date = new Date(updated_at);
                                    const visibleDate = date.toLocaleString();

                                    return (<li className={sn('item')} key={id}>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/23f0.png" alt="⏰" />{visibleDate}</p>
                                        <p className={style.text}>{`${countryAlt} ${country} ${city}`}</p>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f50d.png" alt="🔍" />{`Вакансия: ${name}`}</p>
                                       <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4d4.png" alt="📔" />{`Категория: ${categoryName}`}</p>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b6.png" alt="💶" />{`Зарплата: ${salary} EUR`}</p>
                                        <p className={style.text}><span className={style.textInfo}>Детальная инфо по ссылке </span><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/27a1.png" alt="➡️" />:<button type='button' className={style.btnLinkInfo} onClick={() => setCheckItem(id)}>{`/job_${id}`}</button></p>
                                    </li>)
                                }
                                )                               
                                :

                                paginationVacancy.map(({ id, updated_at, location_name, name, salary, salary_unit_name, category, category_name, description }) => {
                                    if (checkItem !== id) {
                                        return false
                                    }
                                    const categoryName = category ? category[0].name : category_name;
                                    const dataCountry = location_name.split(' ');
                                    const countryAlt = dataCountry[0];
                                    const country = dataCountry[1];
                                    const city = dataCountry[2];

                                    const date = new Date(updated_at);
                                    const visibleDate = date.toLocaleString();

                                    return (<li className={sn('item')} key={id}>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/23f0.png" alt="⏰" />{visibleDate}</p>
                                        <p className={style.text}>{`${countryAlt} ${country} ${city}`}</p>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f50d.png" alt="🔍" />{fieldName === LIST_FIELD_NAME.name 
                                        ? `Вакансия: ${valueInput}` 
                                        : `Вакансия: ${name}`}</p>
                                         <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4d4.png" alt="📔" />{`Категория: ${categoryName}`}</p>
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b6.png" alt="💶" />{fieldName === LIST_FIELD_NAME.salary 
                                        ? `Зарплата: ${valueInput} EUR` 
                                        : `Зарплата: ${salary} EUR`}</p>
                                        <p className={style.text}>Детальная информация:</p>
                                        <br />
                                        {checkItem && <div>
                                            <ul>
                                                <p className={style.textInfo}>{fieldName === LIST_FIELD_NAME.description 
                                                ? valueInput 
                                                : infoVacancy.description}</p>
                                                <br />
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b2.png" alt="💲" />Работодатель: <a href={`https://${infoVacancy.user_site}`} title={`https://${infoVacancy.user_site}`} className={style.btnLinkWork}>{infoVacancy.user_company}</a></p>
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f3e2.png" alt="🏢" />{infoVacancy.user_address}</p>
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4f1.png" alt="📱" /><a href={`tel:${infoVacancy.phone_number}`} className={style.btnLinkWork}>{fieldName === LIST_FIELD_NAME.phone_number 
                                                ? valueInput 
                                                : infoVacancy.phone_number}</a></p>
                                            </ul>
                                        </div>}
                                    </li>)
                                }
                                )
                            }
                        </ul>
                    </div>
                    }
                    {/* кнопки управления для искателя работы */}
                   {infoVacancy && ROLE === ROLE_CUSTOMER && <button type='button' className={style.buttonLinkExpanded} onClick={() => { applyForVacancy(infoVacancy?.id) }}>{successApplyForVacancy ? "✅ Отправлено" : "💬 Откликнутся"}</button>}
                     {/* кнопки управления для работодателя не в режиме редактирования вакансии*/}
                   {infoVacancy && ROLE === ROLE_EMPLOYER && !getEdit && 
                   <div>
                       {/* информирующее сообщение для пользователя*/}
                        <p className={style.textMenu}>{textMenu}</p>
                       {/* блок отображения списка откликов     */}
        {listApply && <div className={style.textMenu}> 
                        <p className={style.text}>{` ℹ Отклики на вакансию ${infoVacancy.name}`}</p>
                    {infoVacancy?.locations && <p className={style.text}>{`🌐 ${infoVacancy.locations[0].name}`}</p>}
                        <p className={style.text}>Отклики👇:</p>
        <ul>
        {listApply.map(item => <li key={item.user_phone}>
            <p className={style.text}>{`👤   ${item.user_name}`}</p>
            <p className={style.text}>☎️<a href={`tel:${item.user_phone}`} className={style.btnLinkWork}>{item.user_phone}</a></p>
        </li>)}
        </ul>
        </div>}  
        {showViewDeleteVacancy && <div className={style.containerBtnControlMenu}>
            <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        deleteVacancy(infoVacancy?.id)
                        setShowViewDeleteVacancy(false)
                           }}>{"Да 🗑️"}</button>
            <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setShowViewDeleteVacancy(false)
                        setTextMenu('')
                           }}>{"Нет"}</button>
            </div>}
                    {/* основной блок кнопок управления */}
            {!showViewDeleteVacancy && <div className={style.containerBtnControlMenu}>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setListApply('')
                        setTextMenu('Что вы хотите изменить? ✏️')
                           }}>{"✏️ Редактировать"}</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setListApply('')
                        getUpdateDate(infoVacancy?.id)
                           }}>{"🆙 Дата"}</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => {
                        setListApply('') 
                        setTextMenu('Хотите удалить вакансию?')
                        setShowViewDeleteVacancy(true) // * окно подтверждение удаления
                           }}>{"❌ Удалить"}</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        getShowApply(infoVacancy?.id)
                           }}>{"💬 Отклики"}</button>
                   </div>}
                   </div>}
                   {/* кнопки управления для работодателя в режиме редактирования вакансии*/}
                   {infoVacancy && ROLE === ROLE_EMPLOYER && getEdit && 
                   <div>
                       {/* информирующее сообщение для пользователя*/}
                       <p className={style.textMenu}>{textMenu}</p>
                       {showInput && <div>
                           {/* для редакции большинства полей*/}
                           {((fieldName !== LIST_FIELD_NAME.description ) && (fieldName !== LIST_FIELD_NAME.location_id )) && <input type={(fieldName === LIST_FIELD_NAME.salary) ? 'number' : 'text'} onChange={changeValueInput} value={valueInput} className={style.field}/>}
                            {/* для редакции поля 'описания' мультилинейное поле */}
                           {fieldName === LIST_FIELD_NAME.description && <textarea onChange={changeValueInput} value={valueInput} className={style.field}/>}
                           {fieldName === LIST_FIELD_NAME.location_id && <ul className={style.containerBtnControlMenu}>
                            {listCountry && listCountry.map(item => <li key={item.id} className={style.locationItem}><button type='button' className={style.buttonLinkExpanded} onClick={() => getListCityByCountry(item.id)
                           }>{item.name}</button></li>)}
                            {listCity && listCity.map(item => <li key={item.id} className={style.locationItem}><button type='button' className={style.buttonLinkExpanded} onClick={() => {
                                setTextMenu(`Вы выбрали город ${item.name}. Нажмите Сохранить💾 чтоб подтвердить свой выбор`)
                                setValueInput(item.id)}
                           }>{item.name}</button></li>)}
                               </ul>}
                           <div className={style.containerBtnControlMenu}>
                           <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setTextMenu('')
                        getEditVacancy(infoVacancy?.id)
                        setShowInput(false)
                        setFieldName('')
                        setValueInput('')
                           }}>Сохранить 💾</button>
                           <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setValueInput('')
                        setShowInput(false)
                        setFieldName('')
                        setTextMenu('Что вы хотите изменить? ✏️')
                           }}>Отмена ❌</button>
                           </div>
                           </div>}
                       {/* основной блок кнопок редактирования */}
                       {!showInput && <div className={style.containerBtnControlMenu}>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setShowInput(true)
                        setFieldName(LIST_FIELD_NAME.name)
                        setTextMenu('Укажите новое значение для параметра 📎 Название')
                           }}>📎 Название</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setShowInput(true)
                        setFieldName(LIST_FIELD_NAME.description)
                        setTextMenu('Укажите новое значение для параметра 📜 Описание')
                           }}>📜 Описание</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setShowInput(true)
                        setFieldName(LIST_FIELD_NAME.salary)
                        setTextMenu('Ежемесячная зарплата в EUR? Напиши только ЦИФРУ, например 1000 или 1500')
                           }}>💶 Зарплата</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setShowInput(true)
                        setFieldName(LIST_FIELD_NAME.phone_number)
                        setTextMenu('Укажите новое значение для параметра 📲 Номер телефона')
                           }}>📲 Номер телефона</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(true)
                        setShowInput(true)
                        setFieldName(LIST_FIELD_NAME.location_id)
                        getListCountry()
                        setTextMenu('В какой стране 🌐 будет работать сотрудник?')
                           }}>🌐 Геолокация</button>
                       <button type='button' className={style.buttonLinkGroup} onClick={() => { 
                        setGetEdit(false)
                        setValueInput('')
                        setTextMenu('')
                           }}>⬅️ Назад</button>
                       </div>}
                   </div>}

                    {!checkItem ? <div className={style.containerBtnControl}>
                        {startPagePagination !== 0 && <button type='button' className={sn({ 'buttonLinkMargin': !endList }, { 'buttonLink': endList })} onClick={() => goPreviousPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Назад</button>}
                        {/*отображаем если не конец списка и если длина списка больше количества вакансий на 1 странице*/}
                        {!endList && (listVacancy.length > AMOUNT_VISIBLE_VACANCY)&& <button type='button' className={style.buttonLink} onClick={() => goNextPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/25b6.png" alt="▶️" />Далее</button>}
                    </div>
                        :
                        <button type='button' className={style.buttonLinkExpanded} onClick={() => goBackList()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/21a9.png" alt="↩️" />Назад к списку</button>}
                    {/* <a className={style.buttonLink} href='./'><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Меню</a> */}
                </div>
                }
        </div >
    )
}