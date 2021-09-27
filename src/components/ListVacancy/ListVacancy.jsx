import { useState } from 'react'
import { styleNames } from 'utils/style-names';
import style from './ListVacancy.module.scss'

const sn = styleNames(style);

const exampleList = [
    {
        data: '22/09/2021 22:37',
        country: {
            flag: 'https://web.telegram.org/z/img-apple-64/1f1f5-1f1f1.png',
            alt: 'PL',
            nameCountry: 'Польша',
            nameCity: 'Познань'
        },
        vacancy: 'РАБОТНИК В ПРАЧЕЧНОЙ',
        price: '960 EUR',
        infoUrl: 'http://localhost:3000',
        nameUrl: '/job_167',
        id: 1
    },
    {
        data: '22/09/2021 22:37',
        country: {
            flag: 'https://web.telegram.org/z/img-apple-64/1f1f5-1f1f1.png',
            alt: 'PL',
            nameCountry: 'Польша',
            nameCity: 'Познань'
        },
        vacancy: 'РАБОТНИК В ПРАЧЕЧНОЙ',
        price: '960 EUR',
        infoUrl: 'http://localhost:3000',
        nameUrl: '/job_167',
        id: 2
    },
    {
        data: '22/09/2021 22:37',
        country: {
            flag: 'https://web.telegram.org/z/img-apple-64/1f1f5-1f1f1.png',
            alt: 'PL',
            nameCountry: 'Польша',
            nameCity: 'Познань'
        },
        vacancy: 'РАБОТНИК В ПРАЧЕЧНОЙ',
        price: '960 EUR',
        infoUrl: 'http://localhost:3000',
        nameUrl: '/job_167',
        id: 3
    },
    {
        data: '22/09/2021 22:37',
        country: {
            flag: 'https://web.telegram.org/z/img-apple-64/1f1f5-1f1f1.png',
            alt: 'PL',
            nameCountry: 'Польша',
            nameCity: 'Познань'
        },
        vacancy: 'РАБОТНИК В ПРАЧЕЧНОЙ',
        price: '960 EUR',
        infoUrl: 'http://localhost:3000',
        nameUrl: '/job_167',
        id: 4
    },
    {
        data: '22/09/2021 22:37',
        country: {
            flag: 'https://web.telegram.org/z/img-apple-64/1f1f5-1f1f1.png',
            alt: 'PL',
            nameCountry: 'Польша',
            nameCity: 'Познань'
        },
        vacancy: 'РАБОТНИК В ПРАЧЕЧНОЙ',
        price: '960 EUR',
        infoUrl: 'http://localhost:3000',
        nameUrl: '/job_167',
        id: 5
    }]

const exampleInfo = `Место работы: Poznań , (Daszewice) 15км. от Poznań

ТРЕБОВАНИЯ:

●Мужчины;
● Био / виза / карта побыта;
● БЕЗ опыта;
● Возраст: до 55 лет.
    ОБЯЗАННОСТИ:
● Сварка калиток для ворот;
● Помощь в сварке;
УСЛОВИЯ:
● Ставка 16 - 18 zł нетто(в зависимости от опыта);
● Смена: 12 часов; 6 дней в неделю.
● Жильё: 300зл./ мес.по 2 - 4 чел. (сем.пары отдельно).
● Доезд - БЕСПЛАТНЫЙ.
● Русскоговорящий координатор.
● Официальное трудоустройство: оформление КАРТЫ ПОБЫТА!
● Выход на работу на СЛЕДУЮЩИЙ день.

Работодатель: null
+ 380664801265`

export default function ListVacancy() {
    const [linkInfo, setLinkInfo] = useState('')
    const [checkItem, setCheckItem] = useState('')
    const getInfo = (url) => { setLinkInfo(url) }
    return (
        <div>
            <div className={style.container}>
                <ul className={style.list}>
                    {exampleList.map(({ id, data, country: { flag, alt, nameCountry, nameCity }, vacancy, price, infoUrl, nameUrl }) => {
                        let check = false;
                        if (checkItem === id) {
                            check = true
                        }
                        return (<li className={sn('item', { 'item__check': check })} key={id}>
                            <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/23f0.png" alt="⏰" />{data}</p>
                            <p className={style.text}><img className={style.icon} src={flag} alt={alt} />{`${nameCountry}, ${nameCity}`}</p>
                            <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f50d.png" alt="🔍" />{`Вакансия: ${vacancy}`}</p>
                            <p className={style.text}><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/1f4b6.png" alt="💶" />{`Зарплата: ${price}`}</p>
                            <p className={style.text}><span>Детальная инфо по ссылке </span><img className={style.icon} src="https://web.telegram.org/z/img-apple-64/27a1.png" alt="➡️" />:<button type='button' className={style.btnLinkInfo} onClick={() => setCheckItem(id)}>{nameUrl}</button></p>
                            {checkItem && <div><p>{exampleInfo}</p></div>}
                        </li>)
                    }
                    )
                    }
                </ul>
                <button type='button' className={style.buttonLink} onClick={() => setCheckItem('')}>Далее</button>
                <a className={style.buttonLink}>Меню</a>
            </div>

        </div>
    )
}