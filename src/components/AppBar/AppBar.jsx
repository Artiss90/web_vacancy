import ListVacancy from 'components/ListVacancy/ListVacancy'
import ViewRegistration from 'components/ViewRegistration/ViewRegistration'
import { Route, Switch } from 'react-router'
import style from './AppBar.module.scss'

export default function AppBar() {
    return (<div className={style.container}>
        <Switch>
              <Route exact path="/" component={ListVacancy} />
              <Route exact path="/registration" component={ViewRegistration} />  
        </Switch>

    </div>)
}
