import Header from "../components/header";

const MainPage = ({locale}: {locale: string}) => {
  
  const validLocales = ["ko", "en"];
  if (!validLocales.includes(locale)) {
    return <div>Invalid locale</div>;
  }

  return (
    <div>
      <Header />
    </div>
  )
}

export default MainPage;