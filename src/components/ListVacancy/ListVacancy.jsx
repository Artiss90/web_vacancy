import axios from 'axios';
import { useEffect, useState } from 'react'
import { styleNames } from 'utils/style-names';
import style from './ListVacancy.module.scss'

const sn = styleNames(style);

export default function ListVacancy() {
    const [listVacancy, setListVacancy] = useState('')
    const [checkItem, setCheckItem] = useState('')
    const [infoVacancy, setInfoVacancy] = useState('')
    const [successApplyForVacancy, setSuccessApplyForVacancy] = useState(false)
    const [startPagePagination, setStartPagePagination] = useState(0)

    const USER_TOKEN = 'z8hHegpeAPhEL8R5vVlcTbp59gVGozq93LPnL3WZ9KhUHLXJfetUuczTM5yh'
    const AMOUNT_VISIBLE_VACANCY = 5

    const paginationVacancy = listVacancy ? [...listVacancy].slice(startPagePagination, startPagePagination + AMOUNT_VISIBLE_VACANCY) : ''

    useEffect(() => {
        const getDataVacancy = () => axios.get('http://api.witam.work/api-witam.pl.ua/site/public/api/offers?order[by]=id&order[way]=desc', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Bearer ${USER_TOKEN}`
            }
        }).then(resolve => {
            setListVacancy(resolve.data.data.offers)
            console.log("🚀 ~ file: ListVacancy.jsx ~ line 25 ~ useEffect ~ resolve", resolve)
        }, reject => console.error(reject))
        getDataVacancy()
    }, [])

    useEffect(() => {
        const getInfoById = (vacancyID) => axios.get(`http://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Bearer ${USER_TOKEN}`
            }
        }).then(resolve => {
            setInfoVacancy(resolve.data.data.offer.description)
            console.log("🚀 ~ file: ListVacancy.jsx ~ line 25 ~ useEffect ~ resolve", resolve)
        }, reject => console.error(reject))
        if (checkItem !== '') { getInfoById(checkItem) }
    }, [checkItem])

    const goNextPage = () => {
        setStartPagePagination(startPagePagination + AMOUNT_VISIBLE_VACANCY)
    }
    const goPreviousPage = () => {
        if (startPagePagination >= AMOUNT_VISIBLE_VACANCY)
            setStartPagePagination(startPagePagination - AMOUNT_VISIBLE_VACANCY)
    }
    const goBackList = () => {
        setSuccessApplyForVacancy(false)
        setCheckItem('')
    }

    const applyForVacancy = (vacancyID) => axios.post(`http://api.witam.work/api-witam.pl.ua/site/public/api/offers/${vacancyID}/apply`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${USER_TOKEN}`
        }
    }).then(resolve => {
        setSuccessApplyForVacancy(true)
    }, reject => console.error(reject))



    return (
        <div>
            {paginationVacancy &&
                <div>
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
                                        <p className={style.text}><span>Детальная инфо по ссылке </span><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/27a1.png" alt="➡️" />:<button type='button' className={style.btnLinkInfo} onClick={() => setCheckItem(id)}>{`/job_${id}`}</button></p>
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
                                                {infoVacancy && infoVacancy.split('\\n').join('&перенос_строки&').split('\n').join('&перенос_строки&').split('<br/>').join('&перенос_строки&').split('&перенос_строки&').map((listItem, i) => <li key={i} className={style.info}>{listItem}</li>)}
                                            </ul>
                                            {successApplyForVacancy ? <p className={style.textSuccess}>✅ Отправлено</p> :
                                                // ! закоменчено пока запрос не работает, стоит заглушка которая просто переключает флаг
                                                // <button type='button' className={style.buttonLinkExpanded} onClick={() => { applyForVacancy(id) }}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4ac.png" alt="💬" />Откликнутся</button>
                                                <button type='button' className={style.buttonLinkExpanded} onClick={() => { setSuccessApplyForVacancy(true) }}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4ac.png" alt="💬" />Откликнутся</button>
                                            }
                                        </div>}
                                    </li>)
                                }
                                )

                            }
                        </ul>
                    </div>
                    {!checkItem ? <div className={style.containerBtnControl}>
                        <button type='button' className={style.buttonLink} onClick={() => goNextPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/25b6.png" alt="▶️" />Далее</button>
                        {startPagePagination !== 0 && <button type='button' className={style.buttonLinkRight} onClick={() => goPreviousPage()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Назад</button>}
                    </div>
                        :
                        <button type='button' className={style.buttonLinkExpanded} onClick={() => goBackList()}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/21a9.png" alt="↩️" />Назад к списку</button>}
                    <a className={style.buttonLink} href='./'><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/2b05.png" alt="⬅️" />Меню</a>
                </div>}
        </div>
    )
}