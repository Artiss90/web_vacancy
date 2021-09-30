import axios from 'axios';
import { useEffect, useState } from 'react'
import { createBrowserHistory } from 'history'
import { styleNames } from 'utils/style-names';
import style from './ListVacancy.module.scss'
import Loader from 'react-loader-spinner';

const sn = styleNames(style);

export default function ListVacancy() {
    const [listVacancy, setListVacancy] = useState('')
    const [checkItem, setCheckItem] = useState('')
    const [infoVacancy, setInfoVacancy] = useState('')
    console.log("🚀 ~ file: ListVacancy.jsx ~ line 13 ~ ListVacancy ~ infoVacancy", infoVacancy)
    const [successApplyForVacancy, setSuccessApplyForVacancy] = useState(false)
    const [endList, setEndList] = useState(false)
    const [loading, setLoading] = useState(false)
    const [startPagePagination, setStartPagePagination] = useState(0)

    const search = createBrowserHistory().location.search; // * текущий параметр
    const USER_TOKEN = 'z8hHegpeAPhEL8R5vVlcTbp59gVGozq93LPnL3WZ9KhUHLXJfetUuczTM5yh' // ! для тестов, потом убрать
    const clientToken = search.replace('?client=', '') || USER_TOKEN;

    const AMOUNT_VISIBLE_VACANCY = 4

    const paginationVacancy = listVacancy ? [...listVacancy].slice(startPagePagination, startPagePagination + AMOUNT_VISIBLE_VACANCY) : ''

    useEffect(() => {
        setLoading(true)
        const getDataVacancy = () => axios.get('https://api.witam.work/api-witam.pl.ua/site/public/api/offers?order[by]=id&order[way]=desc', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Bearer ${clientToken}`
            }
        }).then(resolve => {
            setListVacancy(resolve.data.data.offers)
            setLoading(false)
            console.log("🚀 ~ file: ListVacancy.jsx ~ line 25 ~ useEffect ~ resolve", resolve)
        }, reject => {
            setLoading(false)
            console.error(reject)})
        getDataVacancy()
    }, [clientToken])

    useEffect(() => {
        setLoading(true)
        const getInfoById = (vacancyID) => axios.get(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Bearer ${clientToken}`
            }
        }).then(resolve => {
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
    }, [checkItem,clientToken])

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
    const goBackList = () => {
        setLoading(true)
        setSuccessApplyForVacancy(false)
        setInfoVacancy('')
        setCheckItem('')
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const applyForVacancy = (vacancyID) => axios.post(`https://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}/apply`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${clientToken}`
        }
    }).then(resolve => {
        setSuccessApplyForVacancy(true)
    }, reject => console.error(reject))

    return (
        <div>
            {paginationVacancy &&
                <div>
                    {loading ? 
                     <Loader
                     type="TailSpin"
                     color="#00BFFF"
                     height={100}
                     width={100}
                     timeout={6000} //6 secs
                   />
                   :
                    <div className={style.container}>
                        <ul className={style.list}>
                            {!checkItem ?
                                paginationVacancy.map(({ id, updated_at, location_name, name, salary, salary_unit_name, description }) => {
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
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b6.png" alt="💶" />{`Зарплата: ${salary} ${salary_unit_name}`}</p>
                                        <p className={style.text}><span className={style.textInfo}>Детальная инфо по ссылке </span><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/27a1.png" alt="➡️" />:<button type='button' className={style.btnLinkInfo} onClick={() => setCheckItem(id)}>{`/job_${id}`}</button></p>
                                    </li>)
                                }
                                )                               
                                :

                                paginationVacancy.map(({ id, updated_at, location_name, name, salary, salary_unit_name, description }) => {
                                    if (checkItem !== id) {
                                        return false
                                    }
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
                                        <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b6.png" alt="💶" />{`Зарплата: ${salary} ${salary_unit_name}`}</p>
                                        <p className={style.text}>Детальная информация:</p>
                                        <br />
                                        {checkItem && <div>
                                            <ul>
                                                {infoVacancy.description && infoVacancy.description.split('\\n').join('&перенос_строки&').split('\n').join('&перенос_строки&').split('<br/>').join('&перенос_строки&').split('&перенос_строки&').map((listItem, i) => <li key={i} className={style.info}>{listItem}</li>)}
                                                <br />
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b2.png" alt="💲" />Работодатель: <a href={`https://${infoVacancy.user_site}`} title={`https://${infoVacancy.user_site}`} className={style.btnLinkWork}>{infoVacancy.user_company}</a></p>
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f3e2.png" alt="🏢" />{infoVacancy.user_address}</p>
                                                <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4f1.png" alt="📱" /><a href={`tel:${infoVacancy.user_phone}`} className={style.btnLinkWork}>{infoVacancy.user_phone}</a></p>
                                            </ul>
                                        </div>}
                                    </li>)
                                }
                                )
                            }
                        </ul>
                    </div>
                    }
                   {infoVacancy && <button type='button' className={style.buttonLinkExpanded} onClick={() => { applyForVacancy(infoVacancy?.id) }}>{successApplyForVacancy ? "✅ Отправлено" : "💬 Откликнутся"}</button>}
                    {!checkItem ? <div className={style.containerBtnControl}>
                        {startPagePagination !== 0 && <button type='button' className={sn({ 'buttonLinkMargin': !endList }, { 'buttonLink': endList })} onClick={() => goPreviousPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Назад</button>}
                        {!endList && <button type='button' className={style.buttonLink} onClick={() => goNextPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/25b6.png" alt="▶️" />Далее</button>}
                    </div>
                        :
                        <button type='button' className={style.buttonLinkExpanded} onClick={() => goBackList()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/21a9.png" alt="↩️" />Назад к списку</button>}
                    <a className={style.buttonLink} href='./'><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Меню</a>
                </div>
                }
        </div >
    )
}