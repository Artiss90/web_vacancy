import axios from 'axios';
import { useEffect, useState } from 'react'
import { styleNames } from 'utils/style-names';
import style from './ListVacancy.module.scss'

const sn = styleNames(style);

export default function ListVacancy() {
    const [listVacancy, setListVacancy] = useState('')
    const [checkItem, setCheckItem] = useState('')
    const [startPagePagination, setStartPagePagination] = useState(0)

    const AMOUNT_VISIBLE_VACANCY = 5

    const paginationVacancy = listVacancy ? [...listVacancy].slice(startPagePagination, startPagePagination + AMOUNT_VISIBLE_VACANCY) : ''

    useEffect(() => {
        const getDataVacancy = () => axios.get('http://api.witam.work/api-witam.pl.ua/site/public/api/offers?order[by]=id&order[way]=desc', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: 'Bearer z8hHegpeAPhEL8R5vVlcTbp59gVGozq93LPnL3WZ9KhUHLXJfetUuczTM5yh'
            }
        }).then(resolve => {
            setListVacancy(resolve.data.data.offers)
            console.log(resolve.data.data.offers)
        }, reject => console.error(reject))
        getDataVacancy()
    }, [])

    const goNextPage = () => {
        setStartPagePagination(startPagePagination + AMOUNT_VISIBLE_VACANCY)
    }
    const goPreviousPage = () => {
        if (startPagePagination >= AMOUNT_VISIBLE_VACANCY)
            setStartPagePagination(startPagePagination - AMOUNT_VISIBLE_VACANCY)
    }
    const goBackList = () => {
        setCheckItem('')
    }
    return (
        <div>
            {paginationVacancy && <div className={style.container}>
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
                                        {description.split('\\n').join('&перенос_строки&').split('\n').join('&перенос_строки&').split('<br/>').join('&перенос_строки&').split('&перенос_строки&').map((listItem, i) => <li key={i} className={style.info}>{listItem}</li>)}
                                    </ul>
                                </div>}
                            </li>)
                        }
                        )

                    }
                </ul>
                {!checkItem ? <div>
                    <button type='button' className={style.buttonLink} onClick={() => goNextPage()}>Вперед</button>
                    {startPagePagination !== 0 && <button type='button' className={style.buttonLink} onClick={() => goPreviousPage()}>Назад</button>}
                </div>
                    :
                    <button type='button' className={style.buttonLink} onClick={() => goBackList()}>Вернутся к списку</button>}
                <a className={style.buttonLink}>Меню</a>
            </div>}

        </div>
    )
}