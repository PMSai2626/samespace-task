import Header from './Header'

const Layout = ({children, backgroundColor}) => {
  return (
    <>
    <Header backgroundColor = {backgroundColor} />
    <div>{children}</div>
    </>
      )
}

export default Layout
