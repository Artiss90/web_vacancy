import AppBar from 'components/AppBar/AppBar';
import ViewRegistration from 'components/ViewRegistration/ViewRegistration';
import { Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import style from './App.module.css'
import { styleNames } from 'utils/style-names';

const sn = styleNames(style);
const isViewRegistration = createBrowserHistory().location.pathname === '/registration' ? true : false;

function App() {
 

  const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight() // ? динамически определяем высоту экрана и запишем её в css переменную

  return <div className={sn('containerApp', {containerAppRegistration: isViewRegistration})}>
    <Switch>
        <Route exact path="/" component={AppBar} />
        <Route exact path="/registration" component={ViewRegistration} />
    </Switch>
  </div>;
}

export default App;
