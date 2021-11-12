import ListVacancy from 'components/ListVacancy/ListVacancy'

import style from './AppBar.module.scss'

export default function AppBar() {
    return (<div className={style.container}>
       <ListVacancy/>
    </div>)
}
