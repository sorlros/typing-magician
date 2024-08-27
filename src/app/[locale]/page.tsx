const MainPage = ({ params }: { params: { locale: string }}) => {
  const { locale } = params;

  return (
    <div>
      <h1>{locale === "ko" ? "안녕하세요" : "Hello"}</h1>
      {/* 페이지 콘텐츠 */}
    </div>
  )
}

export default MainPage;