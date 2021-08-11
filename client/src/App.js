import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import BuildListPage from './pages/BuildListPage'
import BuildDetailsPage from './pages/BuildDetailsPage'
import Footer from './components/Footer'
import CreateBuildPage from './pages/CreateBuildPage'
import MyBuildsPage from './pages/MyBuildsPage'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/' component={BuildListPage} exact />
          <Route path='/login' component={LoginPage} />
          <Route path='/mine' exact component={MyBuildsPage} />
          <Route path='/build/create' exact component={CreateBuildPage} />
          <Route path='/builds/:buildId' component={BuildDetailsPage} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
